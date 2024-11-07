document.addEventListener('DOMContentLoaded', () => {

    // Variables to keep track of the highest z-index
    let highestZ = 1;

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
            windowElement.style.left = '100px';
            windowElement.style.top = '100px';
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

    // Optional: Minimize and Maximize functionality (placeholders)
    document.querySelectorAll('.btn-minimize').forEach(button => {
        button.addEventListener('click', () => {
            // Implement minimize functionality here
            alert('Minimize functionality not implemented.');
        });
    });

    document.querySelectorAll('.btn-maximize').forEach(button => {
        button.addEventListener('click', () => {
            // Implement maximize functionality here
            alert('Maximize functionality not implemented.');
        });
    });

});
