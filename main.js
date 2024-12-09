import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { startTest } from './puppetTester.js'
import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: {
    origin: '*', // Allow all origins; customize this for production
  },
})

io.on('connection', (socket) => {
  console.log('A client connected:', socket.id)
  socket.on('cmdExe', (data) => {
    console.log(`Message from ${socket.id}: ${data}`)
    socket.broadcast.emit('broadcast', { sender: socket.id, message: data })
  })
})

let win
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create the window when the app is ready

function createWindow() {
  win = new BrowserWindow({
    width: 1708,
    height: 960,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      //enabling nodeIntegration will auto disable contextIsolation and enableRemoteModule
      //nodeIntegration: true, // You can enable Node integration, though it's recommended to use contextBridge instead
    },
  })

  win.webContents.openDevTools()
  // In development mode, load Vite's dev server
  /* if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173') // Default port for Vite
  } else {
    // In production mode, load the built app
    win.loadFile('index.html')
  } */

  console.log('hello')

  win.loadURL('http://localhost:5173')

  win.on('closed', () => {
    win = null
  })
}

ipcMain.handle('invoke-function', async (event, args) => {
  // Replace with the function you want to call
  return yourFunction(args)
})
ipcMain.handle('save-tc-data', async (event, args) => {
  saveTestCaseData(args)
})
ipcMain.handle('load-tc-data', async (event, args) => {
  return loadTestCaseData()
})
ipcMain.handle('start-test', async (event, args) => {
  startTest()
})

function yourFunction(args) {
  // Perform your backend task
  console.log(args)
  console.log('hello from frontend')
  return 'hello from backend'
}

function saveTestCaseData(data) {
  console.log('save test case caleed')
  storeObject('objectStore.txt', data)
}

function loadTestCaseData() {
  const obj = getObject('objectStore.txt')
  return obj
}

function storeObject(filePath, obj) {
  const data = JSON.stringify(obj, null, 2) // Convert object to a JSON string with indentation
  writeFileSync(filePath, data, 'utf8')
  console.log('Object stored successfully!')
}

function getObject(filePath) {
  const data = readFileSync(filePath, 'utf8')
  const obj = JSON.parse(data) // Convert JSON string back to object
  return obj
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
