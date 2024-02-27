class Window {
  static instances = [];
  static zIndex = 1;

  constructor(title, content) {
    this.windowDiv = document.createElement('div');
    this.windowDiv.className = 'window';
    this.windowDiv.style.zIndex = Window.zIndex++;

    this.titleBar = document.createElement('div');
    this.titleBar.className = 'title-bar';
    this.titleBar.textContent = title;

    this.minimizeButton = document.createElement('button');
    this.minimizeButton.textContent = '_';
    this.minimizeButton.addEventListener('click', () => this.windowDiv.style.display = 'none');

    this.maximizeButton = document.createElement('button');
    this.maximizeButton.textContent = '□';
    this.maximizeButton.addEventListener('click', () => this.toggleMaximize());

    this.closeButton = document.createElement('button');
    this.closeButton.textContent = 'X';
    this.closeButton.addEventListener('click', () => this.closeWindow());

    this.titleBar.appendChild(this.minimizeButton);
    this.titleBar.appendChild(this.maximizeButton);
    this.titleBar.appendChild(this.closeButton);

    this.windowDiv.appendChild(this.titleBar);

    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = content;
    contentDiv.style.padding = '10px';

    this.windowDiv.appendChild(contentDiv);

    document.body.appendChild(this.windowDiv);

    this.makeDraggable();

    Window.instances.push(this);
    updateStartMenu();
  }

  toggleMaximize() {
    if (this.windowDiv.style.width === '100%' && this.windowDiv.style.height === '100%') {
      this.windowDiv.style.width = '400px';
      this.windowDiv.style.height = '300px';
    } else {
      this.windowDiv.style.width = '100%';
      this.windowDiv.style.height = '100%';
    }
  }

  makeDraggable() {
    let offsetX, offsetY;

    this.titleBar.addEventListener('mousedown', (e) => {
      offsetX = e.clientX - this.windowDiv.getBoundingClientRect().left;
      offsetY = e.clientY - this.windowDiv.getBoundingClientRect().top;

      const handleMouseMove = (e) => {
        this.windowDiv.style.left = e.clientX - offsetX + 'px';
        this.windowDiv.style.top = e.clientY - offsetY + 'px';
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
  }

  closeWindow() {
    this.windowDiv.remove();
    Window.instances = Window.instances.filter(instance => instance !== this);
    updateStartMenu();
  }
}

function toggleStartMenu() {
  const startMenu = document.querySelector('.start-menu');
  startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
}

function updateStartMenu() {
  const startMenu = document.querySelector('.start-menu');
  startMenu.innerHTML = '';

  Window.instances.forEach((window, index) => {
    const entry = document.createElement('div');
    entry.className = 'start-menu-entry';
    entry.textContent = `Window ${index + 1}`;
    entry.addEventListener('click', () => {
      window.windowDiv.style.display = 'block';
      window.windowDiv.style.zIndex = Window.zIndex++;
    });
    startMenu.appendChild(entry);
  });
}

//browser
class BrowserWindow extends Window {
  constructor() {
    super('Browser', '');
    this.createNavigationControls();
    this.loadBrowserContent('https://www.example.com');
  }

  createNavigationControls() {
    const navigationControls = document.createElement('div');
    navigationControls.style.display = 'flex';
    navigationControls.style.alignItems = 'center';

    const backButton = document.createElement('button');
    backButton.textContent = '◀';
    backButton.addEventListener('click', () => this.navigate('back'));

    const forwardButton = document.createElement('button');
    forwardButton.textContent = '▶';
    forwardButton.addEventListener('click', () => this.navigate('forward'));

    const reloadButton = document.createElement('button');
    reloadButton.textContent = '↻';
    reloadButton.addEventListener('click', () => this.navigate('reload'));

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.style.flexGrow = 1;
    urlInput.placeholder = 'Enter URL and press Enter';
    urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        this.loadBrowserContent(urlInput.value);
      }
    });

    navigationControls.appendChild(backButton);
    navigationControls.appendChild(forwardButton);
    navigationControls.appendChild(reloadButton);
    navigationControls.appendChild(urlInput);

    this.windowDiv.querySelector('.title-bar').appendChild(navigationControls);
  }

  loadBrowserContent(url) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100% - 40px)'; // Adjusted height to accommodate navigation controls
    this.windowDiv.querySelector('.window').innerHTML = ''; // Clear existing content
    this.windowDiv.querySelector('.window').appendChild(iframe);
  }

  navigate(action) {
    const iframe = this.windowDiv.querySelector('iframe');

    switch (action) {
      case 'back':
        iframe.contentWindow.history.back();
        break;
      case 'forward':
        iframe.contentWindow.history.forward();
        break;
      case 'reload':
        iframe.contentWindow.location.reload();
        break;
      default:
        break;
    }
  }
}

// Override the closeWindow method for the BrowserWindow
BrowserWindow.prototype.closeWindow = function () {
  // You can add additional logic specific to the browser window if needed
  this.windowDiv.remove();
  Window.instances = Window.instances.filter(instance => instance !== this);
  updateStartMenu();
};

window.addEventListener('DOMContentLoaded', () => {
  new Window('My Window 1', 'This is the content of Window 1.');
  new Window('My Window 2', 'This is the content of Window 2.');
  new BrowserWindow();
});
