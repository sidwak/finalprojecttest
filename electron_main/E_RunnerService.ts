import { writeFileSync, readFileSync, appendFileSync, appendFile, writeFile, PathOrFileDescriptor } from 'fs'
import { exec } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { __currentProjectDir } from './E_ProjectService.js'
import { testcaseDataType, testcaseFlowDataType } from '../src/ts_types/puppet_test_types.js'
import type { NodeType, flowNode } from '../src/ts_types/nodeType.js'
import { ENode } from './allEnums.js'
import { app } from 'electron'
import { FlowExportObject } from '@vue-flow/core'
import { getTestcaseFlowData } from './E_TestcaseService.js'
import { io } from 'socket.io-client'
import puppeteer from 'puppeteer'
import { expect } from 'chai'
import { setTimeout } from 'node:timers/promises'

export enum EExeState {
  Normal,
  Warn,
  Success,
  Error,
}

//#region --------Directories
const __rootDir = path.join(app.getPath('userData'), 'nodexify_test')
let __projectDir: string
//#endregion

//#region --------Dynamic State Vars
let currentTestcase: testcaseDataType
let flowData: FlowExportObject
//#endregion

//#region ---------Runtime Vars
let nodesDict: any = {}
let startNodeId: string = '-1'
let failureOccured: boolean = false
let waitTime = 0
//#endregion

//#region ---------Socket-IO
const socket = io('ws://localhost:3000')

socket.on('connect', async () => {
  console.log('runnerService connected to main.js')
})

function socketEmit(msg: string) {
  socket.emit('logger', msg)
}
function socketEmitNodeExeState(nodeId: string, exeState: EExeState) {
  const executedData = {
    id: nodeId,
    exeState: exeState,
  }
  socket.emit('execr', JSON.stringify(executedData))
}
//#endregion

//#region ---------Puppeteer Vars
let browser: Awaited<ReturnType<typeof puppeteer.launch>>
let page: Awaited<ReturnType<typeof browser.newPage>>
//#endregion

//#region ---------Init Functions
async function getTestcaseAllData(testcaseData: testcaseDataType) {
  currentTestcase = testcaseData
  flowData = await getTestcaseFlowData(testcaseData)
}
function mapNodesDict() {
  flowData.nodes.forEach((node) => {
    nodesDict[node.id] = node
  })
}
function getStartNodeId() {
  flowData.nodes.forEach((node) => {
    const coreData: NodeType = node.data
    if (coreData.nodeData.cmd.value === 'Start') {
      console.log(`runner: Found start node with id ${node.id}`)
      startNodeId = node.id
    }
  })
}
//#endregion

//#region ----------Logs, Warnings and Error Functions
// ----------Things to validate at Frontend
/**
 * handle connection compatibility
 * single and no multiple start node
 * check 'value not set' for all nodes  mainly for driver node and assert node
 */
function logError(errMsg: unknown, node: flowNode) {
  let whichNode = 'Command Failed'
  if (node.type === ENode.assertNode) {
    whichNode = 'Assert Failed'
  }
  const msg = `${whichNode} - NodeId: ${node.id} NodeName: ${node.data.nodeName} Desc: ${errMsg}`
  console.log(msg)
  socketEmit(msg)
  socketEmitNodeExeState(node.id, EExeState.Error)
  failureOccured = true
}
function logSuccess(node: flowNode, para1: NodeType, para2: NodeType) {
  let whichNode = 'Command Passed'
  const para1S = para1.nodeData.para1.value !== 'value not set' ? para1.nodeData.para1.value : ''
  const para2S = para2.nodeData.para2.value !== 'value not set' ? para2.nodeData.para2.value : ''
  let msg = `${whichNode} - NodeId: ${node.id} NodeName: ${node.data.nodeName}; CMD: ${node.data.nodeData.cmd.value} P1:${para1S} P2:${para2S}`
  if (node.type === ENode.assertNode) {
    whichNode = 'Assert Passed'
    msg = `${whichNode} - NodeId: ${node.id} NodeName: ${node.data.nodeName}; Expect P1:${para1S} ${node.data.nodeData.cmd.value} P2:${para2S}`
  }
  console.log(msg)
  socketEmit(msg)
  socketEmitNodeExeState(node.id, EExeState.Success)
}
function logInfo(msg: string, nodeId: string) {
  const info = `Info - ${msg}`
  socketEmit(info)
  socketEmitNodeExeState(nodeId, EExeState.Success)
}
function logResult(isFailed: boolean) {
  let msg = 'Testcase Passed'
  if (isFailed) {
    msg = 'Testcase Failed'
  }
  console.log(msg)
  socketEmit(msg)
}
//#endregion

