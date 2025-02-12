import puppeteer from 'puppeteer'
import { io } from 'socket.io-client';
import { expect } from 'chai'
import {setTimeout} from "node:timers/promises";

const socket = io('ws://localhost:3000');
const waitTime = 0;
let isFailed = false;

socket.on('connect', async () => {

const browser = await puppeteer.launch({
  headless: false,
  Args: ["--suppress-message-center-popups"],
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

socket.emit('cmdExe', 'This test is about to start')

let d2_var2 = 'value not set'
let d1_var2 = 'https://www.google.com'
let d2_var4 = 'value not set'
let d1_var4 = 'value not set'
let d2_var6 = 'value not set'
let d1_var6 = 'value not set'
let a2_var8 = 'value not set'
let a1_var8 = 'value not set'


try {
    await page.goto(d1_var2);
socket.emit('cmdExe', 'Command Executed - Command: get cmdValue: https://www.google.com ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 2 Error: ' + e.message);
  }


  socket.emit('cmdExe', "Info - 'value not set'")


await setTimeout(waitTime);//await browser.close()
;
if (isFailed){
    socket.emit('cmdExe', 'Testcase Failed')
}
else {
    socket.emit('cmdExe', 'Testcase Passed')
}

})
socket.on('disconnect', async () => {
  process.kill(0)
})