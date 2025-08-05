// Minecraft Block Text Converter
// Uses object text components from Minecraft 25w32a

class MinecraftBlockConverter {
    constructor() {
        this.blockColors = {};
        this.loadBlockColors();
        this.currentImage = null;
        this.setupEventListeners();
    }

    async loadBlockColors() {
        try {
            const response = await fetch('colors.json');
            const blockData = await response.json();
            
            for (const [blockName, rgbArray] of Object.entries(blockData)) {
                this.blockColors[blockName] = {
                    r: rgbArray[0],
                    g: rgbArray[1],
                    b: rgbArray[2]
                };
            }
            console.log(`Loaded ${Object.keys(this.blockColors).length} block colors`);
        } catch (error) {
            console.error('Error loading block colors:', error);
            // Fallback to basic colors if file can't be loaded
            this.loadFallbackColors();
        }
    }

    loadFallbackColors() {
        // Enhanced fallback colors with more variety
        const fallbackColors = {
            // Concrete blocks
            'white_concrete': { r: 255, g: 255, b: 255 },
            'light_gray_concrete': { r: 192, g: 192, b: 192 },
            'gray_concrete': { r: 128, g: 128, b: 128 },
            'black_concrete': { r: 0, g: 0, b: 0 },
            'red_concrete': { r: 255, g: 0, b: 0 },
            'orange_concrete': { r: 255, g: 165, b: 0 },
            'yellow_concrete': { r: 255, g: 255, b: 0 },
            'lime_concrete': { r: 0, g: 255, b: 0 },
            'green_concrete': { r: 0, g: 128, b: 0 },
            'cyan_concrete': { r: 0, g: 255, b: 255 },
            'light_blue_concrete': { r: 173, g: 216, b: 230 },
            'blue_concrete': { r: 0, g: 0, b: 255 },
            'purple_concrete': { r: 128, g: 0, b: 128 },
            'magenta_concrete': { r: 255, g: 0, b: 255 },
            'pink_concrete': { r: 255, g: 192, b: 203 },
            'brown_concrete': { r: 139, g: 69, b: 19 },
            
            // Wool blocks for more variety
            'white_wool': { r: 255, g: 255, b: 255 },
            'light_gray_wool': { r: 192, g: 192, b: 192 },
            'gray_wool': { r: 128, g: 128, b: 128 },
            'black_wool': { r: 0, g: 0, b: 0 },
            'red_wool': { r: 255, g: 0, b: 0 },
            'orange_wool': { r: 255, g: 165, b: 0 },
            'yellow_wool': { r: 255, g: 255, b: 0 },
            'lime_wool': { r: 0, g: 255, b: 0 },
            'green_wool': { r: 0, g: 128, b: 0 },
            'cyan_wool': { r: 0, g: 255, b: 255 },
            'light_blue_wool': { r: 173, g: 216, b: 230 },
            'blue_wool': { r: 0, g: 0, b: 255 },
            'purple_wool': { r: 128, g: 0, b: 128 },
            'magenta_wool': { r: 255, g: 0, b: 255 },
            'pink_wool': { r: 255, g: 192, b: 203 },
            'brown_wool': { r: 139, g: 69, b: 19 },
            
            // Terracotta for more variety
            'white_terracotta': { r: 255, g: 255, b: 255 },
            'light_gray_terracotta': { r: 192, g: 192, b: 192 },
            'gray_terracotta': { r: 128, g: 128, b: 128 },
            'black_terracotta': { r: 0, g: 0, b: 0 },
            'red_terracotta': { r: 255, g: 0, b: 0 },
            'orange_terracotta': { r: 255, g: 165, b: 0 },
            'yellow_terracotta': { r: 255, g: 255, b: 0 },
            'lime_terracotta': { r: 0, g: 255, b: 0 },
            'green_terracotta': { r: 0, g: 128, b: 0 },
            'cyan_terracotta': { r: 0, g: 255, b: 255 },
            'light_blue_terracotta': { r: 173, g: 216, b: 230 },
            'blue_terracotta': { r: 0, g: 0, b: 255 },
            'purple_terracotta': { r: 128, g: 0, b: 128 },
            'magenta_terracotta': { r: 255, g: 0, b: 255 },
            'pink_terracotta': { r: 255, g: 192, b: 203 },
            'brown_terracotta': { r: 139, g: 69, b: 19 }
        };
        this.blockColors = fallbackColors;
    }

    setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const convertBtn = document.getElementById('convertBtn');
        const brightnessSlider = document.getElementById('brightness');
        const contrastSlider = document.getElementById('contrast');
        const brightnessValue = document.getElementById('brightnessValue');
        const contrastValue = document.getElementById('contrastValue');
        const tabBtns = document.querySelectorAll('.tab-btn');
        const copyCommandsBtn = document.getElementById('copyCommands');
        const copyJsonBtn = document.getElementById('copyJson');

        // File upload events
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // Convert button
        convertBtn.addEventListener('click', () => this.convertImage());

        // Slider events
        brightnessSlider.addEventListener('input', (e) => {
            brightnessValue.textContent = e.target.value + '%';
        });
        contrastSlider.addEventListener('input', (e) => {
            contrastValue.textContent = e.target.value + '%';
        });

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Copy buttons
        copyCommandsBtn.addEventListener('click', () => this.copyCommands());
        copyJsonBtn.addEventListener('click', () => this.copyJson());

        // Checkbox event
        const removeSlashesCheckbox = document.getElementById('removeSlashes');
        removeSlashesCheckbox.addEventListener('change', (e) => {
            const span = e.target.nextElementSibling;
            span.textContent = e.target.checked ? 'Enabled' : 'Disabled';
        });
    }

    handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = new Image();
            this.currentImage.onload = () => {
                document.getElementById('convertBtn').disabled = false;
                this.showUploadPreview(file, e.target.result);
            };
            this.currentImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    showUploadPreview(file, dataUrl) {
        const uploadContent = document.getElementById('uploadContent');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');

        // Update preview elements
        previewImage.src = dataUrl;
        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);

        // Show preview with animation
        uploadContent.style.display = 'none';
        uploadPreview.style.display = 'flex';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
    }

    convertImage() {
        if (!this.currentImage) return;

        const blockSize = parseInt(document.getElementById('blockSize').value);
        const dithering = document.getElementById('dithering').value;
        const brightness = parseInt(document.getElementById('brightness').value) / 100;
        const contrast = parseInt(document.getElementById('contrast').value) / 100;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions - increased for better quality
        const maxWidth = 1200;
        const maxHeight = 800;
        let { width, height } = this.currentImage;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        // Clear canvas with transparent background
        ctx.clearRect(0, 0, width, height);
        
        // Draw and process image
        ctx.drawImage(this.currentImage, 0, 0, width, height);
        let imageData = ctx.getImageData(0, 0, width, height);

        // Apply brightness and contrast
        imageData = this.adjustBrightnessContrast(imageData, brightness, contrast);

        // Apply dithering if selected
        if (dithering === 'floyd-steinberg') {
            imageData = this.floydSteinbergDither(imageData);
        } else if (dithering === 'ordered') {
            imageData = this.orderedDither(imageData);
        }

        // Convert to blocks
        const blocks = this.convertToBlocks(imageData, blockSize);

        // Display results
        this.displayResults(blocks, width, height, blockSize);
    }

    adjustBrightnessContrast(imageData, brightness, contrast) {
        const data = imageData.data;
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

        for (let i = 0; i < data.length; i += 4) {
            // Brightness
            data[i] = Math.min(255, Math.max(0, data[i] * brightness));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * brightness));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * brightness));

            // Contrast
            data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
            data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
            data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
        }

        return imageData;
    }

    floydSteinbergDither(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const oldR = data[idx];
                const oldG = data[idx + 1];
                const oldB = data[idx + 2];

                const newR = this.findClosestColor(oldR);
                const newG = this.findClosestColor(oldG);
                const newB = this.findClosestColor(oldB);

                data[idx] = newR;
                data[idx + 1] = newG;
                data[idx + 2] = newB;

                const errR = oldR - newR;
                const errG = oldG - newG;
                const errB = oldB - newB;

                // Distribute error to neighboring pixels
                if (x + 1 < width) {
                    this.distributeError(data, idx + 4, errR, errG, errB, 7/16);
                }
                if (x - 1 >= 0 && y + 1 < height) {
                    this.distributeError(data, idx + width * 4 - 4, errR, errG, errB, 3/16);
                }
                if (y + 1 < height) {
                    this.distributeError(data, idx + width * 4, errR, errG, errB, 5/16);
                }
                if (x + 1 < width && y + 1 < height) {
                    this.distributeError(data, idx + width * 4 + 4, errR, errG, errB, 1/16);
                }
            }
        }

        return imageData;
    }

    distributeError(data, idx, errR, errG, errB, factor) {
        data[idx] = Math.min(255, Math.max(0, data[idx] + errR * factor));
        data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + errG * factor));
        data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + errB * factor));
    }

    orderedDither(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const threshold = [
            [0, 8, 2, 10],
            [12, 4, 14, 6],
            [3, 11, 1, 9],
            [15, 7, 13, 5]
        ];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                const thresholdValue = threshold[y % 4][x % 4] / 16;

                data[idx] = data[idx] > thresholdValue * 255 ? 255 : 0;
                data[idx + 1] = data[idx + 1] > thresholdValue * 255 ? 255 : 0;
                data[idx + 2] = data[idx + 2] > thresholdValue * 255 ? 255 : 0;
            }
        }

        return imageData;
    }

    findClosestColor(value) {
        return value > 128 ? 255 : 0;
    }

    convertToBlocks(imageData, blockSize) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        const blocks = [];

        for (let y = 0; y < height; y += blockSize) {
            const row = [];
            for (let x = 0; x < width; x += blockSize) {
                const avgColor = this.getAverageColor(data, width, x, y, blockSize);
                
                // Check if the area is transparent (alpha < 128)
                if (avgColor.a < 128) {
                    row.push(' '); // Space character for transparent areas
                } else {
                    const blockName = this.findClosestBlock(avgColor);
                    row.push(blockName);
                }
            }
            blocks.push(row);
        }

        return blocks;
    }

    getAverageColor(data, width, startX, startY, blockSize) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;

        for (let y = startY; y < Math.min(startY + blockSize, data.length / width / 4); y++) {
            for (let x = startX; x < Math.min(startX + blockSize, width); x++) {
                const idx = (y * width + x) * 4;
                r += data[idx];
                g += data[idx + 1];
                b += data[idx + 2];
                a += data[idx + 3];
                count++;
            }
        }

        return {
            r: Math.round(r / count),
            g: Math.round(g / count),
            b: Math.round(b / count),
            a: Math.round(a / count)
        };
    }

    findClosestBlock(color) {
        let closestBlock = 'white_concrete';
        let minDistance = Infinity;

        for (const [blockName, blockColor] of Object.entries(this.blockColors)) {
            const distance = this.colorDistance(color, blockColor);
            if (distance < minDistance) {
                minDistance = distance;
                closestBlock = blockName;
            }
        }

        return closestBlock;
    }

    colorDistance(color1, color2) {
        return Math.sqrt(
            Math.pow(color1.r - color2.r, 2) +
            Math.pow(color1.g - color2.g, 2) +
            Math.pow(color1.b - color2.b, 2)
        );
    }

    displayResults(blocks, width, height, blockSize) {
        // Show results section
        document.getElementById('resultsSection').style.display = 'block';

        // Generate preview
        this.generatePreview(blocks, blockSize);

        // Generate commands
        this.generateCommands(blocks);

        // Generate JSON
        this.generateJson(blocks);

        // Switch to preview tab
        this.switchTab('preview');
    }

    generatePreview(blocks, blockSize) {
        const canvas = document.getElementById('previewCanvas');
        const ctx = canvas.getContext('2d');
        const scale = 4; // Scale factor for preview

        canvas.width = blocks[0].length * blockSize * scale;
        canvas.height = blocks.length * blockSize * scale;

        // Create checkered background for transparency
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw checkered pattern for transparent areas
        const checkerSize = 8;
        for (let y = 0; y < canvas.height; y += checkerSize) {
            for (let x = 0; x < canvas.width; x += checkerSize) {
                if ((x + y) % (checkerSize * 2) === 0) {
                    ctx.fillStyle = '#e0e0e0';
                    ctx.fillRect(x, y, checkerSize, checkerSize);
                }
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                const blockName = blocks[y][x];
                
                if (blockName === ' ') {
                    // Transparent block - leave as checkered background
                    continue;
                }
                
                const blockColor = this.blockColors[blockName];
                
                if (blockColor) {
                    ctx.fillStyle = `rgb(${blockColor.r}, ${blockColor.g}, ${blockColor.b})`;
                    ctx.fillRect(
                        x * blockSize * scale,
                        y * blockSize * scale,
                        blockSize * scale,
                        blockSize * scale
                    );
                }
            }
        }
    }

    generateCommands(blocks) {
        const commandsOutput = document.getElementById('commandsOutput');
        commandsOutput.innerHTML = '';

        const maxLineLength = 50; // Maximum blocks per line to avoid command length limits
        const removeSlashes = document.getElementById('removeSlashes').checked;

        for (let y = 0; y < blocks.length; y++) {
            const row = blocks[y];
            let currentLine = [];
            let lineNumber = 0;

            for (let x = 0; x < row.length; x++) {
                const blockName = row[x];
                if (blockName === ' ') {
                    // Add space for transparent areas
                    currentLine.push(' ');
                } else {
                    currentLine.push(blockName);
                }

                if (currentLine.length >= maxLineLength || x === row.length - 1) {
                    if (currentLine.length > 0) {
                        const command = this.createTellrawCommand(currentLine, removeSlashes);
                        const commandDiv = document.createElement('div');
                        commandDiv.className = 'command-line';
                        commandDiv.textContent = command;
                        commandsOutput.appendChild(commandDiv);
                    }
                    currentLine = [];
                    lineNumber++;
                }
            }
        }
    }

    createTellrawCommand(blockNames, removeSlashes = false) {
        const components = blockNames.map(blockName => {
            if (blockName === ' ') {
                return {
                    type: 'object',
                    atlas: 'minecraft:blocks',
                    sprite: 'block/white_concrete' // Use white concrete for transparent areas
                };
            } else {
                return {
                    type: 'object',
                    atlas: 'minecraft:blocks',
                    sprite: `block/${blockName}`
                };
            }
        });

        const command = `tellraw @a ${JSON.stringify(components)}`;
        return removeSlashes ? command : `/${command}`;
    }

    generateJson(blocks) {
        const jsonOutput = document.getElementById('jsonOutput');
        const allComponents = [];

        for (const row of blocks) {
            for (const blockName of row) {
                if (blockName === ' ') {
                    allComponents.push({
                        type: 'object',
                        atlas: 'minecraft:blocks',
                        sprite: 'block/white_concrete' // Use white concrete for transparent areas
                    });
                } else {
                    allComponents.push({
                        type: 'object',
                        atlas: 'minecraft:blocks',
                        sprite: `block/${blockName}`
                    });
                }
            }
        }

        jsonOutput.textContent = JSON.stringify(allComponents, null, 2);
    }

    copyCommands() {
        const commandsOutput = document.getElementById('commandsOutput');
        const commands = Array.from(commandsOutput.children)
            .map(div => div.textContent)
            .join('\n');
        
        navigator.clipboard.writeText(commands).then(() => {
            alert('Commands copied to clipboard!');
        });
    }

    copyJson() {
        const jsonOutput = document.getElementById('jsonOutput');
        navigator.clipboard.writeText(jsonOutput.textContent).then(() => {
            alert('JSON copied to clipboard!');
        });
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MinecraftBlockConverter();
}); 