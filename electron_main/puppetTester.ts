import {
  writeFileSync,
  readFileSync,
  appendFileSync,
  appendFile,
  writeFile,
  PathOrFileDescriptor,
} from 'fs'
import { exec } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace('\\dist', '')

let varArr: string[] = []
let cmdsArr: string[] = []
let flowNodes: any = {}

let initialCode = `import puppeteer from 'puppeteer-core'
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

socket.on('connect', async () => {

const browser = await puppeteer.launch({
  executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  //executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  headless: false,
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

socket.emit('cmdExe', 'This test is about to start')

`

let cmdToCode: any = {
  get: 'await page.goto($value);\n',
  click: 'await page.locator($value).click();\n',
  input: 'await page.locator($value).fill($input);\n',
}
let logText = `Command executed successfully - Command: $cmd DOMcss: $value DOMinput: $input`
let logCmd = `socket.emit('cmdExe', '$log')\n\n`

function getObject(filePath: any) {
  const data = readFileSync(filePath, 'utf8')
  const obj = JSON.parse(data) // Convert JSON string back to object
  return obj
}

function getEndNode(nodes: any[]) {
  let lastId = -1
  nodes.forEach((node: any) => {
    if (node.type === 'driver-node') {
      if (node.data.pCmd === 'Stop') {
        lastId = node.id
      }
    }
  })
  return lastId
}

function getAllVariables(nodes: any[]) {
  let newVar = 'def-var'
  nodes.forEach((node: any) => {
    if (node.type === 'var-node') {
      newVar = 'let v_var' + node.id + " = '" + node.data.pValue.value + "'\n"
    } else if (node.type === 'dom-node') {
      newVar = 'let e_var' + node.id + " = '" + node.data.pValue.value + "'\n"
    } else if (node.type === 'driver-node') {
      newVar = 'let d_var' + node.id + " = '" + node.data.pValue.value + "'\n"
    }
    varArr.push(newVar)
  })
  console.log(varArr)
}

function getAllCommands(nodes: any[]) {
  nodes.forEach((node: any) => {
    if (node.type === 'driver-node') {
      if (node.data.pValue.isRequired === true) {
        if (node.data.pValue.isConnected) {
          let connectedNodeVarName = ''
          let logOut = logText
          logOut = logOut.replace('$cmd', node.data.pCmd.value)
          logOut = logOut.replace(
            '$value',
            flowNodes[node.data.pValue.connnectedNodeId].data.pValue.value,
          )
          if (flowNodes[node.data.pValue.connnectedNodeId].type === 'var-node') {
            logOut = logOut.replace('DOMcss', 'cmdValue')
            connectedNodeVarName = 'v_var' + node.data.pValue.connnectedNodeId
          } else {
            connectedNodeVarName = 'e_var' + node.data.pValue.connnectedNodeId
          }
          let newCmd = cmdToCode[node.data.pCmd.value]
          newCmd = newCmd.replace('$value', connectedNodeVarName)
          if (node.data.pCmd.value === 'input') {
            const nodeVarName = 'd_var' + node.id
            newCmd = newCmd.replace('$input', nodeVarName)
            logOut = logOut.replace('$input', flowNodes[node.id].data.pValue.value)
          } else {
            logOut = logOut.replace('DOMinput: $input', '')
          }
          let cmdOut = logCmd
          cmdOut = cmdOut.replace('$log', logOut)
          cmdsArr.push(newCmd + cmdOut)
        } else {
          const connectedNodeVarName = 'd_var' + node.id
          let newCmd = cmdToCode[node.data.pCmd.value]
          let logOut = logText
          logOut = logOut.replace('$cmd', node.data.pCmd.value)
          logOut = logOut.replace('$value', flowNodes[node.id].data.pValue.value)
          newCmd = newCmd.replace('$value', connectedNodeVarName)
          let cmdOut = logCmd
          cmdOut = cmdOut.replace('$log', logOut)
          cmdsArr.push(newCmd + cmdOut)
        }
      } else {
      }
    }
  })
  console.log(cmdsArr)
}

function writeDataToFile() {
  writeFileSync(path.join(__dirname, 'testcase_1.js'), initialCode)
  cmdsArr.push('//await browser.close()\n;')
  //cmdsArr = cmdsArr.reverse()
  varArr.forEach((varVal) => {
    appendFileSync(path.join(__dirname, 'testcase_1.js'), varVal)
  })
  appendFileSync(path.join(__dirname, 'testcase_1.js'), '\n\n')
  cmdsArr.forEach((cmdVal) => {
    appendFileSync(path.join(__dirname, 'testcase_1.js'), cmdVal)
  })
  appendFileSync(path.join(__dirname, 'testcase_1.js'), '\n})')
  appendFileSync(
    path.join(__dirname, 'testcase_1.js'),
    `\nsocket.on('disconnect', async () => {
  process.kill(0)
})`,
  )
}

function getAllFlowNodes(nodes: any[]) {
  nodes.forEach((node: { id: string | number }) => {
    flowNodes[node.id] = node
  })
  console.log(flowNodes)
}

//startTest()

export function startTest() {
  try {
    writeFileSync(path.join(__dirname, 'testcase_1.js'), '')
    console.log('File cleared successfully.')
  } catch (err) {
    return console.error(err)
  }
  varArr = []
  cmdsArr = []
  flowNodes = {}
  const nodes = getObject(path.join(__dirname, 'objectStore.txt')).nodes
  const endNodeId = getEndNode(nodes)
  getAllFlowNodes(nodes)
  getAllVariables(nodes)
  getAllCommands(nodes)
  writeDataToFile()
  console.log('hello from puppetTester')

  exec(`node electron_main/testcase_1.js`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing file: ${error}`)
      return
    }
    if (stderr) {
      console.error(`Error output: ${stderr}`)
      return
    }
    console.log(`Output: ${stdout}`)
  })
}

export function getProjectsInfoJson() {
  const puppet_test_dir = __dirname.replace('\\electron_main', '\\puppet_test')
  try {
    const projectsInfoData = readFileSync(path.join(puppet_test_dir, 'projectsInfo.json'), 'utf8')
    const projectsInfo = JSON.parse(projectsInfoData)
    return projectsInfo
  } catch (err) {
    return 'error reading project.json or parsing'
  }
}
