import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  headless: false,
})

const page = await browser.newPage()

await page.setViewport({ width: 1080, height: 1024 })

let d_var0 = 'value not set'
let v_var1 = 'https://www.google.com'
let d_var2 = 'value not set'


await page.goto(v_var1);
//await browser.close();