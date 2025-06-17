// Neural Network Visualization Class
class NeuralNetworkVisualization extends BaseVisualization {
    constructor() {
        super();
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.canvas = null;
        
        // Network architecture
        this.inputSize = 784; // 28x28
        this.hiddenSize = 128;
        this.outputSize = 10;
        
        // Visual elements
        this.inputNeurons = [];
        this.hiddenNeurons = [];
        this.outputNeurons = [];
        
        // Connection pools for performance
        this.inputToHiddenConnections = [];
        this.hiddenToOutputConnections = [];
        
        // Mock data
        this.digitPatterns = {};
        this.weights = {};
        this.biases = {};
        this.currentDigit = 0;
        this.autoPlay = true; // Start with autoplay enabled
        this.animationSpeed = 1;
        
        // Animation state
        this.animationState = 'idle'; // idle, activating_input, propagating_hidden, propagating_output
        this.animationStartTime = 0;
        this.currentPattern = null;
        this.hiddenActivations = [];
        this.outputProbabilities = [];
        
        // UI elements
        this.confidenceBars = [];
        this.currentDigitDisplay = null;
        
        console.log('Neural Network visualization initialized');
    }

    initialize() {
        this.start(); // Start the animation loop
        this.canvas = document.getElementById('nnCanvas');
        this.currentDigitDisplay = document.getElementById('currentDigit');
        
        // Initialize confidence bars
        this.initializeConfidenceBars();
        
        // Generate mock data
        this.generateMockData();
        
        // Setup Three.js scene
        this.setupScene();
        
        // Create network visualization
        this.createNetworkVisualization();
        
        // Setup controls
        this.setupControls();
        
        // Start animation loop
        this.animate();
        
        // Show initial digit and start autoplay
        this.showDigit(0);
        
        // Start autoplay after a brief delay to let the visualization load
        setTimeout(() => {
            if (this.autoPlay) {
                this.startAutoPlay();
            }
        }, 1000);
        
        console.log('Neural Network visualization ready!');
    }

    initializeConfidenceBars() {
        this.confidenceBars = [];
        for (let i = 0; i < 10; i++) {
            const item = document.querySelector(`[data-digit="${i}"]`);
            const fill = item.querySelector('.confidence-fill');
            const value = item.querySelector('.confidence-value');
            
            this.confidenceBars.push({
                element: item,
                fill: fill,
                value: value
            });
        }
    }

    generateMockData() {
        // Generate simple digit patterns (28x28 pixels)
        this.digitPatterns = {
            0: this.createDigitPattern(0),
            1: this.createDigitPattern(1),
            2: this.createDigitPattern(2),
            3: this.createDigitPattern(3),
            4: this.createDigitPattern(4),
            5: this.createDigitPattern(5),
            6: this.createDigitPattern(6),
            7: this.createDigitPattern(7),
            8: this.createDigitPattern(8),
            9: this.createDigitPattern(9)
        };
        
        // Generate realistic weights
        this.generateWeights();
    }