//#region ----------Runner Functions
function getParameters(nodeId: string) {
  const coreData: NodeType = nodesDict[nodeId].data
  let para1NodeRef = null,
    para2NodeRef = null
  // skipping isRequired Check
  if (coreData.nodeData.para1.isConnected) {
    para1NodeRef = nodesDict[coreData.nodeData.para1.connectedNodeId]
  }
  if (coreData.nodeData.para2.isConnected) {
    const id = coreData.nodeData.para2.connectedNodeId
    para2NodeRef = nodesDict[id] as flowNode
    para2NodeRef.data.nodeData.para2 = para2NodeRef.data.nodeData.para1
  }
  return {
    para1Node: para1NodeRef ? (para1NodeRef.data as NodeType) : coreData,
    para2Node: para2NodeRef ? (para2NodeRef.data as NodeType) : coreData,
    cmdObj: coreData.nodeData.cmd,
  }
}

async function compileDriverNode(node: flowNode) {
  // DO NOT PASS NUMBERS OR DIRECT VALUES, PASS ONLY OBJECTS
  const { para1Node, para2Node, cmdObj } = getParameters(node.id)
  try {
    await executeDriverCmd(node, cmdObj, para1Node, para2Node)
    logSuccess(node, para1Node, para2Node)
  } catch (err) {
    logError(err, node)
  }
}

async function executeDriverCmd(
  curNode: flowNode,
  cmdObj: { value: string; isRequired: boolean; isGetOnly: boolean },
  para1: NodeType,
  para2: NodeType,
) {
  switch (cmdObj.value) {
    case 'get':
      return await cmd_Get(para1)
    case 'getTitle':
      return await cmd_GetTitle(curNode, para1)
    case 'click':
      return await cmd_Click(para1)
    case 'input':
      return await cmd_Input(para1, para2)
    case 'back':
      return await cmd_Back()
    case 'forward':
      return await cmd_Forward()
    case 'refresh':
      return await cmd_Refresh()
    case 'innerHTML':
      return await cmd_InnerHTML(para1, para2)
  }
}

function compileAssertNode(node: flowNode) {
  const { para1Node, para2Node, cmdObj } = getParameters(node.id)
  try {
    executeAssertCmd(cmdObj, para1Node, para2Node)
    logSuccess(node, para1Node, para2Node)
  } catch (err) {
    logError(err, node)
  }
}

function compileLogNode(node: flowNode) {
  const { para1Node, para2Node, cmdObj } = getParameters(node.id)
  logInfo(para1Node.nodeData.para1.value, node.id)
}

function executeAssertCmd(cmdObj: { value: string; isRequired: boolean; isGetOnly: boolean }, para1: NodeType, para2: NodeType) {
  switch (cmdObj.value) {
    case 'equal':
      return assert_equal(para1, para2)
    case 'notEqual':
      return assert_notEqual(para1, para2)
    case 'greaterThan':
      return assert_greaterThan(para1, para2)
    case 'lessThan':
      return assert_lessThan(para1, para2)
    case 'true':
      return assert_true(para1)
    case 'false':
      return assert_false(para1)
    case 'null':
      return assert_null(para1)
    case 'empty':
      return assert_empty(para1)
    case 'lengthAbove':
      return assert_lengthAbove(para1, para2)
    case 'lengthBelow':
      return assert_lengthBelow(para1, para2)
    case 'Type':
      return assert_Type(para1, para2)
  }
}

