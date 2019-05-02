const puppeteer = require('puppeteer');
var jogadores = [];
const dados = require('./dados/dados');
const { parse } = require('json2csv');
const fs = require('fs');

const paginas = ['https://cartolafc.globo.com/#!/time/cartola-lucianojp', 'https://cartolafc.globo.com/#!/time/cartoloukos-2019']    

 let scrape = async () => {
    for(var i = 0; i < paginas.length; i++){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    

    await page.goto('https://login.globo.com/login/438?url=https://cartolafc.globo.com', { awaitUntil: 'networkidle0'})
    await page.type('#login', dados.user);
    await page.type('#password', dados.password);
     
    await Promise.all([
        page.keyboard.press(String.fromCharCode(13)),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);
    
        
    await page.goto(paginas[i], {
        waitUntil: 'load'
    });
    const result = await page.evaluate(() => {
        let jogador = {};
        jogador.nome = document.querySelector('h1.cartola-time-adv__nome').innerText;
        jogador.pontuacao = document.getElementsByClassName("cartola-time-adv__pontuacao")[0].textContent;
        
        console.log(jogador)
        return jogador;
    });
   jogadores.push(result);
   browser.close();
}
    let json = JSON.stringify(jogadores);
    return json;

};

scrape().then((value) => {
        console.log(value);
        const fields = ['nome', 'pontuacao'];
        const opt = { fields };
        let json =  JSON.parse(value);
        const csv = parse(json, opt);
        
        fs.writeFile("times.csv", csv, function (err) {
            if (err) throw err;

            console.log('Saved!');
          });
    });  