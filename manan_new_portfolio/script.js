document.addEventListener('DOMContentLoaded', () => {

    // --- PRELOADER/BOOT SEQUENCE ---
    const preloader = document.getElementById('preloader');
    const desktop = document.getElementById('desktop');
    const preloaderDots = document.getElementById('preloader-dots');
    
    // Animate dots
    let dotCount = 0;
    const dotInterval = setInterval(() => {
        preloaderDots.textContent += '.';
        dotCount++;
        if (dotCount > 3) preloaderDots.textContent = '';
    }, 500);

    window.addEventListener('load', () => {
        setTimeout(() => {
            clearInterval(dotInterval);
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            desktop.style.opacity = '1';
        }, 4000); // Wait for the "boot" text to be readable
    });


    // --- LIVE CLOCK ---
    const clockElement = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        clockElement.textContent = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock();


    // --- WINDOW MANAGEMENT ---
    const dockItems = document.querySelectorAll('.dock-item');
    let highestZIndex = 100;

    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            const windowId = item.dataset.window;
            const windowEl = document.getElementById(windowId);

            if (windowEl) {
                // Toggle active class on window and dock item
                windowEl.classList.toggle('active');
                item.classList.toggle('active');

                if (windowEl.classList.contains('active')) {
                    highestZIndex++;
                    windowEl.style.zIndex = highestZIndex;
                }
            }
        });
    });

    // Close button functionality
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const windowId = btn.dataset.window;
            const windowEl = document.getElementById(windowId);
            const dockItem = document.querySelector(`.dock-item[data-window="${windowId}"]`);
            
            windowEl.classList.remove('active');
            if (dockItem) {
                dockItem.classList.remove('active');
            }
        });
    });

    // Bring window to front on click
    document.querySelectorAll('.window').forEach(windowEl => {
        windowEl.addEventListener('mousedown', () => {
            highestZIndex++;
            windowEl.style.zIndex = highestZIndex;
        });
    });

    // --- DRAGGABLE WINDOWS ---
    let activeWindow = null;
    let offsetX, offsetY;

    function dragStart(e) {
        activeWindow = this.parentElement;
        if (e.type === 'touchstart') {
            offsetX = e.touches[0].clientX - activeWindow.offsetLeft;
            offsetY = e.touches[0].clientY - activeWindow.offsetTop;
        } else {
            offsetX = e.clientX - activeWindow.offsetLeft;
            offsetY = e.clientY - activeWindow.offsetTop;
        }
    }

    function drag(e) {
        if (activeWindow) {
            e.preventDefault();
            let x, y;
            if (e.type === 'touchmove') {
                x = e.touches[0].clientX - offsetX;
                y = e.touches[0].clientY - offsetY;
            } else {
                x = e.clientX - offsetX;
                y = e.clientY - offsetY;
            }
            activeWindow.style.left = `${x}px`;
            activeWindow.style.top = `${y}px`;
        }
    }

    function dragEnd() {
        activeWindow = null;
    }

    document.querySelectorAll('.window-header').forEach(header => {
        header.addEventListener('mousedown', dragStart);
        header.addEventListener('touchstart', dragStart);
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

});