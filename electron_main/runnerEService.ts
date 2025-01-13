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
import { __currentProjectDir } from './projectsEService.js'
import { testcaseDataType } from '../src/ts_types/puppet_test_types.js'
import type { NodeType, flowNode } from '../src/ts_types/nodeType.js'
import { ENode } from './allEnums.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace('\\dist', '')
const __puppetDir = dirname(__filename).replace('\\electron_main\\dist', '\\puppet_test')
let __projectDir = 'null'
let __testcasesDir = 'null'

let currentTestcase: testcaseDataType | null = null

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

function getTestcaseJsonObject(testcaseData: testcaseDataType) {
  const str_jsonData = readFileSync(path.join(__testcasesDir, testcaseData.name + '.json'), 'utf8')
  const jsonData = JSON.parse(str_jsonData)
  return jsonData
}

function getEndNode(nodes: flowNode[]): string {
  let lastId = ''
  nodes.forEach((node: flowNode) => {
    const coreData: NodeType = node.data
    if (node.type === 'driver-node') {
      if (coreData.nodeData.cmd!.value === 'Stop') {
        lastId = node.id
      }
    }
  })
  return lastId
}

function getAllVariables(nodes: flowNode[]) {
  let newVar = 'def-var'
  nodes.forEach((node: flowNode) => {
    const coreData: NodeType = node.data
    if (node.type === ENode.varNode) {
      newVar = 'let v_var' + node.id + " = '" + coreData.nodeData.para1!.value + "'\n"
    } else if (node.type === ENode.domNode) {
      newVar = 'let e_var' + node.id + " = '" + coreData.nodeData.para1!.value + "'\n"
    } else if (node.type === ENode.driverNode) {
      newVar = 'let d_var' + node.id + " = '" + coreData.nodeData.para1!.value + "'\n"
    }
    varArr.push(newVar)
  })
  console.log(varArr)
}

function getAllCommands(nodes: flowNode[]) {
  nodes.forEach((node: flowNode) => {
    const coreData: NodeType = node.data
    if (node.type === ENode.driverNode) {
      if (coreData.nodeData.para1!.isRequired === true) {
        if (coreData.nodeData.para1!.isConnected) {
          let connectedNodeVarName = ''
          let logOut = logText
          const connectedNodeCoreData: NodeType =
            flowNodes[coreData.nodeData.para1!.connectedNodeId].data
          logOut = logOut.replace('$cmd', coreData.nodeData.cmd!.value)
          logOut = logOut.replace('$value', connectedNodeCoreData.nodeData.para1!.value)
          if (flowNodes[coreData.nodeData.para1!.connectedNodeId].type === ENode.varNode) {
            logOut = logOut.replace('DOMcss', 'cmdValue')
            connectedNodeVarName = 'v_var' + coreData.nodeData.para1!.connectedNodeId
          } else {
            connectedNodeVarName = 'e_var' + coreData.nodeData.para1!.connectedNodeId
          }
          let newCmd = cmdToCode[coreData.nodeData.cmd!.value]
          newCmd = newCmd.replace('$value', connectedNodeVarName)
          if (coreData.nodeData.cmd!.value === 'input') {
            const nodeVarName = 'd_var' + node.id
            newCmd = newCmd.replace('$input', nodeVarName)
            logOut = logOut.replace('$input', coreData.nodeData.para1!.value) // should be para2 here, not implemented yet
          } else {
            logOut = logOut.replace('DOMinput: $input', '')
          }
          let cmdOut = logCmd
          cmdOut = cmdOut.replace('$log', logOut)
          cmdsArr.push(newCmd + cmdOut)
        } else {
          const connectedNodeVarName = 'd_var' + node.id
          let newCmd = cmdToCode[coreData.nodeData.cmd!.value]
          let logOut = logText
          logOut = logOut.replace('$cmd', coreData.nodeData.cmd!.value)
          logOut = logOut.replace('$value', coreData.nodeData.para1!.value)
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

function getAllFlowNodes(nodes: flowNode[]) {
  nodes.forEach((node: flowNode) => {
    flowNodes[node.id] = node
  })
  console.log(flowNodes)
}

function writeDataToFile() {
  const testcasePath = path.join(__testcasesDir, currentTestcase!.name + '.js')
  writeFileSync(testcasePath, initialCode)
  cmdsArr.push('//await browser.close()\n;')
  //cmdsArr = cmdsArr.reverse()
  varArr.forEach((varVal) => {
    appendFileSync(testcasePath, varVal)
  })
  appendFileSync(testcasePath, '\n\n')
  cmdsArr.forEach((cmdVal) => {
    appendFileSync(testcasePath, cmdVal)
  })
  appendFileSync(testcasePath, '\n})')
  appendFileSync(
    testcasePath,
    `\nsocket.on('disconnect', async () => {
  process.kill(0)
})`,
  )
}

export function compileAndRun(testcaseData: testcaseDataType) {
  currentTestcase = testcaseData
  const testcasePath = path.join(__testcasesDir, currentTestcase!.name + '.js')
  try {
    writeFileSync(testcasePath, '')
    console.log('File cleared successfully.')
  } catch (err) {
    return console.error(err)
  }
  varArr = []
  cmdsArr = []
  flowNodes = {}
  const nodes = getTestcaseJsonObject(testcaseData).nodes
  const endNodeId = getEndNode(nodes)
  getAllFlowNodes(nodes)
  getAllVariables(nodes)
  getAllCommands(nodes)
  writeDataToFile()
  console.log(`testcase: ${testcaseData.name} running successfully`)
  const executePath = 'node ' + testcasePath
  exec(executePath, (error, stdout, stderr) => {
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

export function initializeERunnerService() {
  __projectDir = __currentProjectDir
  __testcasesDir = path.join(__projectDir, 'test_cases')
}
