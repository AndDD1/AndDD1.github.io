// @author Andy Dai <dai.ad0478@gmail.com>
document.addEventListener('DOMContentLoaded', () => {
    let highestZ = 1;
    let windowOffsetX = 200; // Initial horizontal offset
    let windowOffsetY = 100; // Initial vertical offset
    const windowOffsetIncrement = 15; // Amount to offset each new window

    const startButton = document.querySelector('.start-button');
    const wrapper = document.getElementById('wrapper');

    startButton.addEventListener('click', () => {
        startButton.classList.toggle('active');
    });
    function makeDraggable(el) {
        const titleBar = el.querySelector('.title-bar');
        let offsetX = 0, offsetY = 0, isDragging = false;
    
        titleBar.addEventListener('mousedown', (e) => {
            // Get the wrapper's bounding rectangle to convert viewport coordinates
            const wrapperRect = wrapper.getBoundingClientRect();
            isDragging = true;
            // Compute the offset relative to the wrapper
            offsetX = e.clientX - wrapperRect.left - el.offsetLeft;
            offsetY = e.clientY - wrapperRect.top - el.offsetTop;
    
            highestZ++;
            el.style.zIndex = highestZ;
            el.classList.add('active');
        });
    
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const wrapperRect = wrapper.getBoundingClientRect();
                let newLeft = e.clientX - wrapperRect.left - offsetX;
                let newTop = e.clientY - wrapperRect.top - offsetY;
                const elWidth = el.offsetWidth;
                const elHeight = el.offsetHeight;
                // Clamp the new position within the wrapper
                if (newLeft < 0) newLeft = 0;
                if (newLeft + elWidth > wrapper.offsetWidth) newLeft = wrapper.offsetWidth - elWidth;
                if (newTop < 0) newTop = 0;
                if (newTop + elHeight > wrapper.offsetHeight) newTop = wrapper.offsetHeight - elHeight;
                el.style.left = newLeft + 'px';
                el.style.top = newTop + 'px';
            }
        });
    
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    
        el.addEventListener('mousedown', () => {
            document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
            el.classList.add('active');
            highestZ++;
            el.style.zIndex = highestZ;
        });
    }
        // Open window function with wrapper dimension checks
    function openWindow(windowSelector) {
        const windowElement = document.querySelector(windowSelector);
        if (windowElement) {
            windowElement.style.display = 'block';
            windowElement.style.left = windowOffsetX + 'px';
            windowElement.style.top = windowOffsetY + 'px';

            // Increment offsets for next window
            windowOffsetX += windowOffsetIncrement;
            windowOffsetY += windowOffsetIncrement;

            // Use the wrapper's dimensions instead of the full window's
            if (windowOffsetX > wrapper.offsetWidth - 400) { // 400 is the window width
                windowOffsetX = 200;
            }
            if (windowOffsetY > wrapper.offsetHeight - 300) { // 300 is the window height
                windowOffsetY = 100;
            }

            highestZ++;
            windowElement.style.zIndex = highestZ;
            windowElement.classList.add('active');
            makeDraggable(windowElement);
        }
    }

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
          const wrapperRect = wrapper.getBoundingClientRect();
          let newLeft = e.clientX - wrapperRect.left - offsetX;
          let newTop = e.clientY - wrapperRect.top - offsetY;
          const elWidth = el.offsetWidth;
          const elHeight = el.offsetHeight;
          if (newLeft < 0) newLeft = 0;
          if (newLeft + elWidth > wrapper.offsetWidth) newLeft = wrapper.offsetWidth - elWidth;
          if (newTop < 0) newTop = 0;
          if (newTop + elHeight > wrapper.offsetHeight) newTop = wrapper.offsetHeight - elHeight;
          el.style.left = newLeft + 'px';
          el.style.top = newTop + 'px';
        }
      });

    // Close window function
    function closeWindow(button) {
        const windowElement = button.closest('.window');
        windowElement.style.display = 'none';
        windowElement.classList.remove('active');
    }

    // Event listeners for desktop icons
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const windowSelector = icon.getAttribute('data-window');
            openWindow(windowSelector);
        });
    });

    // Event listeners for window close buttons
    document.querySelectorAll('.btn-close').forEach(button => {
        button.addEventListener('click', () => {
            closeWindow(button);
        });
    });

    // Event listeners for explorer icons
    document.querySelectorAll('.explorer-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const action = icon.getAttribute('data-action');

            if (action === 'link') {
                // Open external link
                const url = icon.getAttribute('data-url');
                window.open(url, '_blank'); // Opens the link in a new tab/window
            } else if (action === 'window') {
                // Open internal window
                const windowSelector = icon.getAttribute('data-window');
                openWindow(windowSelector);
            } else {
                // Handle other actions or do nothing
                console.warn('No action specified for this icon.');
            }
        });
    });


    // Function to update the taskbar clock
    function updateClock() {
        const clockElement = document.getElementById('taskbar-clock');
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;

        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');

        const timeString = `${hours}:${minutes} ${ampm}`;
        clockElement.textContent = timeString;
    }

    // Update the clock immediately and then every minute
    updateClock();
    setInterval(updateClock, 60000); // Update every minute
});
