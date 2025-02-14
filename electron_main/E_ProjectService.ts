import path from 'path'
import { app } from 'electron'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { projectDataType, projectsInfoType } from '../src/ts_types/puppet_test_types'
import { setCurrentProject } from './E_TestcaseService.js'
import { initializeRunnerService } from './E_RunnerService.js'

const templateTestcaseJson = `
{
  "testCases": []
}
`

const __rootDir = path.join(app.getPath('userData'), 'nodexify_test')
const __projectsInfoDir = path.join(__rootDir, 'projectsInfo.json')
// dynamic
let projectsInfo: projectsInfoType
let currentProject: projectDataType
export let __currentProjectDir: string

export async function createNewProject(projectData: projectDataType) {
  try {
    projectsInfo.projects.push(projectData)
    await updateProjectsInfoJson()
    await createProjectDirectory(projectData)
    console.log(`projects: New project name: ${projectData.name} created successfully`)
  } catch (e: any) {
    console.log(`projects: Error while creating new project name:${projectData.name} err:${e}`)
    return e
  }
}

export async function setNewCurrentProject(projectData: projectDataType) {
  __currentProjectDir = path.join(__rootDir, projectData.name)
  currentProject = projectData
  console.log(`projects: New current project set successfully ${projectData.name}`)
  setCurrentProject(projectData)
  initializeRunnerService()
}

export async function deleteProjectWithId(projectData: projectDataType) {
  projectsInfo.projects = projectsInfo.projects.filter((item) => item.id !== projectData.id)
  await updateProjectsInfoJson()
  await deleteProjectDirectory(projectData)
  console.log(`Project with id:${projectData.id} name:${projectData.name} was deleted successfully`)
}

export function getCurrentProject() {
  return currentProject
}

async function updateProjectsInfoJson() {
  try {
    await writeFileSync(__projectsInfoDir, JSON.stringify(projectsInfo, null, 2), 'utf8')
  } catch (err) {
    return `projects: Error while updating projectsInfoJson err: ${err}`
  }
}

async function createProjectDirectory(projectData: projectDataType) {
  try {
    await mkdirSync(path.join(__rootDir, projectData.name, 'test_cases'), { recursive: true })
    await writeFileSync(path.join(__rootDir, projectData.name, 'testCasesInfo.json'), templateTestcaseJson, 'utf8')
    console.log(`projects: Project directories created successfully for project ${projectData.name}`)
  } catch (err) {
    return `projects: Error while creating directories for new project err: ${err}`
  }
}

async function deleteProjectDirectory(projectData: projectDataType) {
  try {
    await rmSync(path.join(__rootDir, projectData.name), { recursive: true, force: true })
    console.log(`projects: Project directories deleted successfully for project ${projectData.name}`)
  } catch (err) {
    return `projects: Error while deleting directories for project ${projectData.name} err: ${err}`
  }
}

export async function getProjectsInfoJson() {
  try {
    const projectsInfoData = await readFileSync(__projectsInfoDir, 'utf8')
    const temp_projectsInfo = JSON.parse(projectsInfoData)
    projectsInfo = temp_projectsInfo as projectsInfoType
    return temp_projectsInfo
  } catch (err) {
    return `projects: Error reading project.json or parsing error ${err}`
  }
}
