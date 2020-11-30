const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(pluginStealth());

// const user = "smurk59@gmail.com";
// const pass = "NiceOne23";
// const cv2 = '123';

async function main(user, pass, cv2, size) {
  try {


    const browser = await puppeteerExtra.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.193 Safari/537.36')

    await page.goto('https://www.nike.com/t/air-force-1-07-mens-shoe-JkTGzADv/315122-111');
    //await page.goto('https://www.nike.com/t/zoom-freak-2-basketball-shoe-B1c3K6/CK5424-004');
    await page.waitForSelector('.css-xf3ahq');


    //'M 13 / W 14.5'
    //const button = await page.$$('.css-xf3ahq');
    //const sizes = await page.evaluate(() => Array.from(document.querySelectorAll('.css-xf3ahq'), c => c.innerText));
    await page.evaluate((size) => {
      [...document.querySelectorAll('.css-xf3ahq')].find(element => element.textContent === size).click();
    }, size);
    //await page.evaluate(() => {
    //[...document.querySelector('.css-y0myut')].find(addToBag => addToBag.textContent === 'Add to Bag').click();
    //});
    const atb = await page.$('button.css-y0myut');
    await atb.click(2000);
    // await page.waitFor(654);
    const checkout = await page.$('#nav-cart');
    await checkout.click(2000);


    //check if the cart is empty

    //we can add method for adding item to cart and here we can check if its empty add item again.



    //await page.evaluate(() =>{
    await page.waitForSelector('button.css-1lkcnio.e16pwdtm0');
    const checkout2 = await page.$('button.css-1lkcnio.e16pwdtm0');
    await page.waitFor(400);
    checkout2.click();

    await page.waitForSelector('.emailAddress');
    await page.waitFor(540);

    await page.focus('.emailAddress > input');
    await page.keyboard.type(user);

    await page.focus('.password > input')
    await page.keyboard.type(pass);
    await page.waitFor(2230);

    await page.evaluate(() => document.querySelector('.nike-unite-submit-button input').click());
    // await page.click('.nike-unite-submit-button input');
    // await form.evaluate(form => {console.log(form); form.submit()});


    await page.waitFor(3000);

    await page.evaluate(() => {
      let elements = [...document.querySelectorAll('button')].find(element => element.textContent === 'OK');
      console.log(elements);
      elements.click();
    });




    await page.waitFor(1000);
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(element => element.textContent === 'Continue to Payment').click();
    });

    await page.waitFor(2000);

    const frame = await page.frames().find(f => f.url().includes('paymentcc.nike.com'));
    //  //paymentcc.nike.com

    const cvNumber = await frame.$("#cvNumber");
    await cvNumber.type(cv2);
    await page.waitFor(230);
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(element => element.textContent === 'Continue To Order Review').click();
    });


    await page.waitFor(1230);
    await page.evaluate(() => {
      [...document.querySelectorAll('button')].find(element => element.textContent === 'Place Order').click();
    });

    await page.waitFor(2000);

    await page.close();
    await browser.close();
    
    return;

  } catch (e) {
    console.log('our error', e)
  }



}

module.exports = main;