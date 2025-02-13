import { writeFileSync, readFileSync, appendFileSync, appendFile, writeFile, PathOrFileDescriptor } from 'fs'
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
