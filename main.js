import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'

let win

// Create the window when the app is ready
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // You can enable Node integration, though it's recommended to use contextBridge instead
    },
  })

  // In development mode, load Vite's dev server
  /* if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173') // Default port for Vite
  } else {
    // In production mode, load the built app
    win.loadFile('index.html')
  } */

  win.loadURL('http://localhost:5173')

  win.on('closed', () => {
    win = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
