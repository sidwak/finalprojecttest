import puppeteer from 'puppeteer-core'
import { io } from 'socket.io-client';
import { expect } from 'chai'

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
let d_var1 = 'https:\\www.google.com'
let v_var2 = 14
let a2_var3 = 12
let a1_var3 = 11


try {
    await page.goto(d_var1);
socket.emit('cmdExe', 'Command Executed - Command: get DOMcss: https:\\www.google.com ')


  }
  catch (e)
  {
    socket.emit('cmdExe', e.message);
  }


  try {
  expect(v_var2).to.be.above(a2_var3);
  socket.emit('cmdExe', 'Assert Passed - Command: expect Parameter 1: 14 greaterThan Parameter 2: 12')


}
catch (e)
{
  socket.emit('cmdExe', 'Assert Failed - Command: expect Parameter 1: 14 greaterThan Parameter 2: 12')


  socket.emit('cmdExe', e.message);
}
//await browser.close()
;
})
socket.on('disconnect', async () => {
  process.kill(0)
})