// @author Andy Dai
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
            const wrapperRect = wrapper.getBoundingClientRect();
            isDragging = true;
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
            // Update taskbar icon active state
            const windowSelector = '#' + el.id;
            document.querySelectorAll('.taskbar-icon').forEach(ic => ic.classList.remove('active'));
            const taskbarIcon = document.querySelector(`.taskbar-icon[data-window="${windowSelector}"]`);
            if (taskbarIcon) taskbarIcon.classList.add('active');
        });
    }

    // Add a taskbar icon for the window (if one doesn't exist)
    function addTaskbarIcon(windowSelector, windowElement) {
        const taskbarIconsContainer = document.querySelector('.taskbar-icons');
        let existingIcon = taskbarIconsContainer.querySelector(`[data-window="${windowSelector}"]`);
        if (existingIcon) return;
       
        const icon = document.createElement('div');
        icon.classList.add('taskbar-icon');
        icon.setAttribute('data-window', windowSelector);
        
        // Determine a custom icon by checking the corresponding desktop icon
        let iconSrc = 'icons/window.png'; // default icon
        const desktopIcon = document.querySelector(`.icon[data-window="${windowSelector}"]`);
        if (desktopIcon) {
            const imgEl = desktopIcon.querySelector('img');
            if (imgEl && imgEl.getAttribute('src')) {
                iconSrc = imgEl.getAttribute('src');
            }
        }
        
        // Create an image element for the taskbar icon
        const img = document.createElement('img');
        img.classList.add('taskbar-icon-img');
        img.src = iconSrc;
        
        // Create a span element for the window title
        const span = document.createElement('span');
        const titleText = windowElement.querySelector('.title-bar-text').textContent;
        span.textContent = titleText;
        
        icon.appendChild(img);
        icon.appendChild(span);
       
        // When clicked, restore (if minimized) and bring the window to front
        icon.addEventListener('click', () => {
            if (windowElement.style.display === 'none') {
                windowElement.style.display = 'block';
            }
            highestZ++;
            windowElement.style.zIndex = highestZ;
            document.querySelectorAll('.taskbar-icon').forEach(ic => ic.classList.remove('active'));
            icon.classList.add('active');
        });
       
        taskbarIconsContainer.appendChild(icon);
    }

    // Remove the taskbar icon for a window
    function removeTaskbarIcon(windowElement) {
        const windowSelector = '#' + windowElement.id;
        const taskbarIconsContainer = document.querySelector('.taskbar-icons');
        let icon = taskbarIconsContainer.querySelector(`[data-window="${windowSelector}"]`);
        if (icon) {
            icon.remove();
        }
    }

    // Minimize window function: hides the window and deactivates its taskbar icon
    function minimizeWindow(button) {
        const windowElement = button.closest('.window');
        windowElement.style.display = 'none';
        windowElement.classList.remove('active');
        const windowSelector = '#' + windowElement.id;
        const taskbarIcon = document.querySelector(`.taskbar-icon[data-window="${windowSelector}"]`);
        if (taskbarIcon) taskbarIcon.classList.remove('active');
    }

    // Open window function: shows the window, positions it, and updates taskbar icons
    function openWindow(windowSelector) {
        const windowElement = document.querySelector(windowSelector);
        // If already visible, just bring to front
        if (windowElement.style.display === 'block') {
            highestZ++;
            windowElement.style.zIndex = highestZ;
            const sel = '#' + windowElement.id;
            document.querySelectorAll('.taskbar-icon').forEach(ic => ic.classList.remove('active'));
            const taskbarIcon = document.querySelector(`.taskbar-icon[data-window="${sel}"]`);
            if (taskbarIcon) taskbarIcon.classList.add('active');
            return;
        }
       
        windowElement.style.display = 'block';
        windowElement.style.left = windowOffsetX + 'px';
        windowElement.style.top = windowOffsetY + 'px';

        windowOffsetX += windowOffsetIncrement;
        windowOffsetY += windowOffsetIncrement;

        if (windowOffsetX > wrapper.offsetWidth - 400) {
            windowOffsetX = 200;
        }
        if (windowOffsetY > wrapper.offsetHeight - 300) {
            windowOffsetY = 100;
        }

        highestZ++;
        windowElement.style.zIndex = highestZ;
        windowElement.classList.add('active');
        makeDraggable(windowElement);
       
        // Add the taskbar icon and mark it as active
        addTaskbarIcon(windowSelector, windowElement);
        const sel = '#' + windowElement.id;
        document.querySelectorAll('.taskbar-icon').forEach(ic => ic.classList.remove('active'));
        const taskbarIcon = document.querySelector(`.taskbar-icon[data-window="${sel}"]`);
        if (taskbarIcon) taskbarIcon.classList.add('active');
    }

    // Event listeners for desktop icons to open windows
    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const windowSelector = icon.getAttribute('data-window');
            openWindow(windowSelector);
        });
    });

    // Event listeners for window close buttons: hide window and remove taskbar icon
    document.querySelectorAll('.btn-close').forEach(button => {
        button.addEventListener('click', () => {
            const windowElement = button.closest('.window');
            windowElement.style.display = 'none';
            windowElement.classList.remove('active');
            removeTaskbarIcon(windowElement);
        });
    });

    // Event listeners for window minimize buttons: hide window but keep taskbar icon
    document.querySelectorAll('.btn-minimize').forEach(button => {
        button.addEventListener('click', () => {
            minimizeWindow(button);
        });
    });

    // Event listeners for explorer icons
    document.querySelectorAll('.explorer-icon').forEach(icon => {
        icon.addEventListener('dblclick', () => {
            const action = icon.getAttribute('data-action');
            if (action === 'link') {
                const url = icon.getAttribute('data-url');
                window.open(url, '_blank');
            } else if (action === 'window') {
                const windowSelector = icon.getAttribute('data-window');
                openWindow(windowSelector);
            } else {
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

    updateClock();
    setInterval(updateClock, 60000);
});
