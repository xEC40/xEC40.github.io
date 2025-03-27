const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const barsContainer = document.getElementById('barsContainer');
const numBarsSlider = document.getElementById('numBars');
const speedSlider = document.getElementById('speed');
const playPauseBtn = document.getElementById('playPause');
const resetBtn = document.getElementById('reset');
const numBarsValue = document.getElementById('numBarsValue');
const speedValue = document.getElementById('speedValue');

// State variables
let array = [];
let originalArray = []; // Store the original unsorted array
let particles = [];
let isSorting = false;
let sortGenerator = null;
let animationFrameId = null;
let borderAnimationId = null;
let hueOffset = 0;

// Configuration
const DOTS_PER_BAR = 20; // Reduced number of particles per bar
const MAX_SPEED = 1.5; // Reduced speed for less intensive calculations
const FRAME_TIME = 1000 / 60;
const MAX_VALUE = 1000; // Maximum value for the bars
const RAINBOW_SPEED = .5; // Speed of rainbow color cycling - increased for more vibrant effect

// Setup resize observer
const resizeObserver = new ResizeObserver(entries => {
    const barsContainerRect = barsContainer.getBoundingClientRect();
    canvas.width = barsContainerRect.width;
    canvas.height = barsContainerRect.height;
});
resizeObserver.observe(barsContainer);

