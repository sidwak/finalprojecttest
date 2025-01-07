import type { projectDataType } from '../src/ts_types/puppet_test_types'
import { readFileSync, writeFileSync } from 'fs'
import { dirname } from 'path'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace('\\dist', '')
const __puppetDir = dirname(__filename).replace('\\electron_main\\dist', '\\puppet_test')
export function createNewProject(projectData: projectDataType) {
  try {
    const projectsInfoJson = readFileSync(path.join(__puppetDir, 'projectsInfo.json'), 'utf8')
    let jsonObject = JSON.parse(projectsInfoJson)
    jsonObject.projects.push(projectData)
    const updatedData = JSON.stringify(jsonObject, null, 2)
    writeFileSync(path.join(__puppetDir, 'projectsInfo.json'), updatedData, 'utf8')
  } catch (e: any) {
    return e
  }
}
