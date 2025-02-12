import puppeteer from 'puppeteer'
import { io } from 'socket.io-client';
import { expect } from 'chai'
import {setTimeout} from "node:timers/promises";

const socket = io('ws://localhost:3000');
const waitTime = 1500;
let isFailed = false;

socket.on('connect', async () => {

const browser = await puppeteer.launch({
  headless: false,
  Args: ["--suppress-message-center-popups"],
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

socket.emit('cmdExe', 'This test is about to start')

let d2_var1 = 'value not set'
let d1_var1 = 'value not set'
let d2_var2 = 'value not set'
let d1_var2 = 'value not set'
let v_var3 = 'https://www.saucedemo.com/'
let d2_var4 = 'value not '
let d1_var4 = '#user-name'
let v_var5 = 'standard_user'
let d2_var7 = 'secret_sauce'
let d1_var7 = '#password'
let d2_var8 = 'value not set'
let d1_var8 = 'value not set'
let e_var11 = '#login-button'
let d2_var12 = 'value not set'
let d1_var12 = '::-p-xpath(//*[@id="add-to-cart-sauce-labs-backpack"])'
let d2_var13 = 'value not set'
let d1_var13 = '.shopping_cart_link'
let d2_var15 = '.title'
let d1_var15 = '[GetValue]'
let a2_var16 = 'Your Cart'
let a1_var16 = 'value not set'
let v_var17 = 'value not set'


try {
    await page.goto(v_var3);
socket.emit('cmdExe', 'Command Executed - Command: get cmdValue: https://www.saucedemo.com/ ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 2 Error: ' + e.message);
  }


  try {
    await page.locator(d1_var4).fill(v_var5);
socket.emit('cmdExe', 'Command Executed - Command: input cmdValue: #user-name DOMinput: standard_user')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 4 Error: ' + e.message);
  }


  try {
    await page.locator(d1_var7).fill(d2_var7);
socket.emit('cmdExe', 'Command Executed - Command: input cmdValue: #password DOMinput: secret_sauce')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 7 Error: ' + e.message);
  }


  try {
    await page.locator(e_var11).click();
socket.emit('cmdExe', 'Command Executed - Command: click DOMcss: #login-button ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 8 Error: ' + e.message);
  }


  try {
    await page.locator(d1_var12).click();
socket.emit('cmdExe', 'Command Executed - Command: click cmdValue: ::-p-xpath(//*[@id="add-to-cart-sauce-labs-backpack"]) ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 12 Error: ' + e.message);
  }


  try {
    await page.locator(d1_var13).click();
socket.emit('cmdExe', 'Command Executed - Command: click cmdValue: .shopping_cart_link ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 13 Error: ' + e.message);
  }


  try {
    v_var17 = await page.$eval(d2_var15, element => element.innerHTML);socket.emit('cmdExe', 'Command Executed - Command: innerHTML cmdValue: value not set ')


    await setTimeout(waitTime);
  }
  catch (e)
  {
    isFailed = true;
    socket.emit('cmdExe', 'Node: ' + 'Node 15 Error: ' + e.message);
  }


  try {
  expect(v_var17).to.equal(a2_var16);
  socket.emit('cmdExe', `Assert Passed - Command: expect Parameter 1: ${v_var17} equal Parameter 2: ${a2_var16}`)


  await setTimeout(waitTime);
}
catch (e)
{
  socket.emit('cmdExe', `Assert Failed - Command: expect Parameter 1: ${v_var17} equal Parameter 2: ${a2_var16}`)


  isFailed = true;
  socket.emit('cmdExe', 'Node: ' + 'Node 16 Error: ' + e.message);
}
//await browser.close()
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