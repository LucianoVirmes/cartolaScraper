const puppeteer = require('puppeteer');

let scrape = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    const dados = require('./dados/dados');

    await page.goto('https://login.globo.com/login/438?url=https://cartolafc.globo.com', { awaitUntil: 'networkidle0'})
    await page.type('#login', dados.user);
    await page.type('#password', dados.password);
    await Promise.all([
        page.keyboard.press(String.fromCharCode(13)),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    await page.goto('https://cartolafc.globo.com/#!/time/cartoloukos-2019');
    const result = await page.evaluate(() => {
        let nomeEquipe = document.querySelector('h1.cartola-time-adv__nome').innerText;
        let pontuacao = document.getElementsByClassName("cartola-time-adv__pontuacao")[0].textContent;
        console.log(nomeEquipe);
        console.log(pontuacao);
        return {
            title
        }
    });

    browser.close();
    return result;
};

scrape().then((value) => {
    console.log(value); // Success!
});