// Debounce function for expensive operations
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function generateBars() {
    // Clear existing
    barsContainer.innerHTML = '';
    particles = [];
    const numBars = parseInt(numBarsSlider.value);
    
    // Generate random values between 10% and 100% of MAX_VALUE
    array = Array.from({ length: numBars }, () => Math.floor(Math.random() * (MAX_VALUE * 0.9)) + (MAX_VALUE * 0.1));
    
    // Store a copy of the original unsorted array
    originalArray = [...array];
    
    // Create bars using document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    array.forEach((value, i) => {
        const percentHeight = (value / MAX_VALUE) * 100; // Convert to percentage height
        
        // Create bar container
        const barContainer = document.createElement('div');
        barContainer.className = 'bar-container';
        
        // Create actual bar
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${percentHeight}%`;
        
        // Create value label
        const valueLabel = document.createElement('div');
        valueLabel.className = 'value-label';
        valueLabel.textContent = value;
        
        // Append elements
        bar.appendChild(valueLabel); // Put label inside bar so it's positioned relative to bar
        barContainer.appendChild(bar);
        fragment.appendChild(barContainer);

        // Create particles for this bar - initialize entirely within the bar
        for (let j = 0; j < DOTS_PER_BAR; j++) {
            particles.push({
                barIndex: i,
                x: Math.random(), // Random x position within bar width
                y: Math.random(), // Random y position within bar height
                vx: (Math.random() - 0.5) * MAX_SPEED,
                vy: (Math.random() - 0.5) * MAX_SPEED
            });
        }
    });
    
    // Add all bars to DOM in one operation
    barsContainer.appendChild(fragment);
    
    // Draw axes
    drawAxes();
}

function drawAxes() {
    // Get container dimensions
    const containerRect = document.querySelector('.container').getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    
    // Clear previous axes
    const existingAxes = document.querySelector('.axes-container');
    if (existingAxes) existingAxes.remove();
    
    // Create axes container
    const axesContainer = document.createElement('div');
    axesContainer.className = 'axes-container';
    
    // Create Y-axis
    const yAxis = document.createElement('div');
    yAxis.className = 'y-axis';
    
    // Add labels to Y-axis - from 0 at bottom to MAX_VALUE at top
    const numLabels = 6; // Number of labels (0, 200, 400, 600, 800, 1000)
    for (let i = 0; i < numLabels; i++) {
        const label = document.createElement('div');
        label.className = 'axis-label y-label';
        const value = Math.round((MAX_VALUE / (numLabels - 1)) * i);
        label.textContent = value;
        
        // Position labels from bottom (0) to top (MAX_VALUE)
        label.style.bottom = `${(i / (numLabels - 1)) * 100}%`;
        yAxis.appendChild(label);
    }
    
    // Create X-axis
    const xAxis = document.createElement('div');
    xAxis.className = 'x-axis';
    
    // Append axes to container
    axesContainer.appendChild(yAxis);
    axesContainer.appendChild(xAxis);
    
    // Append to main container
    document.querySelector('.container').appendChild(axesContainer);
}

// Track frame count for optimized updates
let frameCount = 0;

function drawParticles() {
    frameCount++;
    
    // Only update particle positions every 2 frames
    const updatePositions = frameCount % 2 === 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barContainers = Array.from(barsContainer.children);
    const containerRect = barsContainer.getBoundingClientRect();

    // Batch draw particles for better performance
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();

    // Pre-calculate visible bars for culling
    const visibleBars = [];
    barContainers.forEach((container, index) => {
        const bar = container.querySelector('.bar');
        if (bar) {
            const barRect = bar.getBoundingClientRect();
            // Only process bars that are visible in the viewport
            if (barRect.bottom >= 0 && 
                barRect.top <= window.innerHeight && 
                barRect.right >= 0 && 
                barRect.left <= window.innerWidth) {
                visibleBars.push({index, bar, rect: barRect});
            }
        }
    });

    // Process only particles in visible bars
    particles.forEach(particle => {
        // Find the corresponding visible bar
        const visibleBar = visibleBars.find(vb => vb.index === particle.barIndex);
        if (!visibleBar) return; // Skip if bar is not visible
        
        const barRect = visibleBar.rect;
        
        // Update particle position only every other frame
        if (updatePositions) {
            // Update particle position (normalized coordinates)
            particle.x += particle.vx / barRect.width;
            particle.y += particle.vy / barRect.height;

            // Simplified boundary checks with fewer calculations
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx = Math.abs(particle.vx);
            } else if (particle.x > 1) {
                particle.x = 1;
                particle.vx = -Math.abs(particle.vx);
            }
            
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy = Math.abs(particle.vy);
            } else if (particle.y > 1) {
                particle.y = 1;
                particle.vy = -Math.abs(particle.vy);
            }
        }

        // Convert to canvas coordinates - particles are confined within their bar
        const x = (barRect.left - containerRect.left) + particle.x * barRect.width;
        const y = (barRect.top - containerRect.top) + particle.y * barRect.height;

        // Add to batch drawing - use a simpler drawing approach
        ctx.moveTo(x + 1, y);
        ctx.arc(x, y, 1, 0, Math.PI * 2);
    });
    
    // Draw all particles at once
    ctx.fill();

    animationFrameId = requestAnimationFrame(drawParticles);
}

// Function to remove all emoji pointers
function removeAllEmojiPointers() {
    const pointers = document.querySelectorAll('.emoji-pointer');
    pointers.forEach(pointer => pointer.remove());
}

function* bubbleSortGenerator() {
    const barContainers = Array.from(barsContainer.children);
    
    // Function to add emoji pointer
    const addEmojiPointer = (container) => {
        // Remove any existing emoji pointers
        removeAllEmojiPointers();
        
        // Create emoji pointer element
        const emojiPointer = document.createElement('div');
        emojiPointer.className = 'emoji-pointer';
        emojiPointer.textContent = '👆'; // Hand pointing up emoji
        
        // Append to container
        container.appendChild(emojiPointer);
    };
    
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (!isSorting) {
                removeAllEmojiPointers();
                return;
            }
            
            // Get elements for comparison
            const barContainer1 = barContainers[j];
            const barContainer2 = barContainers[j + 1];
            const bar1 = barContainer1.querySelector('.bar');
            const bar2 = barContainer2.querySelector('.bar');
            const label1 = bar1.querySelector('.value-label');
            const label2 = bar2.querySelector('.value-label');
            
            // Add highlight class for visual consistency
            bar1.classList.add('highlight');
            bar2.classList.add('highlight');
            
            // Add emoji pointers below the elements being compared
            addEmojiPointer(barContainer1);
            
            // Wait with timeout
            const start = performance.now();
            while (performance.now() - start < getDelay()) yield;
            
            // Remove first emoji and add to second element
            removeAllEmojiPointers();
            addEmojiPointer(barContainer2);
            
            // Wait a bit to show the second pointer
            const secondStart = performance.now();
            while (performance.now() - secondStart < getDelay() / 2) yield;

            // Perform swap if needed
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                
                // Update heights and labels
                const percentHeight1 = (array[j] / MAX_VALUE) * 100;
                const percentHeight2 = (array[j + 1] / MAX_VALUE) * 100;
                
                bar1.style.height = `${percentHeight1}%`;
                bar2.style.height = `${percentHeight2}%`;
                
                label1.textContent = array[j];
                label2.textContent = array[j + 1];
            }

            // Remove highlight and emoji pointers
            bar1.classList.remove('highlight');
            bar2.classList.remove('highlight');
            removeAllEmojiPointers();
            yield;
        }
    }
    completeAnimation();
}

function animateSort() {
    if (!sortGenerator) return;
    
    const start = performance.now();
    do {
        const { done } = sortGenerator.next();
        if (done) {
            sortGenerator = null;
            isSorting = false;
            updatePlayButton();
            return;
        }
    } while (performance.now() - start < FRAME_TIME);

    requestAnimationFrame(animateSort);
}

function updatePlayButton() {
    playPauseBtn.textContent = isSorting ? '⏸ Pause' : '▶ Play';
}

function getDelay() {
    // Calculate delay based on speed slider value (1-200)
    // At value 1: Maximum delay (slowest)
    // At value 100: Medium speed (100%)
    // At value 200: Minimum delay (fastest - 200% speed)
    
    const speedValue = parseInt(speedSlider.value);
    
    if (speedValue <= 100) {
        // For values 1-100, use the original formula
        return (5 + (100 - speedValue) * 4) / 1.5;
    } else {
        // For values 101-200, 
        // Map to a range that goes from the delay at 100 to half that delay
        const delayAt100 = (5 + 0) / 2; // = 2.5
        const minDelay = delayAt100 / 2; // = 1.25 (twice as fast)
        const speedFactor = (speedValue - 100) / 100; // 0 to 1
        
        return delayAt100 - (speedFactor * (delayAt100 - minDelay));
    }
}

// Add style for completion animation
function addCompletionStyle() {
    if (!document.getElementById('pulse-animation')) {
        const style = document.createElement('style');
        style.id = 'pulse-animation';
        style.textContent = `
            @keyframes subtle-glow {
                from { box-shadow: 0 0 5px rgba(34, 139, 34, 0.5); }
                to { box-shadow: 0 0 10px rgba(34, 139, 34, 0.7); }
            }
        `;
        document.head.appendChild(style);
    }
}

function completeAnimation() {
    addCompletionStyle();
    
    const barContainers = barsContainer.children;
    Array.from(barContainers).forEach(container => {
        const bar = container.querySelector('.bar');
        if (bar) {
            // Remove any existing border image
            bar.style.borderImageSource = '';
            
            // Set forest green border only, keep inside transparent
            bar.style.borderColor = 'forestgreen';
            bar.style.borderWidth = '3px';
            bar.style.borderStyle = 'solid';
            bar.style.backgroundColor = 'transparent'; // Keep inside transparent
            
            // Add subtle glow effect at the end
            bar.style.boxShadow = '0 0 5px rgba(34, 139, 34, 0.5)';
            bar.style.animation = 'subtle-glow 2s infinite alternate';
        }
    });
    
    // Stop border animation when complete
    if (borderAnimationId) {
        clearTimeout(borderAnimationId);
        borderAnimationId = null;
    }
    
    // Remove any remaining emoji pointers
    removeAllEmojiPointers();
}

// Event Listeners
numBarsSlider.addEventListener('input', () => {
    numBarsValue.textContent = numBarsSlider.value;
    
    // Stop sorting if in progress
    if (isSorting) {
        isSorting = false;
        sortGenerator = null;
        updatePlayButton();
    }
    
    // Remove any emoji pointers
    removeAllEmojiPointers();
    
    // Cancel and restart animations
    if (borderAnimationId) {
        clearTimeout(borderAnimationId);
        borderAnimationId = null;
    }
    
    generateBars();
    
    // Restart border animation
    animateBorders();
});

speedSlider.addEventListener('input', debounce(() => {
    speedValue.textContent = speedSlider.value;
}, 50));

playPauseBtn.addEventListener('click', () => {
    if (!isSorting) {
        // Check if the animation has completed (forest green borders)
        const completedAnimation = document.querySelector('.bar[style*="forestgreen"]');
        
        // If animation was completed, reset it first and add a delay before starting
        if (completedAnimation) {
            // Reset the animation state
            resetAnimation();
            
            // Add a delay before starting the sorting to let the user see the shuffled state
            isSorting = true;
            updatePlayButton();
            
            // Show a visual cue that we're about to start
            const barContainers = barsContainer.children;
            Array.from(barContainers).forEach(container => {
                const bar = container.querySelector('.bar');
                if (bar) {
                    // Add a subtle pulse effect
                    bar.style.transition = 'all 0.3s ease';
                    bar.style.opacity = '0.7';
                    setTimeout(() => {
                        bar.style.opacity = '1';
                    }, 300);
                }
            });
            
            // Delay starting the sort
            setTimeout(() => {
                sortGenerator = bubbleSortGenerator();
                animateSort();
            }, 1200); // 1.2 second delay
            
            return;
        }
        
        // Normal start (not after completion)
        isSorting = true;
        updatePlayButton();
        sortGenerator = bubbleSortGenerator();
        animateSort();
    } else {
        isSorting = false;
        updatePlayButton();
        
        // Remove any emoji pointers when pausing
        removeAllEmojiPointers();
    }
});

// Function to reset the animation state without generating new bars
function resetAnimation() {
    // Reset the array to its original unsorted state
    array = [...originalArray];
    
    // Reset border colors and update bar heights
    const barContainers = barsContainer.children;
    Array.from(barContainers).forEach((container, i) => {
        const bar = container.querySelector('.bar');
        if (bar) {
            // Reset visual styles
            bar.style.borderColor = 'transparent';
            bar.style.boxShadow = 'none';
            bar.style.borderImageSource = '';
            bar.style.animation = 'none'; // Clear any animation
            
            // Update height and label to match the original unsorted state
            const percentHeight = (array[i] / MAX_VALUE) * 100;
            bar.style.height = `${percentHeight}%`;
            
            const valueLabel = bar.querySelector('.value-label');
            if (valueLabel) {
                valueLabel.textContent = array[i];
            }
        }
    });
    
    // Restart border animation
    if (borderAnimationId) {
        clearTimeout(borderAnimationId);
        borderAnimationId = null;
    }
    animateBorders();
}

resetBtn.addEventListener('click', () => {
    isSorting = false;
    sortGenerator = null;
    
    removeAllEmojiPointers();
    
    if (borderAnimationId) {
        clearTimeout(borderAnimationId);
        borderAnimationId = null;
    }
    
    generateBars();
    updatePlayButton();
    
    animateBorders();
});

// rainbow border animation styles
function addRainbowStyles() {
    if (!document.getElementById('rainbow-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-animation';
        style.textContent = `
            @keyframes rainbow-border {
                0% { border-color: #ff0000; box-shadow: 0 0 8px rgba(255, 0, 0, 0.7); }
                14% { border-color: #ff8000; box-shadow: 0 0 8px rgba(255, 128, 0, 0.7); }
                28% { border-color: #ffff00; box-shadow: 0 0 8px rgba(255, 255, 0, 0.7); }
                42% { border-color: #00ff00; box-shadow: 0 0 8px rgba(0, 255, 0, 0.7); }
                56% { border-color: #0080ff; box-shadow: 0 0 8px rgba(0, 128, 255, 0.7); }
                70% { border-color: #8000ff; box-shadow: 0 0 8px rgba(128, 0, 255, 0.7); }
                84% { border-color: #ff00ff; box-shadow: 0 0 8px rgba(255, 0, 255, 0.7); }
                100% { border-color: #ff0000; box-shadow: 0 0 8px rgba(255, 0, 0, 0.7); }
            }
        `;
        document.head.appendChild(style);
    }
}

function animateBorders() {
    // Add the CSS animation styles
    addRainbowStyles();
    
    const barContainers = barsContainer.children;
    const numBars = barContainers.length;
    
    // Apply the animation to each bar once, not every frame
    for (let i = 0; i < numBars; i++) {
        const bar = barContainers[i].querySelector('.bar');
        if (!bar) continue;
        
        // Skip if bar is currently highlighted during sorting
        if (bar.classList.contains('highlight')) continue;
        
        // Skip if animation is complete (forest green borders)
        if (bar.style.borderColor && bar.style.borderColor.includes('forestgreen')) continue;
        
        // Apply border styling once
        bar.style.borderWidth = '3px';
        bar.style.borderStyle = 'solid';
        
        // Remove the expensive border-image-source
        bar.style.borderImageSource = '';
        
        // Apply CSS animation with a slight delay based on index for a wave effect
        const delay = (i * 0.1) % 2; // Stagger the animations
        bar.style.animation = `rainbow-border 2s infinite ${delay}s`;
    }
    
    // Reduce update frequency - only update every 100ms instead of every frame
    borderAnimationId = setTimeout(animateBorders, 100);
}

// init
generateBars();
drawParticles();
animateBorders(); // Start the border animation
