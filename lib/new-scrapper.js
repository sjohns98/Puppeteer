const puppeteer = require('puppeteer');
// const puppeteerExtra = require('puppeteer-extra');
// const pluginStealth = require('puppeteer-extra-plugin-stealth');
// puppeteerExtra.use(pluginStealth());

const fs = require('fs');
const addToBagText = 'Add to Bag';
const goToPaymentPageText = 'Ödeme Sayfasına Git';
const payWithLoginText = 'Member Checkout';
const goToCheckoutText = 'Checkout';
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
            args: ['--no-sandbox', '--window-size=1920,1080'],
            dumpio: true
        });

        console.log((await browser.userAgent()));
        const userAgent = (await browser.userAgent()).replace('HeadlessChrome', 'Chrome')
        page = await browser.newPage();


        await page.setUserAgent(userAgent);
        await page.goto(url);
        let x = await addToBag(browser, page, size);
        while (!x) x = await addToBag(browser, page);
        await page.waitForFunction(() => document.querySelector("#nav-cart").innerText);

        await page.evaluate(() => document.querySelector("#nav-cart a").click() );
        

        // await page.waitForXPath(`//button[contains(., '${goToCheckoutText}')]`)
        // await page.waitForTimeout(2000);
        await page.goto('https://www.nike.com/checkout/tunnel');

        await page.waitForSelector('input[name="emailAddress"]');
        await page.type('input[name="emailAddress"]', user);
        let retryCount = 0 ;

        while(true){
            await page.type('input[name="password"]', pass, {delay: 150});
            await page.waitForTimeout(2000);

            await page.click('[value="MEMBER CHECKOUT"]', {delay: 150});
            await page.waitForTimeout(4000);
            let isPassed = await page.evaluate(()=>{
                let txtPassword = document.querySelector('input[name="password"]');
                if(!txtPassword) return true;
                return txtPassword.value != '';
            });
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

        const elementHandle = await page.$(
            'iframe[src*=paymentcc]',
        );
        const frame = await elementHandle.contentFrame();

        const cvNumber = await frame.$("#cvNumber");
        await cvNumber.type(cv2);

        // continueToOrderReviewBtn
        // data-attr

        await page.waitForTimeout(2000);
        // await page.click('button[data-attr="continueToOrderReviewBtn"]');
        // await page.type('input[name="emailAddress"]', user);


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
        console.log("done, closing browser");
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
        console.log("slecting the size");

        if (sizeLable) {
            await sizeLable.click(1000);
        }
        else {
            throw new Error("size not exist");
        }

        await page.screenshot({path: 'reuslt.png'});

        ///scroll item in view
        await page.evaluate( (addToBagText) => {
            // let items = [...document.querySelectorAll('button')];
            // items.forEach(i => console.log(i.textContent));
            let addToBagButton = [...document.querySelectorAll('button')].find(element => element.textContent.includes('Add to Bag'));
            addToBagButton.scrollIntoView();
            addToBagButton.click();

        }, addToBagText );
        // const [addToBag] = await page.$x(`//button[contains(., '${addToBagText}')]`);
        // if (addToBag) {
        //     await addToBag.click();
        // }
        return true;
    } catch (x) {
        console.log(x);
        await page.waitForTimeout(100000);
        throw new Error(x.message);
    }

}

module.exports = main;