const { app, BrowserWindow, ipcMain, nativeTheme, Menu } = require('electron')
const path = require('path')
const fs = require('fs')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      contextIsolation: false
    }
  })

  win.loadFile('dist/electron-angular-app/index.html')

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light'
    } else {
      nativeTheme.themeSource = 'dark'
    }
    return nativeTheme.shouldUseDarkColors
  })

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system'
  })

  win.webContents.openDevTools();
}

Menu.setApplicationMenu(null)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function getImages() {
  const cwd = process.cwd();
  fs.readdir('.', { withFileTypes: true }, (err, files) => {
    if (!err) {
      const re = /(?:\.([^.]+))?$/;
      const images = files
        .filter(file => file.isFile() && ['jpg', 'png'].includes(re.exec(file.name)[1]))
        .map(file => `file://${cwd}/${file.name}`);
      win.webContents.send("getImagesResponse", images);
    }
  });
}

function isRoot() {
  return path.parse(process.cwd()).root == process.cwd();
}

function getDirectory() {
  fs.readdir('.', { withFileTypes: true }, (err, files) => {
    if (!err) {
      const directories = files
        .filter(file => file.isDirectory())
        .map(file => file.name);
      if (!isRoot()) {
        directories.unshift('..');
      }
      win.webContents.send("getDirectoryResponse", directories);
    }
  });
}

ipcMain.on("navigateDirectory", (event, path) => {
  process.chdir(path);
  getImages();
  getDirectory();
});