    createDigitPattern(digit) {
        const pattern = new Array(784).fill(0);
        const grid = Array(28).fill().map(() => Array(28).fill(0));
        
        // Improved patterns for each digit
        switch(digit) {
            case 0: this.drawCircle(grid, 14, 14, 10); break;
            case 1: 
                this.drawLine(grid, 14, 4, 14, 24, 2); 
                this.drawLine(grid, 12, 6, 14, 4);
                break;
            case 2:
                this.drawPath(grid, [
                    {x: 8, y: 10}, {x: 20, y: 10}, {x: 20, y: 16}, 
                    {x: 8, y: 16}, {x: 8, y: 22}, {x: 20, y: 22}
                ]);
                break;
            case 3:
                this.drawPath(grid, [
                    {x: 8, y: 8}, {x: 20, y: 8}, {x: 14, y: 14},
                    {x: 20, y: 20}, {x: 8, y: 20}
                ]);
                break;
            case 4:
                // Draw the "4" - vertical line on right, horizontal line across middle, left vertical (top part only)
                this.drawLine(grid, 18, 23, 18, 5, 2);           // Right vertical line (flipped)
                this.drawLine(grid, 8, 14, 22, 14, 2);           // Horizontal crossbar (flipped)
                this.drawLine(grid, 8, 23, 8, 14, 2);            // Left vertical line (top part only, flipped)
                break;
            case 5:
                this.drawPath(grid, [
                    {x: 20, y: 21}, {x: 10, y: 21}, {x: 10, y: 21},
                    {x: 10, y: 14}, {x: 18, y: 14}, {x: 18, y: 7}, {x: 10, y: 7}
                ]);
                break;
            case 6:
                // Draw the "6" - left vertical line and bottom circle (flipped)
                this.drawLine(grid, 10, 21, 10, 7, 2);           // Left vertical line (flipped)
                this.drawLine(grid, 10, 21, 16, 19, 2);          // Top horizontal curve (flipped) 
                this.drawCircle(grid, 14, 11, 5);                // Bottom circle (flipped)
                break;
            case 7:
                // Draw the "7" - horizontal line at top, diagonal line down-left (flipped)
                this.drawLine(grid, 8, 21, 20, 21, 2);           // Top horizontal line (flipped)
                this.drawLine(grid, 18, 19, 12, 7, 2);           // Diagonal line down-left (flipped)
                break;
            case 8:
                this.drawCircle(grid, 14, 18, 4);                // Top circle (flipped)
                this.drawCircle(grid, 14, 9, 5);                 // Bottom circle (flipped)
                break;
            case 9:
                // Draw the "9" - top circle and right vertical line extending down (flipped)
                this.drawCircle(grid, 14, 18, 5);                // Top circle (flipped)
                this.drawLine(grid, 18, 18, 18, 7, 2);           // Right vertical line extending down (flipped)
                break;
        }
        
        // Convert 2D grid to 1D array
        for (let i = 0; i < 28; i++) {
            for (let j = 0; j < 28; j++) {
                pattern[i * 28 + j] = grid[i][j];
            }
        }
        
        return pattern;
    }

    drawPath(grid, points) {
        for (let i = 0; i < points.length - 1; i++) {
            this.drawLine(grid, points[i].x, points[i].y, points[i+1].x, points[i+1].y, 2);
        }
    }

    drawLine(grid, x1, y1, x2, y2, thickness = 1) {
        let dx = Math.abs(x2 - x1), sx = x1 < x2 ? 1 : -1;
        let dy = -Math.abs(y2 - y1), sy = y1 < y2 ? 1 : -1;
        let err = dx + dy, e2;
        
        for (;;){
            for (let i = -Math.floor(thickness/2); i < Math.ceil(thickness/2); i++) {
                for (let j = -Math.floor(thickness/2); j < Math.ceil(thickness/2); j++) {
                    let newY = y1 + i;
                    let newX = x1 + j;
                    if (newY >= 0 && newY < 28 && newX >= 0 && newX < 28) {
                        grid[newY][newX] = 1;
                    }
                }
            }
            if (x1 === x2 && y1 === y2) break;
            e2 = 2 * err;
            if (e2 >= dy) { err += dy; x1 += sx; }
            if (e2 <= dx) { err += dx; y1 += sy; }
        }
    }

    drawCircle(grid, cx, cy, radius) {
        for (let y = -radius; y <= radius; y++) {
            for (let x = -radius; x <= radius; x++) {
                const distance = Math.sqrt(x * x + y * y);
                if (distance <= radius && distance >= radius - 2) {
                    const px = Math.round(cx + x);
                    const py = Math.round(cy + y);
                    if (px >= 0 && px < 28 && py >= 0 && py < 28) {
                        grid[py][px] = Math.max(0, 1 - (distance - (radius - 2)) / 2);
                    }
                }
            }
        }
    }

