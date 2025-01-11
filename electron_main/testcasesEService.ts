import type { projectDataType, testcaseFlowDataType } from '../src/ts_types/puppet_test_types'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import type { testcaseDataType } from '../src/ts_types/puppet_test_types'
import { getCurrentProject } from './projectsEService.js' // .js is IMPORTANT here to treat it as module
import { compileAndRun } from './runnerEService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace('\\dist', '')
const __puppetDir = dirname(__filename).replace('\\electron_main\\dist', '\\puppet_test')
let __currentProjectDir = 'null'
const defaultTestcaseData = JSON.stringify(
  {
    nodes: [],
    edges: [],
    position: [0, 0],
    zoom: 1,
    viewport: {
      x: 0,
      y: 0,
      zoom: 1,
    },
  },
  null,
  2,
)

export function createNewTestcase(testcaseData: testcaseDataType) {
  try {
    const testcasesInfoJson = readFileSync(
      path.join(__puppetDir, getCurrentProject().name + '\\testCasesInfo.json'),
      'utf8',
    )
    let jsonObject = JSON.parse(testcasesInfoJson)
    jsonObject.testCases.push(testcaseData) // here testCases is the array
    const updatedData = JSON.stringify(jsonObject, null, 2)
    writeFileSync(
      path.join(__puppetDir, getCurrentProject().name + '\\testCasesInfo.json'),
      updatedData,
      'utf8',
    )
    writeFileSync(
      path.join(__puppetDir, getCurrentProject().name, 'test_cases', testcaseData.name + '.json'),
      defaultTestcaseData,
      'utf8',
    )
  } catch (e: any) {
    return e
  }
}

export function getTestcasesInfoJson(projectData: projectDataType) {
  try {
    __currentProjectDir = path.join(__puppetDir, projectData.name)
    const testcasesInfoJson = readFileSync(
      path.join(__puppetDir, projectData.name + '\\testCasesInfo.json'),
      'utf8',
    )
    let jsonObject = JSON.parse(testcasesInfoJson)
    return jsonObject
  } catch (err) {
    return err
  }
}

export function saveTestcaseData(testcaseSaveData: testcaseFlowDataType) {
  const nodesData = testcaseSaveData.nodesData
  const str_nodesData = JSON.stringify(nodesData, null, 2)
  try {
    writeFileSync(
      path.join(__currentProjectDir, 'test_cases', testcaseSaveData.testcaseData.name + '.json'),
      str_nodesData,
      'utf8',
    )
    console.log(`testcase: ${testcaseSaveData.testcaseData.name} saved successfully`)
  } catch (err) {
    return err
  }
}

export function loadTestcaseData(testcaseData: testcaseDataType) {
  try {
    const str_nodesData = readFileSync(
      path.join(__currentProjectDir, 'test_cases', testcaseData.name + '.json'),
      'utf8',
    )
    const nodesData = JSON.parse(str_nodesData)
    console.log(`testcase: ${testcaseData.name} data loaded successfully`)
    return nodesData
  } catch (err) {
    return err
  }
}

export function runTestcase(testcaseData: testcaseDataType) {
  compileAndRun(testcaseData)
}
