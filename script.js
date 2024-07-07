document.addEventListener('DOMContentLoaded', function() {
    const stageWidth = 450;
    const stageHeight = 450;

    const stage = new Konva.Stage({
        container: 'canvas-container',
        width: stageWidth,
        height: stageHeight,
    });

    const container = document.getElementById('canvas-container');
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';

    const backgroundLayer = new Konva.Layer();
    const helmetLayer = new Konva.Layer();
    const handlesLayer = new Konva.Layer();
    stage.add(backgroundLayer, helmetLayer, handlesLayer);

    let backgroundImageObj = new Image();
    const backgroundImageInput = document.getElementById('backgroundImageInput');
    const saveContainer = document.getElementById('saveContainer');
    const uploadContainer = document.getElementById('uploadContainer');
    const resetContainer = document.getElementById('resetContainer');

    backgroundImageInput.addEventListener('change', handleBackgroundImageUpload);

    function handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                backgroundImageObj.src = e.target.result;
                backgroundImageObj.onload = function() {
                    drawBackground();
                    showSaveButton();
                };
            };
            reader.readAsDataURL(file);
        }
    }

    function showSaveButton() {
        uploadContainer.style.display = 'none';
        saveContainer.style.display = 'block';
        resetContainer.style.display = 'block';
    }

    function showUploadButton() {
        uploadContainer.style.display = 'block';
        saveContainer.style.display = 'none';
        resetContainer.style.display = 'none';
        resetBackground();
        initializeHelmet();
    }

    document.getElementById('resetButton').addEventListener('click', () => {
        showUploadButton();
    });

    function resetBackground() {
        backgroundLayer.removeChildren();
        backgroundLayer.batchDraw();
        backgroundImageInput.value = '';  // Reset the input value to ensure change event triggers
    }

    let helmetImages = [
        'images/pythmet1.png', 'images/pythmet2.png', 'images/pythmet3.png',
        'images/pythmet4.png', 'images/pythmet5.png', 'images/pythmet6.png',
        'images/pythmet7.png', 'images/pythmet8.png', 'images/pythmet9.png',
        'images/pythmet10.png'
    ];
    let currentHelmetIndex = 0;
    let helmetImageObj = new Image();
    helmetImageObj.onload = function() {
        initializeHelmet();
    };
    helmetImageObj.src = helmetImages[currentHelmetIndex];

    let transformer;

    function drawBackground() {
        let background = new Konva.Image({
            x: 0,
            y: 0,
            image: backgroundImageObj,
            width: stage.width(),
            height: stage.height(),
        });
        backgroundLayer.removeChildren();
        backgroundLayer.add(background);
        backgroundLayer.batchDraw();
    }

    function initializeHelmet() {
        let helmet = new Konva.Image({
            x: 140,
            y: 20,
            image: helmetImageObj,
            draggable: true,
        });

        helmet.on('transform', function() {
            updateHelmetDiv();
            handlesLayer.batchDraw();
        });

        helmet.on('dragmove', function() {
            updateHelmetDiv();
            handlesLayer.batchDraw();
        });

        helmet.on('click', function(e) {
            showTransformer();
            e.cancelBubble = true;
        });

        helmetLayer.removeChildren();
        helmetLayer.add(helmet);

        transformer = new Konva.Transformer({
            nodes: [helmet],
            keepRatio: true,
            rotateEnabled: true,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'bottom-center'],
        });
        handlesLayer.removeChildren();
        handlesLayer.add(transformer);

        stage.batchDraw();
    }

    function updateHelmetPreview() {
        const previewContainer = document.getElementById('helmetPreview');
        previewContainer.innerHTML = '';
        for (let i = currentHelmetIndex; i < currentHelmetIndex + 3; i++) {
            const img = document.createElement('img');
            img.src = helmetImages[i % helmetImages.length];
            img.addEventListener('click', () => {
                helmetImageObj.src = img.src;
            });
            previewContainer.appendChild(img);
        }
    }

    document.getElementById('prevHelmetButton').addEventListener('click', () => {
        currentHelmetIndex = (currentHelmetIndex - 1 + helmetImages.length) % helmetImages.length;
        updateHelmetPreview();
    });

    document.getElementById('nextHelmetButton').addEventListener('click', () => {
        currentHelmetIndex = (currentHelmetIndex + 1) % helmetImages.length;
        updateHelmetPreview();
    });

    updateHelmetPreview();

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', () => {
        hideTransformer();
        stage.toDataURL({
            callback: function(dataUrl) {
                const link = document.createElement('a');
                link.download = 'pythmeted.jpg';
                link.href = dataUrl;
                link.click();
                showTransformer();
            }
        });
    });

    function updateHelmetDiv() {
        // Implement based on your requirements, adjusting position and size of a div element
    }

    function showTransformer() {
        if (transformer) {
            transformer.show();
            handlesLayer.batchDraw();
        }
    }

    function hideTransformer() {
        if (transformer) {
            transformer.hide();
            handlesLayer.batchDraw();
        }
    }
});