    generateWeights() {
        // Create feature detectors for each hidden neuron
        this.weights.inputToHidden = [];
        
        for (let h = 0; h < this.hiddenSize; h++) {
            const weights = [];
            const featureType = Math.floor(h / 16); // 8 different feature types
            
            for (let i = 0; i < this.inputSize; i++) {
                const row = Math.floor(i / 28);
                const col = i % 28;
                let weight = (Math.random() - 0.5) * 0.05; // Small random noise
                
                // Create specific feature detectors
                switch(featureType) {
                    case 0: // Vertical line detectors
                        if (Math.abs(col - 14) < 2) weight += 0.8;
                        break;
                    case 1: // Horizontal line detectors
                        if (Math.abs(row - 14) < 2) weight += 0.8;
                        break;
                    case 2: // Top edge detectors
                        if (row < 10) weight += 0.6;
                        break;
                    case 3: // Bottom edge detectors
                        if (row > 18) weight += 0.6;
                        break;
                    case 4: // Left edge detectors
                        if (col < 10) weight += 0.6;
                        break;
                    case 5: // Right edge detectors
                        if (col > 18) weight += 0.6;
                        break;
                    case 6: // Circle/curve detectors
                        const centerX = 14, centerY = 14;
                        const distance = Math.sqrt((col - centerX) ** 2 + (row - centerY) ** 2);
                        if (distance > 8 && distance < 12) weight += 0.7;
                        break;
                    case 7: // Corner detectors
                        if ((row < 10 && col < 10) || (row < 10 && col > 18) || 
                            (row > 18 && col < 10) || (row > 18 && col > 18)) {
                            weight += 0.7;
                        }
                        break;
                }
                
                weights.push(weight);
            }
            this.weights.inputToHidden.push(weights);
        }
        
        // Create output weights that map features to specific digits
        this.weights.hiddenToOutput = [];
        
        for (let o = 0; o < this.outputSize; o++) {
            const weights = [];
            
            for (let h = 0; h < this.hiddenSize; h++) {
                let weight = (Math.random() - 0.5) * 0.1;
                const featureType = Math.floor(h / 16);
                
                // Map features to digits based on their characteristics
                switch(o) {
                    case 0: // Zero - needs curves
                        if (featureType === 6) weight += 1.2; // Circle detectors
                        if (featureType === 0 || featureType === 1) weight -= 0.8; // Avoid straight lines
                        break;
                    case 1: // One - needs vertical lines
                        if (featureType === 0) weight += 1.5; // Vertical line detectors
                        if (featureType === 1) weight -= 0.5; // Avoid horizontal lines
                        if (featureType === 6) weight -= 0.8; // Avoid curves
                        break;
                    case 2: // Two - needs top, middle, bottom edges
                        if (featureType === 2) weight += 0.8; // Top edge
                        if (featureType === 3) weight += 0.8; // Bottom edge
                        if (featureType === 1) weight += 0.6; // Horizontal lines
                        break;
                    case 3: // Three - needs right edge and horizontal lines
                        if (featureType === 5) weight += 0.9; // Right edge
                        if (featureType === 1) weight += 0.7; // Horizontal lines
                        if (featureType === 4) weight -= 0.5; // Avoid left edge
                        break;
                    case 4: // Four - needs vertical lines (especially right), horizontal crossbar, and corner junction
                        if (featureType === 0) weight += 1.2; // Strong vertical line response (right side)
                        if (featureType === 1) weight += 0.9; // Horizontal crossbar
                        if (featureType === 4) weight += 0.6; // Left edge (partial)
                        if (featureType === 6) weight -= 0.8; // Avoid curves
                        break;
                    case 5: // Five - needs top, left, bottom edges and horizontal middle
                        if (featureType === 2) weight += 0.8; // Top edge
                        if (featureType === 4) weight += 0.8; // Left edge
                        if (featureType === 3) weight += 0.8; // Bottom edge
                        if (featureType === 1) weight += 0.6; // Horizontal lines
                        break;
                    case 6: // Six - needs bottom circle and left vertical line
                        if (featureType === 6) weight += 1.2; // Strong curve response (bottom circle)
                        if (featureType === 4) weight += 1.0; // Left edge (vertical line)
                        if (featureType === 3) weight += 0.7; // Bottom edge
                        if (featureType === 2) weight += 0.4; // Some top edge
                        break;
                    case 7: // Seven - needs top edge and diagonal down-left
                        if (featureType === 2) weight += 1.4; // Strong top edge
                        if (featureType === 5) weight += 0.8; // Right edge start
                        if (featureType === 3) weight -= 1.0; // Strongly avoid bottom edge
                        if (featureType === 4) weight -= 0.6; // Avoid left edge
                        if (featureType === 6) weight -= 0.8; // Avoid curves
                        break;
                    case 8: // Eight - needs curves strongly (two circles)
                        if (featureType === 6) weight += 1.5; // Strong curve response
                        if (featureType === 1) weight += 0.3; // Some horizontal
                        if (featureType === 2) weight += 0.4; // Top edge
                        if (featureType === 3) weight += 0.4; // Bottom edge
                        break;
                    case 9: // Nine - needs top circle and right vertical line
                        if (featureType === 6) weight += 1.1; // Top circle
                        if (featureType === 5) weight += 1.0; // Right edge (vertical line)
                        if (featureType === 2) weight += 0.6; // Top edge
                        if (featureType === 4) weight -= 0.4; // Avoid left edge
                        break;
                }
                
                weights.push(weight);
            }
            this.weights.hiddenToOutput.push(weights);
        }
        
        // Set biases to help with classification
        this.biases.hidden = Array(this.hiddenSize).fill().map(() => -0.2); // Slight negative bias
        this.biases.output = Array(this.outputSize).fill().map((_, i) => {
            // Give each digit a small starting bias
            return -0.5 + (Math.random() * 0.2);
        });
    }

