import type { projectDataType } from '../src/ts_types/puppet_test_types'
import { readFileSync, writeFileSync, mkdirSync, rm } from 'fs'
import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeERunnerService } from './runnerEService.js'
import { app } from 'electron'

interface projectsInfoType {
  projects: projectDataType[]
}

//const __filename = fileURLToPath(import.meta.url)
//const __dirname = dirname(__filename).replace('\\dist', '')
//const __puppetDir = dirname(__filename).replace('\\electron_main\\dist', '\\puppet_test')
const __puppetDir = path.join(app.getPath('userData'), 'nodexify_test')
export let __currentProjectDir = ''

let currentProject: projectDataType

const templateTestcaseJson = `
{
  "testCases": []
}
`

export function createNewProject(projectData: projectDataType) {
  try {
    const projectsInfoJson = readFileSync(path.join(__puppetDir, 'projectsInfo.json'), 'utf8')
    let jsonObject = JSON.parse(projectsInfoJson)
    jsonObject.projects.push(projectData) // here projects is the array
    const updatedData = JSON.stringify(jsonObject, null, 2)
    writeFileSync(path.join(__puppetDir, 'projectsInfo.json'), updatedData, 'utf8')
    mkdirSync(path.join(__puppetDir, projectData.name, 'test_cases'), { recursive: true })
    writeFileSync(path.join(__puppetDir, projectData.name, 'testCasesInfo.json'), templateTestcaseJson, 'utf8')
    console.log(`projects: New project name: ${projectData.name} created successfully`)
  } catch (e: any) {
    console.log(`projects: Error while creating new project name:${projectData.name} err:${e}`)
    return e
  }
}

export function getCurrentProject() {
  return currentProject
}

export function setNewCurrentProject(projectData: projectDataType) {
  __currentProjectDir = path.join(__puppetDir, projectData.name)
  currentProject = projectData
  console.log('New current project set successfully')
  console.log(currentProject)
  initializeERunnerService()
}

function getProjectsInfoObject() {
  const projectsInfoJson = readFileSync(path.join(__puppetDir, 'projectsInfo.json'), 'utf8')
  let jsonObject = JSON.parse(projectsInfoJson)
  return jsonObject
}

function setProjectsInfoObject(jsonObject: projectsInfoType) {
  const updatedData = JSON.stringify(jsonObject, null, 2)
  writeFileSync(path.join(__puppetDir, 'projectsInfo.json'), updatedData, 'utf8')
}

export function deleteProjectWithId(projectData: projectDataType) {
  const projectsInfo: projectsInfoType = getProjectsInfoObject()
  projectsInfo.projects = projectsInfo.projects.filter((item) => item.id !== projectData.id)
  setProjectsInfoObject(projectsInfo)
  rm(path.join(__puppetDir, projectData.name), { recursive: true, force: true }, (err) => {
    if (err) {
      console.error('Error deleting directory:', err)
    } else {
      console.log('Directory and its contents have been deleted.')
    }
  })
  console.log(`Project with id:${projectData.id} name:${projectData.name} was deleted successfully`)
}

export function getProjectsInfoJson() {
  try {
    const projectsInfoData = readFileSync(path.join(__puppetDir, 'projectsInfo.json'), 'utf8')
    const projectsInfo = JSON.parse(projectsInfoData)
    return projectsInfo
  } catch (err) {
    return `error reading project.json or parsing error ${err}`
  }
}
