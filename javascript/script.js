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


    let backgroundImageObj = new Image();
    const backgroundImageInput = document.getElementById('backgroundImageInput');
    const saveContainer = document.getElementById('saveContainer');
    const uploadContainer = document.getElementById('uploadContainer');
    const laserContainer = document.getElementById('laserContainer');
    const resetContainer = document.getElementById('resetContainer');
    const backgroundVideo = document.getElementById('backgroundVideo');

    backgroundImageInput.addEventListener('change', handleBackgroundImageUpload);

    const laserImagePaths = [
        'images/laser/laser1.png',
        'images/laser/laser2.png',
        'images/laser/laser3.png',
        'images/laser/laser4.png',
        'images/laser/laser5.png',
        'images/laser/laser6.png',
        'images/laser/laser7.png'

    ];
    const laserLayer = new Konva.Layer();
    const vignetteLayer = new Konva.Layer();
    let laserImage = null; // Текущий лазер
    let currentLaserIndex = -1; // Индекс текущего лазера
    stage.add(backgroundLayer, helmetLayer, handlesLayer, vignetteLayer, laserLayer );

    const addLaserButton = document.getElementById('addLaserButton');
    addLaserButton.addEventListener('click', () => {
        if (currentLaserIndex === -1) {
            // Если слой лазера ещё не добавлен
            currentLaserIndex = 0;
            addLaser();
            applyVignette();
            
            // Меняем фон на fire.webm
            backgroundVideo.pause(); // Останавливаем текущее видео
            backgroundVideo.querySelector('source').src = 'images/fire.webm'; // Указываем новый источник
            backgroundVideo.load(); // Загружаем новое видео
            backgroundVideo.play(); // Запускаем воспроизведение
        } else if (currentLaserIndex < laserImagePaths.length - 1) {
            // Переключаем на следующий лазер
            currentLaserIndex++;
            updateLaser();
        } else {
            // Удаляем слой лазера и возвращаем старый фон
            removeLaser();
            removeVignette();
    
            // Возвращаем оригинальный фон
            backgroundVideo.pause();
            backgroundVideo.querySelector('source').src = 'images/background.webm';
            backgroundVideo.load();
            backgroundVideo.play();
        }
    });
    

    function addLaser() {
        const laserImageObj = new Image();
        laserImageObj.onload = function () {
            hideHelmetTransformer();
    
            // Удаляем старый трансформер, если он есть
            const existingTransformer = laserLayer.find('Transformer')[0];
            if (existingTransformer) {
                existingTransformer.destroy();
            }
    
            // Создаём новый лазер
            laserImage = new Konva.Image({
                x: 50, // Начальная позиция X
                y: 50, // Начальная позиция Y
                image: laserImageObj,
                draggable: true, // Объект перемещаемый
            });
    
            // Добавляем лазер на слой
            laserLayer.add(laserImage);
            laserLayer.batchDraw();
    
            // Создаём новый трансформер для лазера
            const transformer = new Konva.Transformer({
                nodes: [laserImage], // Привязываем трансформер к новому лазеру
                keepRatio: true, // Сохраняем пропорции
                rotateEnabled: true, // Разрешаем вращение
                enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'bottom-center'],
            });
    
            // Добавляем трансформер на тот же слой
            laserLayer.add(transformer);
    
            // Событие клика на лазер для обновления трансформера
            laserImage.on('click', (e) => {
                transformer.nodes([e.target]); // Устанавливаем трансформер на текущий объект
                laserLayer.batchDraw();
                e.cancelBubble = true; // Предотвращаем всплытие события
            });
    
            // Обновляем текст кнопки
            addLaserButton.textContent = 'NEXT LASER';
        };
    
        laserImageObj.src = laserImagePaths[currentLaserIndex];
    }
    function updateLaser() {
        if (laserImage) {
            const laserImageObj = new Image();
            laserImageObj.onload = function () {
                // Обновляем изображение лазера
                laserImage.image(laserImageObj);
                laserLayer.batchDraw();
    
                // Находим текущий трансформер
                const transformer = laserLayer.find('Transformer')[0];
                if (transformer) {
                    // Привязываем трансформер к обновлённому лазеру
                    transformer.nodes([laserImage]);
                    laserLayer.batchDraw();
                }
            };
            laserImageObj.src = laserImagePaths[currentLaserIndex];
        }
    }

    function removeLaser() {
        laserLayer.removeChildren();
        laserLayer.batchDraw();
        currentLaserIndex = -1;
        laserImage = null;
        showHelmetTransformer();
        addLaserButton.textContent = 'LASER'; // Возвращаем исходный текст кнопки
    }

    // Применение эффекта виньетки
    function applyVignette() {
        const vignette = new Konva.Rect({
            x: 0,
            y: 0,
            width: stage.width(),
            height: stage.height(),
            fillRadialGradientStartPoint: { x: stage.width() / 2, y: stage.height() / 2 },
            fillRadialGradientEndPoint: { x: stage.width() / 2, y: stage.height() / 2 },
            fillRadialGradientStartRadius: 0,
            fillRadialGradientEndRadius: Math.max(stage.width(), stage.height()) * 0.8,
            fillRadialGradientColorStops: [
                0, 'rgba(0,0,0,0)',       // Центр прозрачный
                0.7, 'rgba(0,0,0,0.4)',   // Полупрозрачный переход
                1, 'rgba(0,0,0,0.7)'      // Тёмные края
            ],
            listening: false, // Слой не перехватывает события
        });
        

        vignetteLayer.add(vignette);
        vignetteLayer.batchDraw();
    
        console.log('Виньетка добавлена'); // Отладочный вывод
    }

    // Удаление эффекта виньетки
    function removeVignette() {
        vignetteLayer.removeChildren();
        vignetteLayer.batchDraw();
    }

    function handleBackgroundImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const uploadedImage = new Konva.Image({
                    x: 0,
                    y: 0,
                    width: stage.width(),
                    height: stage.height(),
                    image: new Image(),
                    listening: false, // Отключаем перехват событий мыши
                });
    
                uploadedImage.image().src = e.target.result;
                uploadedImage.image().onload = function () {
                    backgroundLayer.removeChildren(); // Убираем старые изображения
                    backgroundLayer.add(uploadedImage); // Добавляем новое изображение
                    backgroundLayer.batchDraw();
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
        laserContainer.style.display = 'block';
    }

    function showUploadButton() {
        uploadContainer.style.display = 'block';
        saveContainer.style.display = 'none';
        resetContainer.style.display = 'none';
        laserContainer.style.display = 'none';
        resetBackground();
        initializeHelmet();
    }

    document.getElementById('resetButton').addEventListener('click', () => {
        showUploadButton();
    });

    function resetBackground() {
        backgroundLayer.removeChildren();
        backgroundLayer.batchDraw();
        removeLaser();
        removeVignette();
        backgroundVideo.pause();
        backgroundVideo.querySelector('source').src = 'images/background.webm';
        backgroundVideo.load();
        backgroundVideo.play();
        backgroundImageInput.value = '';  // Reset the input value to ensure change event triggers
    }

    let helmetImages = [
        'images/pythmets/pythmet1.png', 'images/pythmets/pythmet2.png', 'images/pythmets/pythmet3.png',
        'images/pythmets/pythmet4.png', 'images/pythmets/pythmet5.png', 'images/pythmets/pythmet6.png',
        'images/pythmets/pythmet7.png', 'images/pythmets/pythmet8.png', 'images/pythmets/pythmet9.png',
        'images/pythmets/pythmet10.png', 'images/pythmets/pythmet11.png', 'images/pythmets/pythmet12.png'
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
        // Удаляем старые шлемы и трансформеры
        helmetLayer.removeChildren();
        helmetLayer.batchDraw();
    
        let helmet = new Konva.Image({
            x: 140,
            y: 20,
            image: helmetImageObj,
            draggable: true,
        });
    
        helmetLayer.add(helmet);
    
        // Создаём новый трансформер
        const helmetTransformer = new Konva.Transformer({
            nodes: [helmet], // Привязываем трансформер к новому шлему
            keepRatio: true,
            rotateEnabled: true,
            enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'bottom-center'],
        });
    
        helmetLayer.add(helmetTransformer);
    
        // Обновляем трансформер при клике на шлем
        helmet.on('click', function (e) {
            helmetTransformer.nodes([e.target]);
            helmetLayer.batchDraw();
            e.cancelBubble = true; // Останавливаем всплытие события
        });
    
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

    function hideHelmetTransformer() {
        helmetLayer.find('Transformer').forEach((transformer) => {
            transformer.nodes([]);
            transformer.hide();
        });
        helmetLayer.batchDraw();
    }
    
    function showHelmetTransformer() {
        const helmet = helmetLayer.find('Image')[0]; // Предполагаем, что шлем единственный
        const helmetTransformer = helmetLayer.find('Transformer')[0];
        if (helmet && helmetTransformer) {
            helmetTransformer.nodes([helmet]);
            helmetTransformer.show();
        }
        helmetLayer.batchDraw();
    }

    function showTransformer() {
        stage.find('Transformer').forEach((transformer) => {
            transformer.show();
        });
        stage.batchDraw(); // Обновляем канвас
    }

    function hideTransformer() {
        stage.find('Transformer').forEach((transformer) => {
            transformer.nodes([]);
            transformer.hide();
        });
        stage.batchDraw(); // Обновляем канвас
    }

    stage.on('click', (e) => {
        if (e.target === stage) {
            [laserLayer, helmetLayer].forEach((layer) => {
                layer.find('Transformer').forEach((transformer) => transformer.nodes([]));
            });
            stage.batchDraw();
        }
    });
    
    
    
});
