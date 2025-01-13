import puppeteer from 'puppeteer-core'
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

socket.on('connect', async () => {

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: false,
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

socket.emit('cmdExe', 'This test is about to start')

let d_var0 = 'value not set'
let d_var1 = 'value not set'
let v_var2 = 'https:\\www.google.com'


await page.goto(v_var2);
socket.emit('cmdExe', 'Command executed successfully - Command: get cmdValue: https:\\www.google.com ')

//await browser.close()
;
})
socket.on('disconnect', async () => {
  process.kill(0)
})