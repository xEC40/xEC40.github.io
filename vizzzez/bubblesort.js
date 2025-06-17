// Bubble Sort Visualization Class
class BubbleSortVisualization extends BaseVisualization {
    constructor() {
        super();
        this.initializeElements();
        this.initializeState();
        this.setupEventListeners();
    }

    initializeElements() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.barsContainer = document.getElementById('barsContainer');
        this.numBarsSlider = document.getElementById('numBars');
        this.speedSlider = document.getElementById('speed');
        this.playPauseBtn = document.getElementById('playPause');
        this.resetBtn = document.getElementById('reset');
        this.numBarsValue = document.getElementById('numBarsValue');
        this.speedValue = document.getElementById('speedValue');
    }

    initializeState() {
        // State variables
        this.array = [];
        this.originalArray = []; // Store the original unsorted array
        this.particles = [];
        this.isSorting = false;
        this.sortGenerator = null;
        this.borderAnimationId = null;
        this.hueOffset = 0;

        // Configuration
        this.DOTS_PER_BAR = 20; // Reduced number of particles per bar
        this.MAX_SPEED = 1.5; // Reduced speed for less intensive calculations
        this.FRAME_TIME = 1000 / 60;
        this.MAX_VALUE = 1000; // Maximum value for the bars
        this.RAINBOW_SPEED = .5; // Speed of rainbow color cycling - increased for more vibrant effect
    }

    setupEventListeners() {
        // Debounce function for expensive operations
        const debounce = (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        // Control event listeners
        this.numBarsSlider.addEventListener('input', debounce(() => {
            this.numBarsValue.textContent = this.numBarsSlider.value;
            if (!this.isSorting) {
                this.generateBars();
            }
        }, 100));

        this.speedSlider.addEventListener('input', () => {
            this.speedValue.textContent = this.speedSlider.value;
        });

        this.playPauseBtn.addEventListener('click', () => {
            if (this.isSorting) {
                this.stop();
            } else {
                this.start();
            }
        });

        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });

        // Initialize display values
        this.numBarsValue.textContent = this.numBarsSlider.value;
        this.speedValue.textContent = this.speedSlider.value;
    }

    initialize() {
        // Setup resize observer
        if (typeof this.resizeObserver === 'undefined') {
            this.resizeObserver = new ResizeObserver(entries => {
                const barsContainerRect = this.barsContainer.getBoundingClientRect();
                this.canvas.width = barsContainerRect.width;
                this.canvas.height = barsContainerRect.height;
            });
            this.resizeObserver.observe(this.barsContainer);
        }
        
        this.generateBars();
        this.drawParticles();
        this.animateBorders();
    }

    cleanup() {
        super.cleanup();
        if (this.sortGenerator) this.sortGenerator = null;
        if (this.borderAnimationId) {
            clearTimeout(this.borderAnimationId);
            this.borderAnimationId = null;
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }

    generateBars() {
        // Clear existing
        this.barsContainer.innerHTML = '';
        this.particles = [];
        const numBars = parseInt(this.numBarsSlider.value);
        
        // Generate random values between 10% and 100% of MAX_VALUE
        this.array = Array.from({ length: numBars }, () => Math.floor(Math.random() * (this.MAX_VALUE * 0.9)) + (this.MAX_VALUE * 0.1));
        
        // Store a copy of the original unsorted array
        this.originalArray = [...this.array];
        
        // Create bars using document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        this.array.forEach((value, i) => {
            const percentHeight = (value / this.MAX_VALUE) * 100; // Convert to percentage height
            
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
            for (let j = 0; j < this.DOTS_PER_BAR; j++) {
                this.particles.push({
                    barIndex: i,
                    x: Math.random(), // Random x position within bar width
                    y: Math.random(), // Random y position within bar height
                    vx: (Math.random() - 0.5) * this.MAX_SPEED,
                    vy: (Math.random() - 0.5) * this.MAX_SPEED
                });
            }
        });
        
        // Add all bars to DOM in one operation
        this.barsContainer.appendChild(fragment);
        
        // Draw axes
        this.drawAxes();
    }

    drawAxes() {
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
            const value = Math.round((this.MAX_VALUE / (numLabels - 1)) * i);
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

    drawParticles() {
        this.frameCount = (this.frameCount || 0) + 1;
        
        // Only update particle positions every 2 frames
        const updatePositions = this.frameCount % 2 === 0;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const barContainers = Array.from(this.barsContainer.children);
        const containerRect = this.barsContainer.getBoundingClientRect();

        // Get visible bars with their positions
        const visibleBars = barContainers.map((container, index) => {
            const rect = container.getBoundingClientRect();
            return {
                index: index,
                left: rect.left - containerRect.left,
                width: rect.width,
                top: rect.top - containerRect.top,
                height: rect.height,
                value: this.array[index]
            };
        });

        // Batch draw particles for better performance
        this.ctx.beginPath();

        // Process only particles in visible bars
        this.particles.forEach(particle => {
            // Find the corresponding visible bar
            const visibleBar = visibleBars.find(vb => vb.index === particle.barIndex);
            if (!visibleBar) return;

            const barRect = visibleBar;
            
            // Update particle position only every other frame
            if (updatePositions) {
                // Update particle position (normalized coordinates)
                particle.x += particle.vx / barRect.width;
                particle.y += particle.vy / barRect.height;

                // Bounce particles within the bar boundaries
                if (particle.x <= 0 || particle.x >= 1) {
                    particle.vx *= -0.8;
                    particle.x = Math.max(0, Math.min(1, particle.x));
                }
                if (particle.y <= 0 || particle.y >= 1) {
                    particle.vy *= -0.8;
                    particle.y = Math.max(0, Math.min(1, particle.y));
                }
            }

            // Convert to screen coordinates
            const screenX = barRect.left + particle.x * barRect.width;
            const barHeight = (visibleBar.value / this.MAX_VALUE) * barRect.height;
            const screenY = barRect.top + barRect.height - particle.y * barHeight;

            // Calculate color based on bar value
            const hue = (visibleBar.value / this.MAX_VALUE * 300 + this.hueOffset) % 360;
            this.ctx.fillStyle = `hsla(${hue}, 70%, 60%, 0.8)`;
            
            this.ctx.moveTo(screenX + 1, screenY);
            this.ctx.arc(screenX, screenY, 1, 0, Math.PI * 2);
        });

        this.ctx.fill();

        this.animationFrameId = requestAnimationFrame(this.drawParticles.bind(this));
    }

    animateBorders() {
        // Add the CSS animation styles
        this.addRainbowStyles();
        
        const barContainers = this.barsContainer.children;
        const numBars = barContainers.length;
        
        // Apply the animation to each bar once, not every frame
        Array.from(barContainers).forEach((container, i) => {
            const bar = container.querySelector('.bar');
            if (bar && bar.style.borderColor !== 'forestgreen') {
                // Only animate if not completed (not forest green)
                bar.style.borderWidth = '2px';
                bar.style.borderStyle = 'solid';
                bar.style.animation = `rainbow-border ${2 + i * 0.1}s infinite linear`;
                bar.style.animationDelay = `${i * 0.05}s`;
            }
        });
        
        // Update hue offset for particles
        this.hueOffset = (this.hueOffset + this.RAINBOW_SPEED) % 360;
        
        // Reduce update frequency - only update every 100ms instead of every frame
        this.borderAnimationId = setTimeout(this.animateBorders.bind(this), 100);
    }

    addRainbowStyles() {
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

    // Function to remove all emoji pointers
    removeAllEmojiPointers() {
        const pointers = document.querySelectorAll('.emoji-pointer');
        pointers.forEach(pointer => pointer.remove());
    }

    *bubbleSortGenerator() {
        const barContainers = Array.from(this.barsContainer.children);
        
        // Function to add emoji pointer
        const addEmojiPointer = (container) => {
            // Remove any existing emoji pointers
            this.removeAllEmojiPointers();
            
            // Create emoji pointer element
            const emojiPointer = document.createElement('div');
            emojiPointer.className = 'emoji-pointer';
            emojiPointer.textContent = '👆'; // Hand pointing up emoji
            
            // Append to container
            container.appendChild(emojiPointer);
        };
        
        for (let i = 0; i < this.array.length; i++) {
            for (let j = 0; j < this.array.length - i - 1; j++) {
                if (!this.isSorting) {
                    this.removeAllEmojiPointers();
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
                while (performance.now() - start < this.getDelay()) yield;
                
                // Remove first emoji and add to second element
                this.removeAllEmojiPointers();
                addEmojiPointer(barContainer2);
                
                // Wait a bit to show the second pointer
                const secondStart = performance.now();
                while (performance.now() - secondStart < this.getDelay() / 2) yield;

                // Perform swap if needed
                if (this.array[j] > this.array[j + 1]) {
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    
                    // Update heights and labels
                    const percentHeight1 = (this.array[j] / this.MAX_VALUE) * 100;
                    const percentHeight2 = (this.array[j + 1] / this.MAX_VALUE) * 100;
                    
                    bar1.style.height = `${percentHeight1}%`;
                    bar2.style.height = `${percentHeight2}%`;
                    
                    label1.textContent = this.array[j];
                    label2.textContent = this.array[j + 1];
                }

                // Remove highlight and emoji pointers
                bar1.classList.remove('highlight');
                bar2.classList.remove('highlight');
                this.removeAllEmojiPointers();
                yield;
            }
        }
        this.completeAnimation();
    }

    animateSort() {
        if (!this.sortGenerator) return;
        
        const start = performance.now();
        do {
            const { done } = this.sortGenerator.next();
            if (done) {
                this.sortGenerator = null;
                this.isSorting = false;
                this.updatePlayButton();
                return;
            }
        } while (performance.now() - start < this.FRAME_TIME);

        requestAnimationFrame(this.animateSort.bind(this));
    }

    updatePlayButton() {
        this.playPauseBtn.textContent = this.isSorting ? '⏸ Pause' : '▶ Play';
    }

    getDelay() {
        // Calculate delay based on speed slider value (1-200)
        const speedValue = parseInt(this.speedSlider.value);
        
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
    addCompletionStyle() {
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

    completeAnimation() {
        this.addCompletionStyle();
        
        const barContainers = this.barsContainer.children;
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
        if (this.borderAnimationId) {
            clearTimeout(this.borderAnimationId);
            this.borderAnimationId = null;
        }
        
        // Remove any remaining emoji pointers
        this.removeAllEmojiPointers();
    }

    // Function to reset the animation state without generating new bars
    resetAnimation() {
        // Reset the array to its original unsorted state
        this.array = [...this.originalArray];
        
        // Reset border colors and update bar heights
        const barContainers = this.barsContainer.children;
        Array.from(barContainers).forEach((container, i) => {
            const bar = container.querySelector('.bar');
            if (bar) {
                // Reset visual styles
                bar.style.borderColor = 'transparent';
                bar.style.boxShadow = 'none';
                bar.style.borderImageSource = '';
                bar.style.animation = 'none'; // Clear any animation
                
                // Update height and label to match the original unsorted state
                const percentHeight = (this.array[i] / this.MAX_VALUE) * 100;
                bar.style.height = `${percentHeight}%`;
                
                const valueLabel = bar.querySelector('.value-label');
                if (valueLabel) {
                    valueLabel.textContent = this.array[i];
                }
            }
        });
        
        // Restart border animation
        if (this.borderAnimationId) {
            clearTimeout(this.borderAnimationId);
            this.borderAnimationId = null;
        }
        this.animateBorders();
    }

    start() {
        super.start();
        if (!this.isSorting) {
            // Check if the animation has completed (forest green borders)
            const completedAnimation = document.querySelector('.bar[style*="forestgreen"]');
            
            // If animation was completed, reset it first and add a delay before starting
            if (completedAnimation) {
                // Reset the animation state
                this.resetAnimation();
                
                // Add a delay before starting the sorting to let the user see the shuffled state
                this.isSorting = true;
                this.updatePlayButton();
                
                // Show a visual cue that we're about to start
                const barContainers = this.barsContainer.children;
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
                    this.sortGenerator = this.bubbleSortGenerator();
                    this.animateSort();
                }, 1200); // 1.2 second delay
                
                return;
            }
            
            // Normal start (not after completion)
            this.isSorting = true;
            this.updatePlayButton();
            this.sortGenerator = this.bubbleSortGenerator();
            this.animateSort();
        } else {
            this.stop();
        }
    }

    stop() {
        super.stop();
        this.isSorting = false;
        this.updatePlayButton();
        
        // Remove any emoji pointers when pausing
        this.removeAllEmojiPointers();
    }

    reset() {
        super.reset();
        this.isSorting = false;
        this.sortGenerator = null;
        
        this.removeAllEmojiPointers();
        
        if (this.borderAnimationId) {
            clearTimeout(this.borderAnimationId);
            this.borderAnimationId = null;
        }
        
        this.generateBars();
        this.updatePlayButton();
        
        this.animateBorders();
    }
}