    setupScene() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.clientWidth / this.canvas.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 50);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // Setup controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 100;
        this.controls.minDistance = 20;
        
        // Handle resize
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize);
    }

    createNetworkVisualization() {
        // Create input layer (28x28 grid)
        this.createInputLayer();
        
        // Create hidden layer
        this.createHiddenLayer();
        
        // Create output layer
        this.createOutputLayer();
        
        // Create connection pools
        this.createConnectionPools();
    }

    createInputLayer() {
        const inputGroup = new THREE.Group();
        const gridSize = 28;
        const spacing = 0.8;
        const startX = -(gridSize * spacing) / 2;
        const startY = -(gridSize * spacing) / 2;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
                const material = new THREE.MeshLambertMaterial({ 
                    color: 0x333333,
                    transparent: true,
                    opacity: 0.3
                });
                
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(
                    startX + col * spacing,
                    startY + row * spacing,
                    -20
                );
                
                cube.userData = { 
                    layer: 'input', 
                    index: row * gridSize + col,
                    originalColor: 0x333333,
                    originalOpacity: 0.3
                };
                
                inputGroup.add(cube);
                this.inputNeurons.push(cube);
            }
        }
        
        this.scene.add(inputGroup);
    }

    createHiddenLayer() {
        const hiddenGroup = new THREE.Group();
        const rows = 8;
        const cols = 16;
        const spacing = 2;
        const startX = -(cols * spacing) / 2;
        const startY = -(rows * spacing) / 2;
        
        for (let i = 0; i < this.hiddenSize; i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            
            const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
            const material = new THREE.MeshLambertMaterial({ 
                color: 0x444444,
                transparent: true,
                opacity: 0.4
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(
                startX + col * spacing,
                startY + row * spacing,
                0
            );
            
            cube.userData = { 
                layer: 'hidden', 
                index: i,
                originalColor: 0x444444,
                originalOpacity: 0.4
            };
            
            hiddenGroup.add(cube);
            this.hiddenNeurons.push(cube);
        }
        
        this.scene.add(hiddenGroup);
    }

    createOutputLayer() {
        const outputGroup = new THREE.Group();
        const spacing = 3;
        const startY = -(this.outputSize * spacing) / 2;
        
        for (let i = 0; i < this.outputSize; i++) {
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshLambertMaterial({ 
                color: 0x555555,
                transparent: true,
                opacity: 0.5
            });
            
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(0, startY + i * spacing, 20);
            
            cube.userData = { 
                layer: 'output', 
                index: i,
                originalColor: 0x555555,
                originalOpacity: 0.5
            };
            
            outputGroup.add(cube);
            this.outputNeurons.push(cube);
        }
        
        this.scene.add(outputGroup);
    }

    createConnectionPools() {
        const MAX_CONNECTIONS = 150;

        const createPool = (count) => {
            const pool = [];
            for (let i = 0; i < count; i++) {
                const geometry = new THREE.BufferGeometry();
                const material = new THREE.LineBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0,
                    visible: false
                });
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
                pool.push(line);
            }
            return pool;
        };

        this.inputToHiddenConnections = createPool(MAX_CONNECTIONS);
        this.hiddenToOutputConnections = createPool(MAX_CONNECTIONS);
    }

    setupControls() {
        // Previous/Next digit buttons
        document.getElementById('prevDigit').addEventListener('click', () => {
            if (this.animationState === 'idle') {
                this.currentDigit = (this.currentDigit - 1 + 10) % 10;
                this.showDigit(this.currentDigit);
            }
        });
        
        document.getElementById('nextDigit').addEventListener('click', () => {
            if (this.animationState === 'idle') {
                this.currentDigit = (this.currentDigit + 1) % 10;
                this.showDigit(this.currentDigit);
            }
        });
        
        // Auto play toggle
        const autoPlayBtn = document.getElementById('autoPlay');
        // Set initial state to reflect autoplay is enabled
        autoPlayBtn.classList.add('active');
        autoPlayBtn.addEventListener('click', () => {
            this.autoPlay = !this.autoPlay;
            autoPlayBtn.classList.toggle('active', this.autoPlay);
            if (this.autoPlay) {
                this.startAutoPlay();
            }
        });
        
        // Reset view
        document.getElementById('resetView').addEventListener('click', () => {
            this.controls.reset();
            this.camera.position.set(0, 0, 50);
        });
        
        // Speed control
        const speedSlider = document.getElementById('nnSpeed');
        const speedValue = document.getElementById('nnSpeedValue');
        speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseFloat(e.target.value);
            speedValue.textContent = `${this.animationSpeed}x`;
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                const digit = parseInt(e.key);
                if (this.animationState === 'idle') {
                    this.currentDigit = digit;
                    this.showDigit(digit);
                }
            }
        });
    }

    showDigit(digit) {
        if (this.animationState !== 'idle') return;
        
        this.currentDigit = digit;
        this.currentDigitDisplay.textContent = digit;
        
        // Reset all neurons and connections
        this.resetVisualization();
        
        // Get digit pattern
        this.currentPattern = this.digitPatterns[digit];
        
        // Start animation state machine
        this.animationState = 'activating_input';
        this.animationStartTime = Date.now();
    }

    resetVisualization() {
        // Reset input neurons
        this.inputNeurons.forEach(neuron => {
            neuron.material.color.setHex(neuron.userData.originalColor);
            neuron.material.opacity = neuron.userData.originalOpacity;
        });
        
        // Reset hidden neurons
        this.hiddenNeurons.forEach(neuron => {
            neuron.material.color.setHex(neuron.userData.originalColor);
            neuron.material.opacity = neuron.userData.originalOpacity;
        });
        
        // Reset output neurons
        this.outputNeurons.forEach(neuron => {
            neuron.material.color.setHex(neuron.userData.originalColor);
            neuron.material.opacity = neuron.userData.originalOpacity;
        });
        
        // Hide all connections in pools
        this.inputToHiddenConnections.forEach(c => c.material.visible = false);
        this.hiddenToOutputConnections.forEach(c => c.material.visible = false);
        
        // Reset confidence bars
        this.confidenceBars.forEach(bar => {
            bar.element.classList.remove('predicted');
            bar.fill.style.width = '0%';
            bar.value.textContent = '0%';
        });
    }

    calculateHiddenActivations() {
        const activations = [];
        for (let h = 0; h < this.hiddenSize; h++) {
            let sum = this.biases.hidden[h];
            for (let i = 0; i < this.inputSize; i++) {
                sum += this.currentPattern[i] * this.weights.inputToHidden[h][i];
            }
            // Use ReLU activation but with better scaling
            activations[h] = Math.max(0, sum);
        }
        
        // Normalize activations to prevent explosion but preserve relative differences
        const maxActivation = Math.max(...activations);
        if (maxActivation > 0) {
            this.hiddenActivations = activations.map(a => a / maxActivation);
        } else {
            this.hiddenActivations = activations;
        }
        
        this.updateActiveConnections(
            this.inputToHiddenConnections,
            this.inputNeurons,
            this.hiddenNeurons,
            this.currentPattern,
            this.hiddenActivations,
            this.weights.inputToHidden
        );
    }

    calculateOutputProbabilities() {
        // Hardcoded prediction logic for visualization purposes
        // Always predict the current digit correctly with high confidence
        this.outputProbabilities = new Array(10).fill(0);
        
        // Current digit gets high confidence (85-95%)
        const correctConfidence = 0.85 + Math.random() * 0.1;
        this.outputProbabilities[this.currentDigit] = correctConfidence;
        
        // Add 1-2 random "second guesses" with lower confidence
        const numSecondGuesses = Math.floor(Math.random() * 2) + 1;
        const remainingConfidence = 1 - correctConfidence;
        
        const availableDigits = [];
        for (let i = 0; i < 10; i++) {
            if (i !== this.currentDigit) {
                availableDigits.push(i);
            }
        }
        
        // Shuffle and pick random digits for second guesses
        for (let i = 0; i < numSecondGuesses && availableDigits.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableDigits.length);
            const digit = availableDigits.splice(randomIndex, 1)[0];
            
            // Assign decreasing confidence to secondary guesses
            const confidence = remainingConfidence * (0.3 + Math.random() * 0.4) / (i + 1);
            this.outputProbabilities[digit] = confidence;
        }
        
        // Distribute any remaining tiny confidence among other digits
        const usedConfidence = this.outputProbabilities.reduce((sum, val) => sum + val, 0);
        const leftoverConfidence = Math.max(0, 1 - usedConfidence);
        
        if (leftoverConfidence > 0 && availableDigits.length > 0) {
            const perDigit = leftoverConfidence / availableDigits.length;
            availableDigits.forEach(digit => {
                this.outputProbabilities[digit] = perDigit * (0.5 + Math.random() * 0.5);
            });
        }
        
        // Normalize to ensure probabilities sum to 1
        const total = this.outputProbabilities.reduce((sum, val) => sum + val, 0);
        if (total > 0) {
            this.outputProbabilities = this.outputProbabilities.map(p => p / total);
        }
        
        this.updateActiveConnections(
            this.hiddenToOutputConnections,
            this.hiddenNeurons,
            this.outputNeurons,
            this.hiddenActivations,
            this.outputProbabilities,
            this.weights.hiddenToOutput
        );
    }
    
    updateActiveConnections(pool, fromLayer, toLayer, fromActivations, toActivations, weights) {
        const connections = [];
        const fromThreshold = 0.2;
        const toThreshold = 0.05;

        for (let j = 0; j < toLayer.length; j++) {
            if (toActivations[j] > toThreshold) {
                for (let i = 0; i < fromLayer.length; i++) {
                    if (fromActivations[i] > fromThreshold) {
                        const weight = Math.abs(weights[j][i]);
                        if (weight > 0.05) {
                            connections.push({
                                from: fromLayer[i],
                                to: toLayer[j],
                                strength: fromActivations[i] * toActivations[j] * weight,
                                weight: weights[j][i]
                            });
                        }
                    }
                }
            }
        }
        
        connections.sort((a, b) => b.strength - a.strength);
        
        pool.forEach((line, index) => {
            if (index < connections.length) {
                const conn = connections[index];
                line.geometry.setFromPoints([conn.from.position, conn.to.position]);
                line.geometry.needsUpdate = true;
                line.material.color.setHex(conn.weight > 0 ? 0x4CAF50 : 0xF44336);
                line.userData.targetOpacity = Math.min(conn.strength * 8, 0.8);
                line.material.visible = true;
            } else {
                line.material.visible = false;
            }
        });
    }

    updateAnimation() {
        const now = Date.now();
        const elapsed = now - this.animationStartTime;

        let stateChanged = false;

        if (this.animationState === 'activating_input') {
            const duration = 500 / this.animationSpeed;
            const progress = Math.min(elapsed / duration, 1);
            
            this.currentPattern.forEach((activation, i) => {
                if (activation > 0) {
                    const neuron = this.inputNeurons[i];
                    const intensity = activation * progress;
                    neuron.material.color.setHex(this.interpolateColor(0x333333, 0x4CAF50, intensity));
                    neuron.material.opacity = 0.3 + intensity * 0.7;
                }
            });

            if (progress >= 1) {
                this.calculateHiddenActivations();
                this.animationState = 'propagating_hidden';
                stateChanged = true;
            }
        }
        
        if (this.animationState === 'propagating_hidden') {
            const duration = 800 / this.animationSpeed;
            const progress = stateChanged ? 0 : Math.min(elapsed / duration, 1);

            this.hiddenActivations.forEach((activation, h) => {
                if (activation > 0.1) {
                    const neuron = this.hiddenNeurons[h];
                    const intensity = activation * progress;
                    neuron.material.color.setHex(this.interpolateColor(0x444444, 0x2196F3, intensity));
                    neuron.material.opacity = 0.4 + intensity * 0.6;
                }
            });
            this.inputToHiddenConnections.forEach(line => {
                if(line.material.visible) line.material.opacity = line.userData.targetOpacity * progress;
            });

            if (progress >= 1) {
                this.calculateOutputProbabilities();
                this.animationState = 'propagating_output';
                stateChanged = true;
            }
        }
        
        if (this.animationState === 'propagating_output') {
            const duration = 800 / this.animationSpeed;
            const progress = stateChanged ? 0 : Math.min(elapsed / duration, 1);
            const predictedDigit = this.outputProbabilities.indexOf(Math.max(...this.outputProbabilities));

            this.outputProbabilities.forEach((prob, o) => {
                const neuron = this.outputNeurons[o];
                const intensity = prob * progress;
                
                if (o === predictedDigit) {
                    const color = predictedDigit === this.currentDigit ? 0x4CAF50 : 0xFF9800; // Green if correct, orange if wrong
                    neuron.material.color.setHex(this.interpolateColor(0x555555, color, intensity));
                } else if(o === this.currentDigit) {
                    neuron.material.color.setHex(this.interpolateColor(0x555555, 0xF44336, intensity)); // Red for the actual answer if mispredicted
                } else {
                    neuron.material.color.setHex(this.interpolateColor(0x555555, 0x2196F3, intensity)); // Blue for others
                }
                neuron.material.opacity = 0.5 + intensity * 0.5;

                const confidence = Math.round(prob * 100);
                const bar = this.confidenceBars[o];
                bar.fill.style.width = `${confidence * progress}%`;
                bar.value.textContent = `${Math.round(confidence * progress)}%`;

                if (progress > 0.9) {
                    if (o === predictedDigit) bar.element.classList.add('predicted');
                    else bar.element.classList.remove('predicted');
                }
            });
            
            this.hiddenToOutputConnections.forEach(line => {
                if(line.material.visible) line.material.opacity = line.userData.targetOpacity * progress;
            });

            if (progress >= 1) {
                this.animationState = 'idle';
                if (this.autoPlay) {
                    setTimeout(() => {
                        if (this.autoPlay) {
                            // Generate a random digit instead of sequential
                            this.currentDigit = Math.floor(Math.random() * 10);
                            this.showDigit(this.currentDigit);
                        }
                    }, 2000 / this.animationSpeed);
                }
            }
        }
        
        if (stateChanged) {
            this.animationStartTime = Date.now();
        }
    }

    interpolateColor(color1, color2, factor) {
        const c1 = new THREE.Color(color1);
        const c2 = new THREE.Color(color2);
        return c1.lerp(c2, factor).getHex();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startAutoPlay() {
        if (this.autoPlay && this.animationState === 'idle') {
            // Generate a random digit instead of sequential
            this.currentDigit = Math.floor(Math.random() * 10);
            this.showDigit(this.currentDigit);
        }
    }

    animate() {
        if (!this.isRunning) return;
        
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        
        if (this.animationState !== 'idle') {
            this.updateAnimation();
        }
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        if (!this.canvas || !this.camera || !this.renderer) return;
        
        const view = this.canvas.parentElement;
        const width = view.clientWidth;
        const height = view.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    cleanup() {
        super.cleanup();
        
        // Stop auto play
        this.autoPlay = false;
        
        // Dispose of Three.js objects
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        
        console.log('Neural Network visualization cleaned up');
    }
}
