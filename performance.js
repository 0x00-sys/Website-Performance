const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/measure', async (req, res) => {
    const url = req.query.url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://${url}`);
    let performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    await browser.close();

    // Ensure all necessary properties are present
    const requiredProperties = ['navigationStart', 'responseStart', 'responseEnd', 'domComplete'];
    for (const prop of requiredProperties) {
        if (!performanceTiming.hasOwnProperty(prop)) {
            performanceTiming[prop] = 0;
        }
    }

    // Calculate relative times
    const navigationStart = performanceTiming.navigationStart;
    performanceTiming = {
        navigationStart: 0,
        responseStart: performanceTiming.responseStart - navigationStart,
        responseEnd: performanceTiming.responseEnd - navigationStart,
        domComplete: performanceTiming.domComplete - navigationStart
    };

    res.render('results', { url, performanceTiming });
});

app.listen(3000, () => console.log('Server is running on port 3000'));