async function compileNode(node: flowNode) {
  if (node.type === ENode.driverNode) {
    await compileDriverNode(node)
    await setTimeout(waitTime)
  } else if (node.type === ENode.assertNode) {
    compileAssertNode(node)
  } else if (node.type === ENode.logNode) {
    compileLogNode(node)
  }
}

async function processNodes() {
  let curNode = nodesDict[startNodeId] as flowNode
  while (true) {
    const coreData: NodeType = curNode.data
    const nextNodeId = coreData.nextNodeId
    await compileNode(curNode)
    if (nextNodeId !== '-1' && failureOccured === false) {
      curNode = nodesDict[nextNodeId]
    } else {
      break
    }
  }
}

export async function compileAndRun(testcaseData: testcaseDataType) {
  //
  await getTestcaseAllData(testcaseData)
  socketEmit(`Executing Testcase - TestcaseName: ${testcaseData.name}...`)
  //
  mapNodesDict()
  //
  getStartNodeId() // verify at frontend
  //
  await launchBrowser(testcaseData)
  //
  await processNodes()

  if (failureOccured) {
    logResult(true)
  } else {
    logResult(false)
  }
}

export function initializeRunnerService() {
  __projectDir = __currentProjectDir
}
//#endregion

//#region ---------Puppeteer Functions
async function launchBrowser(testcaseData: testcaseDataType) {
  browser = await puppeteer.launch({
    headless: testcaseData.headless,
    args: ['--suppress-message-center-popups', '--enable-automation'],
  })
  waitTime = testcaseData.waitTime
  failureOccured = false
  page = await browser.newPage()
  page.setViewport({ width: 1080, height: 1024 })
  page.setDefaultTimeout(4000)
}

async function cmd_Get(para1: NodeType) {
  await page.goto(para1.nodeData.para1.value)
}
async function cmd_GetTitle(curNode: flowNode, para1: NodeType) {
  para1.nodeData.para1.value = await page.title()
  curNode.data.nodeData.para1.value = para1.nodeData.para1.value
}
async function cmd_Click(para1: NodeType) {
  await page.locator(para1.nodeData.para1.value).click()
}
async function cmd_Input(para1: NodeType, para2: NodeType) {
  await page.locator(para1.nodeData.para1.value).fill(para2.nodeData.para2.value)
}
async function cmd_Back() {
  await page.goBack()
}
async function cmd_Forward() {
  await page.goForward()
}
async function cmd_Refresh() {
  await page.reload()
}
async function cmd_InnerHTML(para1: NodeType, para2: NodeType) {
  para1.nodeData.para1.value = await page.$eval(para2.nodeData.para2.value, (element) => element.innerHTML)
}
//#endregion

//#region  ---------Chai Functions
function typeConvert(value: string) {
  if (value === null || value === undefined) {
    return value // Return as is if it's null or undefined
  }
  const num = Number(value)
  if (!isNaN(num)) {
    return num // Return number if the value is a valid number
  }
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
  if (value.toLowerCase() === 'null') {
    return null
  }
  //value = "'" + value + "'"
  return value // Return the original string if no conversion works
}

function assert_equal(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.equal(typeConvert(para2.nodeData.para2.value))
}
function assert_notEqual(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.not.equal(typeConvert(para2.nodeData.para2.value))
}
function assert_greaterThan(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.above(typeConvert(para2.nodeData.para2.value) as number)
}
function assert_lessThan(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.below(typeConvert(para2.nodeData.para2.value) as number)
}
function assert_true(para1: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.true
}
function assert_false(para1: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.false
}
function assert_null(para1: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.null
}
function assert_empty(para1: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.empty
}
function assert_lengthAbove(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.have.lengthOf.above(typeConvert(para2.nodeData.para2.value) as number)
}
function assert_lengthBelow(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.have.lengthOf.below(typeConvert(para2.nodeData.para2.value) as number)
}
function assert_Type(para1: NodeType, para2: NodeType) {
  expect(typeConvert(para1.nodeData.para1.value)).to.be.a(typeConvert(para2.nodeData.para2.value) as string)
}
//#endregion
