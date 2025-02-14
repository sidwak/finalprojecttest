import path from 'path'
import { app } from 'electron'
import { mkdirSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'fs'
import {
  projectDataType,
  projectsInfoType,
  testcaseDataType,
  testcaseFlowDataType,
  testcasesInfoType,
} from '../src/ts_types/puppet_test_types'
import { compileAndRun } from './E_RunnerService.js'

const __rootDir = path.join(app.getPath('userData'), 'nodexify_test')
let __testcasesDir: string
let __testcasesInfoDir: string
let __curTestcaseDir: string
let currentProject: projectDataType
let testcasesInfo: testcasesInfoType
let currentTestcase: testcaseDataType

const templateTestcaseData = JSON.stringify(
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

export async function createNewTestcase(testcaseData: testcaseDataType) {
  try {
    testcasesInfo.testCases.push(testcaseData)
    await updateTestcasesInfoJson()
    await createTestcaseDirectoryAndFiles(testcaseData)
    console.log(`testcase: ${testcaseData.name} was created successfully`)
  } catch (e: any) {
    console.log(`testcase: Error while creating testcase name: ${testcaseData.name} err: ${e}`)
    return e
  }
}

async function createTestcaseDirectoryAndFiles(testcaseData: testcaseDataType) {
  try {
    await mkdirSync(path.join(__testcasesDir, testcaseData.name), { recursive: true })
    await writeFileSync(path.join(__testcasesDir, testcaseData.name, testcaseData.name + '.json'), templateTestcaseData, 'utf8')
  } catch (err) {
    return `testcase: Error while creating directory or .json file for ${testcaseData.name} err: ${err}`
  }
}

async function deleteTestcaseDirectoryAndFiles(testcaseData: testcaseDataType) {
  try {
    await rmSync(path.join(__testcasesDir, testcaseData.name), { recursive: true, force: true })
  } catch (err) {
    return `testcase: Error while deleting directory for ${testcaseData.name} err: ${err}`
  }
}

async function moveAndRenameTestcase(oldTestcase: testcaseDataType, newTestcase: testcaseDataType) {
  /* try {
    await renameSync(
      path.join(__testcasesDir, oldTestcase.name, oldTestcase.name + '.js'),
      path.join(__testcasesDir, newTestcase.name, newTestcase.name + '.js'),
    )
  } catch (err) {
    console.log(`testcase: error while renaming .js file for id: ${oldTestcase.id} err: ${err}`)
  } */
  try {
    await renameSync(
      path.join(__testcasesDir, oldTestcase.name, oldTestcase.name + '.json'),
      path.join(__testcasesDir, newTestcase.name, newTestcase.name + '.json'),
    )
  } catch (err) {
    console.log(`testcase: error while renaming .json file for id: ${oldTestcase.id} err: ${err}`)
  }
}

export async function saveTestcaseData(testcaseSaveData: testcaseFlowDataType) {
  try {
    await setTestcaseFlowData(testcaseSaveData)
    console.log(`testcase: ${testcaseSaveData.testcaseData.name} saved successfully`)
  } catch (err) {
    return `testcase: Errow while saving testcase ${testcaseSaveData.testcaseData.name} err: ${err}`
  }
}

export async function loadTestcaseData(testcaseData: testcaseDataType) {
  try {
    __curTestcaseDir = path.join(__testcasesDir, testcaseData.name)
    currentTestcase = testcaseData
    const temp_flowData = await getTestcaseFlowData(testcaseData)
    return temp_flowData
  } catch (err) {
    return `testcase: Error: ${err}`
  }
}

export async function deleteTestcase(testcaseData: testcaseDataType) {
  try {
    await deleteTestcaseDirectoryAndFiles(testcaseData)
    testcasesInfo.testCases = testcasesInfo.testCases.filter((testCase: testcaseDataType) => testCase.id !== testcaseData.id)
    await updateTestcasesInfoJson()
  } catch (err: any) {
    return `testcase: Error while deleting testcase ${testcaseData.name} err: ${err}`
  }
}

export async function updateTestcaseData(testcaseData: testcaseDataType) {
  const index = testcasesInfo.testCases.findIndex((item: testcaseDataType) => item.id === testcaseData.id)
  const oldTestcase: testcaseDataType = JSON.parse(JSON.stringify(testcasesInfo.testCases[index]))
  if (index !== -1) {
    await checkForNameChange(oldTestcase, testcaseData, index)
    testcasesInfo.testCases[index]['headless'] = testcaseData.headless
    testcasesInfo.testCases[index]['waitTime'] = testcaseData.waitTime
    await updateTestcasesInfoJson()
  } else {
    console.log('testcase: Error while updating testcase with the given id err: id not found')
  }
}

async function checkForNameChange(oldTestcase: testcaseDataType, newTestcase: testcaseDataType, index: number) {
  if (oldTestcase.name === newTestcase.name) {
    return
  }
  testcasesInfo.testCases[index]['name'] = newTestcase.name
  await createTestcaseDirectoryAndFiles(newTestcase)
  await moveAndRenameTestcase(oldTestcase, newTestcase)
  await deleteTestcaseDirectoryAndFiles(oldTestcase)
}

/**
 * Gets testcaseInfo object for current project
 * @param projectData
 * @returns js object of testcaseInfo
 */
export async function getTestcasesInfoJson(projectData: projectDataType) {
  try {
    const testcasesInfoJson = await readFileSync(__testcasesInfoDir, 'utf8')
    let jsonObject = JSON.parse(testcasesInfoJson)
    testcasesInfo = jsonObject
    return jsonObject
  } catch (err) {
    return `testcase: Error while getting testcasesInfo for project: ${projectData.name} err: ${err}`
  }
}

export async function getTestcaseFlowData(testcaseData: testcaseDataType) {
  try {
    const testcaseFlowData = await readFileSync(path.join(__curTestcaseDir, testcaseData.name + '.json'), 'utf8')
    const temp_parsedData = JSON.parse(testcaseFlowData)
    console.log(`testcase: Flow data loaded successfully for testcase ${testcaseData.name}`)
    return temp_parsedData
  } catch (err) {
    console.log(`testcase: Error while getting testcaseData for testcase: ${testcaseData.name} err: ${err}`)
  }
}
async function setTestcaseFlowData(testcaseSaveData: testcaseFlowDataType) {
  try {
    const temp_nodesData = JSON.stringify(testcaseSaveData.nodesData, null, 2)
    await writeFileSync(path.join(__curTestcaseDir, testcaseSaveData.testcaseData.name + '.json'), temp_nodesData, 'utf8')
    console.log(`testcase: Flow data saved successfully for testcase ${testcaseSaveData.testcaseData.name}`)
  } catch (err) {
    console.log(`testcase: Error while update testcaseData for testcase: ${testcaseSaveData.testcaseData.name} err: ${err}`)
  }
}

async function updateTestcasesInfoJson() {
  try {
    await writeFileSync(__testcasesInfoDir, JSON.stringify(testcasesInfo, null, 2))
    console.log(`testcase: testcasesInfoJson updated successfully`)
  } catch (err) {
    return `testcase: Error whiel updating testcasesInfo err: ${err}`
  }
}

export function setCurrentProject(projectData: projectDataType) {
  __testcasesInfoDir = path.join(__rootDir, projectData.name, 'testCasesInfo.json')
  __testcasesDir = path.join(__rootDir, projectData.name, 'test_cases')
  currentProject = projectData
}

export async function runTestcase(testcaseData: testcaseDataType) {
  // should be async?
  return await compileAndRun(testcaseData)
}
