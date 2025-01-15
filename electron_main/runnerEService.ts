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
import { expect } from 'chai'

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
import { expect } from 'chai'

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

const driverCmds: any = {
  get: 'await page.goto($value);\n',
  click: 'await page.locator($value).click();\n',
  input: 'await page.locator($value).fill($input);\n',
}

let logText = `Command executed successfully - Command: $cmd DOMcss: $value DOMinput: $input`

const assertPassLogText =
  'Assert Passsed - Command: expect Parameter 1: $value1 $cmd Parameter 2: $value2'
const assertFailLogText =
  'Assert Failed - Command: expect Parameter 1: $value1 $cmd Parameter 2: $value2'

let logEmitCmd = `socket.emit('cmdExe', '$log')\n\n`

const chaiCmds: any = {
  equal: 'expect($value1).to.equal($value2);',
  notEqual: 'expect($value1).to.not.equal($value2);',
  greaterThan: 'expect($value1).to.be.above($value2);',
  lessThan: 'expect($value1).to.be.below($value2);',
  true: 'expect($value1).to.be.true;',
  false: 'expect($value1).to.be.false;',
  null: 'expect($value1).to.be.null;',
  empty: 'expect($value1).to.be.empty;',
  lengthAbove: 'expect($value1).to.have.lengthOf.above($value2);',
  lengthBelow: 'expect($value1).to.have.lengthOf.below($value2);',
  Type: 'expect($value1).to.be.a($value2);',
}
const fullCmdToCode: string = `try {
    $drivercmd
  }
  catch (e)
  {
    socket.emit('cmdExe', e.message);
  }\n\n
  `
