import puppeteer from 'puppeteer-core'
import { io } from 'socket.io-client';
import { expect } from 'chai'

const socket = io('ws://localhost:3000');

socket.on('connect', async () => {

const browser = await puppeteer.launch({
  //executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: false,
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

socket.emit('cmdExe', 'This test is about to start')

let d2_var1 = 'value not set'
let d1_var1 = 'https://www.google.com'
let d2_var2 = 'value not set'
let d1_var2 = 'value not set'
let d2_var7 = 'value not set'
let d1_var7 = 'value not set'


try {
    await page.goto(d1_var1);
socket.emit('cmdExe', 'Command Executed - Command: get DOMcss: https://www.google.com ')


  }
  catch (e)
  {
    socket.emit('cmdExe', e.message);
  }


  //await browser.close()
;
})
socket.on('disconnect', async () => {
  process.kill(0)
})