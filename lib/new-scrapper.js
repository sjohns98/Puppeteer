const puppeteer = require('puppeteer');
// const puppeteerExtra = require('puppeteer-extra');
// const pluginStealth = require('puppeteer-extra-plugin-stealth');
// puppeteerExtra.use(pluginStealth());

const fs = require('fs');
const addToBagText = 'Add to Bag';
const goToPaymentPageText = 'Ödeme Sayfasına Git';
const payWithLoginText = 'Member Checkout';
const goToCheckoutText = 'Go to Checkout';
const memberCheckoutButtonText = 'MEMBER CHECKOUT';
// const cv2 = '123';
// const url = 'https://www.nike.com/t/air-force-1-07-mens-shoe-JkTGzADv/315122-111';
// const size = 'M 12.5 / W 14';
// const user = "smurk59@gmail.com";
// const pass = "NiceOne23";

async function main(user, pass, cv2, size, url) {
    console.log('from app');
    let browser, page;

    try {
        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox']
        });
        page = await browser.newPage();
        await page.goto(url);
        let x = await addToBag(browser, page, size);
        while (!x) x = await addToBag(browser, page);
        await page.waitForFunction(() => document.querySelector("#nav-cart").innerText);
        await page.goto('https://www.nike.com/cart');
        await page.waitForXPath(`//button[contains(., '${goToCheckoutText}')]`)
        await page.goto('https://www.nike.com/checkout/tunnel');
        
        await page.waitForSelector('input[name="emailAddress"]');


        await page.type('input[name="emailAddress"]', user);
        let retryCount = 0 ;

        while(true){
            await page.type('input[name="password"]', pass, {delay: 150});
            await page.waitFor(2000);
            await page.evaluate(() => document.querySelector('.nike-unite-submit-button input').click());
            await page.waitFor(4000);
            //check if item is empty


            let isPassed = await page.evaluate(()=>{
                let txtPassword = document.querySelector('input[name="password"]');
                if(!txtPassword) return true;
                return txtPassword.innerText != '';
            })
            if(isPassed) break;


            if(++retryCount > 4) throw new Error("To many tries, please check it in 10 mins ")
             
        }

       
        try {
            await page.waitForXPath(`//button[contains(., 'OK')]`);

            await page.evaluate(() => {
                let elements = [...document.querySelectorAll('button')].find(element => element.textContent === 'OK');
                console.log(elements);
                elements.click();
            });


        } catch (ex2) {
            console.log(ex2);
        }

        await page.waitForXPath(`//button[contains(., 'Continue to Payment')]`);
        await page.evaluate(() => {
            [...document.querySelectorAll('button')].find(element => element.textContent === 'Continue to Payment').click();
        });
        await page.waitForTimeout(4000);
        page.frames().forEach(a => {
            console.log(a.url());
        });
        const frame = await page.frames().find(f => f.url().includes('paymentcc'));

        const cvNumber = await frame.$("#cvNumber");
        await cvNumber.type(cv2);

        await page.waitForXPath(`//button[contains(., 'Continue To Order Review')]`);

        await page.evaluate(() => {
            [...document.querySelectorAll('button')].find(element => element.textContent === 'Continue To Order Review').click();
        });



        await page.waitForXPath(`//button[contains(., 'Place Order')]`);
        await page.evaluate(() => {
            [...document.querySelectorAll('button')].find(element => element.textContent === 'Place Order').click();
        });
        await page.waitForTimeout(3000);
        if (page) await page.close();
        if (browser) await browser.close();
        return "done";

    } catch (ex) {
        console.log(ex);
        if (page) await page.close();
        if (browser) await browser.close();
    } finally {

    }
}

async function addToBag(browser, page, size) {
    try {
        const [sizeLable] = await page.$x(`//label[contains(., '${size}')]`);
        console.log("size");

        if (sizeLable) {
            await sizeLable.click(1000);
            console.log("helllooooooooo");
        }
        else {
            console.log('size not exists');
        }
        console.log("size");

        const [addToBag] = await page.$x(`//button[contains(., '${addToBagText}')]`);
        if (addToBag) {
            await addToBag.click();
        }
        console.log("size");

        return true;
    } catch (x) {
        console.log("size");
        console.log(x);
        return false;
    }

}

module.exports = main;