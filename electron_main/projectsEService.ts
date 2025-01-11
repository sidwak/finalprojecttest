import type { projectDataType } from '../src/ts_types/puppet_test_types'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'
import { initializeERunnerService } from './runnerEService.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace('\\dist', '')
const __puppetDir = dirname(__filename).replace('\\electron_main\\dist', '\\puppet_test')
export let __currentProjectDir = ''

let currentProject: projectDataType

export function createNewProject(projectData: projectDataType) {
  try {
    const projectsInfoJson = readFileSync(path.join(__puppetDir, 'projectsInfo.json'), 'utf8')
    let jsonObject = JSON.parse(projectsInfoJson)
    jsonObject.projects.push(projectData) // here projects is the array
    const updatedData = JSON.stringify(jsonObject, null, 2)
    writeFileSync(path.join(__puppetDir, 'projectsInfo.json'), updatedData, 'utf8')
  } catch (e: any) {
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

export function getProjectsInfoJson() {
  try {
    const projectsInfoData = readFileSync(path.join(__puppetDir, 'projectsInfo.json'), 'utf8')
    const projectsInfo = JSON.parse(projectsInfoData)
    return projectsInfo
  } catch (err) {
    return 'error reading project.json or parsing'
  }
}
