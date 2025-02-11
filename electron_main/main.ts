import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { writeFileSync, readFileSync } from 'fs'
import { startTest } from './puppetTester.js'
import { Server } from 'socket.io'
import { createNewProject, getProjectsInfoJson, setNewCurrentProject, deleteProjectWithId } from './projectsEService.js'
import {
  createNewTestcase,
  getTestcasesInfoJson,
  saveTestcaseData,
  loadTestcaseData,
  runTestcase,
  deleteTestcase,
  updateTestcaseData,
} from './testcasesEService.js'

const io = new Server(3000, {
  cors: {
    origin: '*', // Allow all origins; customize this for production
  },
})

io.on('connection', (socket: any) => {
  console.log('A client connected:', socket.id)
  socket.on('cmdExe', (data: any) => {
    console.log(`Message from ${socket.id}: ${data}`)
    socket.broadcast.emit('broadcast', { sender: socket.id, message: data })
  })
})

let win: BrowserWindow | null
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace('\\dist', '')
const __puppetDir = dirname(__filename).replace('\\electron_main\\dist', '')

function createWindow() {
  win = new BrowserWindow({
    width: 1708,
    height: 960,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname + '\\dist', 'preload.js'),
      contextIsolation: true,
      //enabling nodeIntegration will auto disable contextIsolation and enableRemoteModule
      //nodeIntegration: true, // You can enable Node integration, though it's recommended to use contextBridge instead
    },
  })
  win.webContents.openDevTools()
  // In production mode, load the built app
  // win.loadFile('index.html')
  console.log('Hello from Backend!')

  win.loadURL('http://localhost:5173')

  win.on('closed', () => {
    win = null
  })
}

ipcMain.handle('invoke-function', async (event, args) => {
  return yourFunction(args)
})
// Electron
ipcMain.handle('exit-app', async (event, args) => {
  app.exit()
})

//
ipcMain.handle('save-tc-data', async (event, args) => {
  return saveTestcaseData(args)
  //saveTestCaseData(args)
})
ipcMain.handle('load-tc-data', async (event, args) => {
  return loadTestcaseData(args)
})
ipcMain.handle('start-test', async (event, args) => {
  return runTestcase(args)
})

// projectsEService
ipcMain.handle('get-projects-info-json', async (event, args) => {
  return getProjectsInfoJson()
})
ipcMain.handle('create-new-project', async (event, args) => {
  return createNewProject(args)
})
ipcMain.handle('set-new-current-project', async (event, args) => {
  return setNewCurrentProject(args)
})
ipcMain.handle('delete-project-with-id', async (event, args) => {
  return deleteProjectWithId(args)
})

// testcasesEService
ipcMain.handle('get-testcases-info-json', async (event, args) => {
  return getTestcasesInfoJson(args)
})
ipcMain.handle('create-new-testcase', async (event, args) => {
  return createNewTestcase(args)
})
ipcMain.handle('delete-testcase', async (event, args) => {
  return deleteTestcase(args)
})
ipcMain.handle('update-testcase', async (event, args) => {
  return updateTestcaseData(args)
})

function yourFunction(args: any) {
  // Perform your backend task hello
  console.log(args)
  console.log('hello from frontend')
  return 'hello from backend'
}

function saveTestCaseData(data: any) {
  console.log('save test case caleed')
  storeObject(path.join(__dirname, 'objectStore.txt'), data)
}

function loadTestCaseData() {
  const obj = getObject(path.join(__dirname, 'objectStore.txt'))
  return obj
}

function storeObject(filePath: any, obj: any) {
  const data = JSON.stringify(obj, null, 2) // Convert object to a JSON string with indentation
  writeFileSync(filePath, data, 'utf8')
  console.log('Object stored successfully!')
}

function getObject(filePath: any) {
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