const fullAssertToCode: string = `try {
  $assertcmd
  $emitLogPass
}
catch (e)
{
  $emitLogFail
  socket.emit('cmdExe', e.message);
}
`

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
    } else if (node.type === ENode.assertNode) {
      newVar = 'let a1_var' + node.id + " = '" + coreData.nodeData.para1!.value + "'\n"
      if (coreData.nodeData.para2?.isRequired) {
        let new2Var = 'let a2_var' + node.id + " = '" + coreData.nodeData.para2.value + "'\n"
        varArr.push(new2Var)
      }
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
          let logRaw = logText
          const connectedNodeCoreData: NodeType =
            flowNodes[coreData.nodeData.para1!.connectedNodeId].data
          logRaw = logRaw.replace('$cmd', coreData.nodeData.cmd!.value) // can chain with below one
          logRaw = logRaw.replace('$value', connectedNodeCoreData.nodeData.para1!.value)
          // if connected node to set is DOM node
          if (flowNodes[coreData.nodeData.para1!.connectedNodeId].type === ENode.varNode) {
            logRaw = logRaw.replace('DOMcss', 'cmdValue')
            connectedNodeVarName = 'v_var' + coreData.nodeData.para1!.connectedNodeId
          } else {
            connectedNodeVarName = 'e_var' + coreData.nodeData.para1!.connectedNodeId
          }
          let cmdRaw = driverCmds[coreData.nodeData.cmd!.value]
          cmdRaw = cmdRaw.replace('$value', connectedNodeVarName) // use var name NO DIRECT VALUE for any to be compiled JS code because of quotation marks ''
          // when there is a need for 2nd para like for input cmd
          if (coreData.nodeData.cmd!.value === 'input') {
            const nodeVarName = 'd_var' + node.id
            cmdRaw = cmdRaw.replace('$input', nodeVarName)
            logRaw = logRaw.replace('$input', coreData.nodeData.para1!.value) // should be para2 here, not implemented yet
          } else {
            logRaw = logRaw.replace('DOMinput: $input', '')
          }
          let compiledLogMsg = logEmitCmd
          compiledLogMsg = compiledLogMsg.replace('$log', logRaw)
          let compiledCmdCode: string = fullCmdToCode
          compiledCmdCode = compiledCmdCode.replace('$drivercmd', cmdRaw + compiledLogMsg)
          cmdsArr.push(compiledCmdCode)
          //cmdsArr.push(cmdRaw + compiledLogMsg)
        } else {
          const connectedNodeVarName = 'd_var' + node.id
          let cmdRaw = driverCmds[coreData.nodeData.cmd!.value]
          let logRaw = logText
          logRaw = logRaw.replace('$cmd', coreData.nodeData.cmd!.value)
          logRaw = logRaw.replace('$value', coreData.nodeData.para1!.value)
          cmdRaw = cmdRaw.replace('$value', connectedNodeVarName)
          let compiledLogMsg = logEmitCmd
          compiledLogMsg = compiledLogMsg.replace('$log', logRaw)
          let compiledCmdCode: string = fullCmdToCode
          compiledCmdCode = compiledCmdCode.replace('$drivercmd', cmdRaw + compiledLogMsg)
          cmdsArr.push(compiledCmdCode)
          //cmdsArr.push(cmdRaw + compiledLogMsg)
        }
      } else {
        // this is for driver get cmds when there is no need for any input parameter
      }
    } else if (node.type === ENode.assertNode) {
      let cmdRaw = chaiCmds[coreData.nodeData.cmd!.value]
      let logPassRaw = assertPassLogText.replace('$cmd', coreData.nodeData.cmd!.value)
      let logFailRaw = assertFailLogText.replace('$cmd', coreData.nodeData.cmd!.value)
      if (coreData.nodeData.para1!.isConnected) {
        let para1ConnectedNodeName = 'v_var' + coreData.nodeData.para1!.connectedNodeId
        const connectedNodeCoreData: NodeType =
          flowNodes[coreData.nodeData.para1!.connectedNodeId].data
        cmdRaw = cmdRaw.replace('$value1', para1ConnectedNodeName)
        logPassRaw = logPassRaw.replace('$value1', connectedNodeCoreData.nodeData.para1!.value)
        logFailRaw = logFailRaw.replace('$value1', connectedNodeCoreData.nodeData.para1!.value)
      } else {
        // para1 not connected
        const connectedNodeVarName = 'a1_var' + node.id
        cmdRaw = cmdRaw.replace('$value1', connectedNodeVarName)
        logPassRaw = logPassRaw.replace('$value1', coreData.nodeData.para1!.value)
        logFailRaw = logFailRaw.replace('$value1', coreData.nodeData.para1!.value)
      }
      if (coreData.nodeData.para2) {
        if (coreData.nodeData.para2.isRequired) {
          if (coreData.nodeData.para2.isConnected) {
            let para2ConnectedNodeName = 'v_var' + coreData.nodeData.para2!.connectedNodeId
            const connectedNodeCoreData: NodeType =
              flowNodes[coreData.nodeData.para2!.connectedNodeId].data
            cmdRaw = cmdRaw.replace('$value2', para2ConnectedNodeName)
            logPassRaw = logPassRaw.replace('$value2', connectedNodeCoreData.nodeData.para1!.value)
            logFailRaw = logFailRaw.replace('$value2', connectedNodeCoreData.nodeData.para1!.value)
          } else {
            // para2 not connected
            const connectedNodeVarName = 'a2_var' + node.id
            cmdRaw = cmdRaw.replace('$value2', connectedNodeVarName)
            logPassRaw = logPassRaw.replace('$value2', coreData.nodeData.para2.value!)
            logFailRaw = logFailRaw.replace('$value2', coreData.nodeData.para2.value!)
          }
        }
      } else {
        // not required para2
        logPassRaw = logPassRaw.replace('Parameter 2: $value2', '')
        logFailRaw = logFailRaw.replace('Parameter 2: $value2', '')
      }
      let compiledLogPassMsg = logEmitCmd.replace('$log', logPassRaw)
      let compiledLogFailMsg = logEmitCmd.replace('$log', logFailRaw)
      let compiledCmdCode: string = fullAssertToCode
      compiledCmdCode = compiledCmdCode.replace('$assertcmd', cmdRaw)
      compiledCmdCode = compiledCmdCode.replace('$emitLogPass', compiledLogPassMsg)
      compiledCmdCode = compiledCmdCode.replace('$emitLogFail', compiledLogFailMsg)
      cmdsArr.push(compiledCmdCode)
    }
  })
  console.log(cmdsArr)
}

function compileAssertNode(node: flowNode, coreData: NodeType) {}

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
