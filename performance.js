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
    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    await browser.close();

    res.render('results', { url, performanceTiming });
});

app.listen(3000, () => console.log('Server is running on port 3000'));