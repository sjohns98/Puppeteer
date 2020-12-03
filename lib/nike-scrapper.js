const puppeteer = require('puppeteer');
const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(pluginStealth());

// const user = "smurk59@gmail.com";
// const pass = "NiceOne23";
// const cv2 = '123';
// const url = 'https://www.nike.com/t/air-force-1-07-mens-shoe-JkTGzADv/315122-111'
// const size = 'M 13 / W 14.5'

async function main(user, pass, cv2, size, url) {
  try {

    const browser = await puppeteerExtra.launch({
      headless: true,
      defaultViewport: null,
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.193 Safari/537.36')

    await page.goto(url);
    await page.waitForSelector('.css-xf3ahq');




    await page.evaluate((size) => {
      [...document.querySelectorAll('.css-xf3ahq')].find(element => element.textContent === size).click();
    }, size);

    const atb = await page.$('button.css-y0myut');
    await atb.click(10000);

    await page.waitFor(1000);
    await page.screenshot({path: 'omid.png'});

    const checkout = await page.$('#nav-cart');
    await checkout.click();

    await page.waitFor(1000);

    let isDisabled = await page.evaluate(() => {
      let btn = [...document.querySelectorAll('button:disabled')].find(element => element.textContent === 'Checkout');
      console.log(btn);
      if(!btn) return false;
      if(btn.length > 0) return true;
      return false;

      // console.log(btn);
      // return (btn || btn.length > 0) ? true : false;
    }, size);

    // console.log("isDisabled =>", isDisabled);


    // return;
    //we check here if its empty

    //check if the cart is empty

    //add method for adding item to cart and  check if its empty add item again.

    //Checkout

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