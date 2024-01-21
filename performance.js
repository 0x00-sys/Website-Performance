const axios = require('axios');
const now = require('performance-now');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const measurePerformance = async (url) => {
    try {
        const start = now();
        await axios.get(`https://${url}`);
        const end = now();
        const duration = (end - start).toFixed(3);
        console.log(`Time taken to load ${url}: ${duration}ms`);
    } catch (error) {
        console.error(`Error loading ${url}: ${error.message}`);
    }
}

rl.question('Please enter a domain: ', (url) => {
    measurePerformance(url);
    rl.close();
});