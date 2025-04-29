const puppeteer = require('puppeteer');

async function scrapeLMS() {
const browser = await puppeteer.launch({
headless: true,
args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const page = await browser.newPage();

const leagueUrls = [
"https://www.lastmanstands.com/leagues/standings/t20?leagueid=1534&seasonid=175&divisionid=3409",
"https://www.lastmanstands.com/leagues/standings/t20?leagueid=2374&seasonid=175&divisionid=0",
"https://www.lastmanstands.com/leagues/standings/t20?leagueid=3818&seasonid=175&divisionid=0",
"https://www.lastmanstands.com/leagues/standings/t20?leagueid=2793&seasonid=175&divisionid=0"
];

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const todayStr = `${dd}/${mm}/${yyyy}`;

let allMatchesToday = [];

for (const url of leagueUrls) {
console.log(`Scraping: ${url}`);
await page.goto(url, { waitUntil: 'networkidle2' });
await page.waitForTimeout(3000);

const matches = await page.$$eval('div.fixture-result', divs => {
return divs.map(div => {
const fixtureLink = div.querySelector('a[href*="fixtureid="]');
const textContent = div.innerText;
return {
href: fixtureLink ? fixtureLink.href : null,
text: textContent
};
});
});

for (const match of matches) {
if (match.href && match.text.includes(todayStr)) {
allMatchesToday.push(match.href);
}
}
}

if (allMatchesToday.length > 0) {
console.log(`\nMatches found for today (${todayStr}):`);
allMatchesToday.forEach(link => console.log(link));
} else {
console.log(`\nNo matches found for today (${todayStr}).`);
}

await browser.close();
}

scrapeLMS();