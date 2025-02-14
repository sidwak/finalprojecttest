import path from 'path'
import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { startTest } from './puppetTester.js'
import { Server } from 'socket.io'
//import { createNewProject, getProjectsInfoJson, setNewCurrentProject, deleteProjectWithId } from './projectsEService.js'
/* import {
  createNewTestcase,
  getTestcasesInfoJson,
  saveTestcaseData,
  loadTestcaseData,
  runTestcase,
  deleteTestcase,
  updateTestcaseData,
} from './testcasesEService.js' */
import { exec, execSync } from 'child_process'
import {
  createNewTestcase,
  deleteTestcase,
  getTestcasesInfoJson,
  loadTestcaseData,
  runTestcase,
  saveTestcaseData,
  updateTestcaseData,
} from './E_TestcaseService.js'
import { createNewProject, deleteProjectWithId, getProjectsInfoJson, setNewCurrentProject } from './E_ProjectService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
  socket.on('logger', (data: any) => {
    socket.broadcast.emit('runnerLogger', { sender: socket.id, message: data })
  })
  socket.on('execr', (data: any) => {
    socket.broadcast.emit('runnerExecr', { sender: socket.id, message: data })
  })
})

let win: BrowserWindow | null

const __userDir = app.getPath('userData')

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    //autoHideMenuBar: true,
    //titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      //enabling nodeIntegration will auto disable contextIsolation and enableRemoteModule
      //nodeIntegration: true, // You can enable Node integration, though it's recommended to use contextBridge instead
    },
  })
  win.webContents.openDevTools()
  // In production mode, load the built app
  // win.loadFile('index.html')
  console.log('Hello from Backend!')
  console.log(path.join(app.getPath('userData'), 'puppet_test'))

  // PROD
  //win.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  // DEV
  win.loadURL('http://localhost:5173')

  win.on('closed', () => {
    win = null
  })
}

function isFirstRun() {
  return !existsSync(path.join(__userDir, 'app_config.json'))
}

function installNpmPackages() {
  exec('npm install puppeteer chai socket.io-client', { cwd: path.join(__userDir, 'nodexify_test') }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`result : ${stdout}`)
  })
}

async function createTestingDirectory() {
  await mkdirSync(path.join(__userDir, 'nodexify_test'))
  const app_config = {
    first_launch: false,
  }
  await writeFileSync(path.join(__userDir, 'app_config.json'), JSON.stringify(app_config))
  const projectsInfo_config = {
    projects: [],
  }
  await writeFileSync(path.join(__userDir, 'nodexify_test', 'projectsInfo.json'), JSON.stringify(projectsInfo_config))
}

app.on('ready', async () => {
  if (isFirstRun()) {
    await createTestingDirectory()
    installNpmPackages()
  } else {
    //console.log('not first launch')
  }
})

ipcMain.handle('invoke-function', async (event, args) => {
  return yourFunction(args)
})
// Electron
ipcMain.handle('exit-app', async (event, args) => {
  app.exit()
})
ipcMain.handle('minimize-app', async (event, args) => {
  minimizeWindow()
})
ipcMain.handle('maximize-app', async (event, args) => {
  maximizeWindow()
})

// testcase service?
ipcMain.handle('save-tc-data', async (event, args) => {
  //return saveTestcaseData(args)
  return await saveTestcaseData(args)
})
ipcMain.handle('load-tc-data', async (event, args) => {
  //return loadTestcaseData(args)
  return await loadTestcaseData(args)
})
ipcMain.handle('start-test', async (event, args) => {
  //return runTestcase(args)
  return await runTestcase(args) // not await?
})

// projectsEService
ipcMain.handle('get-projects-info-json', async (event, args) => {
  //return getProjectsInfoJson()
  return await getProjectsInfoJson()
})
ipcMain.handle('create-new-project', async (event, args) => {
  //return createNewProject(args)
  return await createNewProject(args)
})
ipcMain.handle('set-new-current-project', async (event, args) => {
  //return setNewCurrentProject(args)
  return await setNewCurrentProject(args)
})
ipcMain.handle('delete-project-with-id', async (event, args) => {
  //return deleteProjectWithId(args)
  return await deleteProjectWithId(args)
})

// testcasesEService
ipcMain.handle('get-testcases-info-json', async (event, args) => {
  //return getTestcasesInfoJson(args)
  return await getTestcasesInfoJson(args)
})
ipcMain.handle('create-new-testcase', async (event, args) => {
  //return createNewTestcase(args)
  return await createNewTestcase(args)
})
ipcMain.handle('delete-testcase', async (event, args) => {
  //return deleteTestcase(args)
  return await deleteTestcase(args)
})
ipcMain.handle('update-testcase', async (event, args) => {
  //return updateTestcaseData(args)
  return await updateTestcaseData(args)
})

function yourFunction(args: any) {
  // Perform your backend task hello
  console.log(args)
  console.log('hello from frontend')
  return 'hello from backend'
}

function minimizeWindow() {
  if (win) {
    win.minimize()
  }
}

function maximizeWindow() {
  if (win) {
    if (!win.isMaximized()) {
      win.maximize() // Maximize the window
    } else {
      win.restore() // Restore if already maximized
    }
  }
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
