import puppeteer from 'puppeteer'
import { io } from 'socket.io-client';
import { expect } from 'chai'
import {setTimeout} from "node:timers/promises";

const socket = io('ws://localhost:3000');
const waitTime = 2000;
let isFailed = false;

socket.on('connect', async () => {

const browser = await puppeteer.launch({
  headless: true,
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

socket.emit('cmdExe', 'This test is about to start')

let d2_var1 = 'value not set'
let d1_var1 = 'value not set'
let d2_var2 = 'value not set'
let d1_var2 = 'value not set'
let v_var3 = 'https://www.google.com'
let d2_var4 = 'value not set'
let d1_var4 = '[GetValue]'
let v_var5 = 'value not set'
let a2_var6 = 'Googl'
let a1_var6 = 'value not set'
let d2_var9 = 'value not set'
let d1_var9 = 'value not set'


try {
    await page.goto(v_var3);
socket.emit('cmdExe', 'Command Executed - Command: get cmdValue: https://www.google.com ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 2 Error: ' + e.message);
  }


  try {
    v_var5 = await page.title();
socket.emit('cmdExe', 'Command Executed - Command: getTitle cmdValue: value not set ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 4 Error: ' + e.message);
  }


  try {
  expect(v_var5).to.equal(a2_var6);
  socket.emit('cmdExe', `Assert Passed - Command: expect Parameter 1: ${v_var5} equal Parameter 2: ${a2_var6}`)


  await setTimeout(waitTime);
}
catch (e)
{
  socket.emit('cmdExe', `Assert Failed - Command: expect Parameter 1: ${v_var5} equal Parameter 2: ${a2_var6}`)


  isFailed = true;
  socket.emit('cmdExe', 'Node: ' + 'Node 6 Error: ' + e.message);
}
socket.emit('cmdExe', "Info - 'title matched true'")


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