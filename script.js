document.addEventListener('DOMContentLoaded', () => {

    // Variables to keep track of the highest z-index
    let highestZ = 1;
    let windowOffsetX = 200; // Initial horizontal offset
    let windowOffsetY = 100; // Initial vertical offset
    const windowOffsetIncrement = 15; // Amount to offset each new window
    
    const startButton = document.querySelector('.start-button');

    startButton.addEventListener('click', () => {
        startButton.classList.toggle('active');
    });
    
    // Function to make an element draggable
    function makeDraggable(el) {
        const titleBar = el.querySelector('.title-bar');
        let offsetX = 0, offsetY = 0, isDragging = false;

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;

            // Bring window to front
            highestZ++;
            el.style.zIndex = highestZ;
            el.classList.add('active');
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                el.style.left = (e.clientX - offsetX) + 'px';
                el.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Remove 'active' class when window is not focused
        el.addEventListener('mousedown', () => {
            document.querySelectorAll('.window').forEach(win => win.classList.remove('active'));
            el.classList.add('active');
            highestZ++;
            el.style.zIndex = highestZ;
        });
    }

    // Open window function
    function openWindow(windowSelector) {
        const windowElement = document.querySelector(windowSelector);
        if (windowElement) {
            windowElement.style.display = 'block';
    
            // Set the position using the offset variables
            windowElement.style.left = windowOffsetX + 'px';
            windowElement.style.top = windowOffsetY + 'px';
    
            // Increment the offsets for the next window
            windowOffsetX += windowOffsetIncrement;
            windowOffsetY += windowOffsetIncrement;
    
            // Optional: Reset offsets if they exceed window dimensions
            if (windowOffsetX > window.innerWidth - 400) { // Adjust '400' to your window width
                windowOffsetX = 200; // Reset to initial offset
            }
            if (windowOffsetY > window.innerHeight - 300) { // Adjust '300' to your window height
                windowOffsetY = 100; // Reset to initial offset
            }
    
            highestZ++;
            windowElement.style.zIndex = highestZ;
            windowElement.classList.add('active');
            makeDraggable(windowElement);
        }
    }

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
