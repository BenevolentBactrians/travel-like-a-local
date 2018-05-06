const puppeteer = require('puppeteer');

const isDebugging = () => {
  const debugging_mode = {
    headless: false,  // define whether Chromium is open and running
    slowMo: 250,      // slow down operations
    devtools: true   // open devtools
  }
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
}

let browser;
let page;

beforeAll(async() => {
  browser = await puppeteer.launch(isDebugging()); // browser instance
  page = await browser.newPage();  // page instance  
  
  // tell puppeteer where to navigate to in the browser
  await page.goto('http://localhost:3000/')  
  // set options for page
  page.setViewport({width: 500, height: 2400});
  
})

describe('on page load', () => {
  
  test('testing is functional', async() => {
    // simple test of jest functionality
    expect(2+2).toBe(4);            
  }, 1600) // set timeout for test
  
  test('navbar loads correctly', async() => {  
    // check if navbar element exists
    const navbar = await page.$eval('[data-testid="navbar"]', el => el ? true : false );
    expect(navbar).toBe(true);
  }, 1600)
  
  test('navbar h3 (title) loads correctly', async() => {   
    const html = await page.$eval('[data-testid="navbar h3"]', e => e.innerHTML)    
    expect(html).toBe('Travel Like a Local')            
  }, 1600)
  
})

afterAll(() => {
  if ( isDebugging() ) {
    browser.close()
  }
})