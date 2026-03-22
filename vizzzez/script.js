// Visualization System - Modular Architecture
class VisualizationManager {
    constructor() {
        this.visualizations = new Map();
        this.currentVisualization = null;
        this.initializeViews();
        this.setupNavigation();
    }

    initializeViews() {
        this.mainMenu = document.getElementById('mainMenu');
        this.bubbleSortView = document.getElementById('bubbleSortView');
        this.neuralNetworkView = document.getElementById('neuralNetworkView');
        this.backToMenuBtn = document.getElementById('backToMenu');
        this.backToMenuFromNNBtn = document.getElementById('backToMenuFromNN');
        this.menuItems = document.querySelectorAll('.menu-item');
    }

    setupNavigation() {
        // Menu item click handlers
        this.menuItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('coming-soon')) {
                    return; // Do nothing for coming soon items
                }
                
                const visualization = item.dataset.visualization;
                this.showView(visualization);
            });
        });

        // Back to menu buttons
        this.backToMenuBtn.addEventListener('click', () => {
            this.showView('menu');
        });
        
        this.backToMenuFromNNBtn.addEventListener('click', () => {
            this.showView('menu');
        });
    }

    registerVisualization(name, visualizationClass) {
        this.visualizations.set(name, visualizationClass);
    }

    showView(viewName) {
        // Clean up current visualization
        if (this.currentVisualization) {
            this.currentVisualization.cleanup();
            this.currentVisualization = null;
        }

        // Hide all views
        this.mainMenu.style.display = 'none';
        this.bubbleSortView.style.display = 'none';
        this.neuralNetworkView.style.display = 'none';
        
        // Show requested view
        switch(viewName) {
            case 'menu':
                this.mainMenu.style.display = 'flex';
                break;
            case 'bubble-sort':
                this.bubbleSortView.style.display = 'flex';
                // Initialize bubble sort when entering the view
                setTimeout(() => {
                    const BubbleSortClass = this.visualizations.get('bubble-sort');
                    if (BubbleSortClass) {
                        this.currentVisualization = new BubbleSortClass();
                        this.currentVisualization.initialize();
                    }
                }, 100);
                break;
            case 'neural-network':
                this.neuralNetworkView.style.display = 'flex';
                // Initialize neural network when entering the view
                setTimeout(() => {
                    const NeuralNetworkClass = this.visualizations.get('neural-network');
                    if (NeuralNetworkClass) {
                        this.currentVisualization = new NeuralNetworkClass();
                        this.currentVisualization.initialize();
                    }
                }, 100);
                break;
        }
    }
}

// Base Visualization Class
class BaseVisualization {
    constructor() {
        this.isRunning = false;
        this.animationFrameId = null;
    }

    initialize() {
        // Override in subclasses
        throw new Error('initialize() must be implemented in subclass');
    }

    cleanup() {
        this.isRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    start() {
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        // Override in subclasses
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const vizManager = new VisualizationManager();
    
    // Register visualizations
    vizManager.registerVisualization('bubble-sort', BubbleSortVisualization);
    vizManager.registerVisualization('neural-network', NeuralNetworkVisualization);
    
    // Start with the main menu
    vizManager.showView('menu');
});
