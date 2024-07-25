document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    const enterButton = document.getElementById('enterButton');

    enterButton.addEventListener('click', function() {
        enterButton.style.transition = 'opacity 0.5s ease-out';
        preloader.querySelector('img').style.transition = 'opacity 0.5s ease-out';
        
        enterButton.style.opacity = '0';
        preloader.querySelector('img').style.opacity = '0';

        setTimeout(() => {
            enterButton.style.display = 'none';
            preloader.querySelector('img').style.display = 'none';
            
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 300);
        }, 300);
    });
});
