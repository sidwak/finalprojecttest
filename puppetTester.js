import { writeFileSync, readFileSync, appendFileSync, appendFile } from 'fs'
import { exec } from 'child_process'

let varArr = []
let cmdsArr = ['//await browser.close();']

let initialCode = `import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\\\Program Files (x86)\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  headless: false,
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

`

let cmdToCode = {
  get: 'await page.goto($value);\n',
  click: 'await page.locator($value).click();\n',
}

function getObject(filePath) {
  const data = readFileSync(filePath, 'utf8')
  const obj = JSON.parse(data) // Convert JSON string back to object
  return obj
}

function getEndNode(nodes) {
  let lastId = -1
  nodes.forEach((node) => {
    if (node.type === 'driver-node') {
      if (node.data.pCmd === 'Stop') {
        lastId = node.id
      }
    }
  })
  return lastId
}

function getAllVariables(nodes) {
  let newVar = 'def-var'
  nodes.forEach((node) => {
    if (node.type === 'var-node') {
      newVar = 'let v_var' + node.id + " = '" + node.data.pValue.value + "'\n"
    } else if (node.type === 'dom-node') {
      newVar = 'let e_var' + node.id + " = '" + node.data.pValue.value + "'\n"
    } else if (node.type === 'driver-node') {
      newVar = 'let d_var' + node.id + " = '" + node.data.pValue.value + "'\n"
    }
    varArr.push(newVar)
  })
  console.log(varArr)
}

function getAllCommands(nodes) {
  nodes.forEach((node) => {
    if (node.type === 'driver-node') {
      let newCmd = 'def-cmd'
      if (node.data.pValue.isRequired === true) {
        if (node.data.pValue.isConnected) {
          const connectedNodeVarName = 'v_var' + node.data.pValue.connnectedNodeId
          let newCmd = cmdToCode[node.data.pCmd.value]
          newCmd = newCmd.replace('$value', connectedNodeVarName)
          cmdsArr.push(newCmd)
        } else {
          const connectedNodeVarName = 'd_var' + node.id
          let newCmd = cmdToCode[node.data.pCmd.value]
          newCmd = newCmd.replace('$value', connectedNodeVarName)
          cmdsArr.push(newCmd)
        }
      } else {
      }
    }
  })
  console.log(cmdsArr)
}

function writeDataToFile() {
  writeFileSync('testcase_1.js', initialCode)
  cmdsArr = cmdsArr.reverse()
  varArr.forEach((varVal) => {
    appendFileSync('testcase_1.js', varVal)
  })
  appendFileSync('testcase_1.js', '\n\n')
  cmdsArr.forEach((cmdVal) => {
    appendFileSync('testcase_1.js', cmdVal)
  })
}

export function startTest() {
  const nodes = getObject('objectStore.txt').nodes
  const endNodeId = getEndNode(nodes)
  getAllVariables(nodes)
  getAllCommands(nodes)

  writeDataToFile()
  console.log('hello from puppetTester')

  exec(`node testcase_1.js`, (error, stdout, stderr) => {
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
