const puppeteer = require('puppeteer');
const fs = require('fs');

// const url = 'https://pt.aliexpress.com/item/33044155956.html?gatewayAdapt=glo2bra';
const url = 'https://pt.aliexpress.com/?gatewayAdapt=glo2bra';

const searchFor = 'memoria ram ddr4 asgard';
const listLinks = [
    "https://pt.aliexpress.com/item/33044155956.html?gatewayAdapt=glo2bra",
    "https://pt.aliexpress.com/item/1005003102290875.html?gatewayAdapt=glo2bra",
    "https://pt.aliexpress.com/item/1005003561712140.html?gatewayAdapt=glo2bra",
];

const list = [];
let c = 1;
(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    await Promise.all([
        page.waitForNavigation(),
        page.click(".search-button")
    ])

    const links = await page.$$eval('.list--gallery--34TropR > a ', el => el.map(link => link.href));

    for (const link of listLinks) {
        console.log(' Go to ' + link);
        await page.goto(link);
        await page.waitForSelector('.product-title-text');
        const title = await page.$eval(".product-title-text", element => element.innerText);

        console.log('Title: ' + title);


        const precoNormal = await page.evaluate(() => {
            const el = document.querySelector('.product-price-value');
            if (!el) return null;
            return el.innerText;
        })

        precoNormal != null ? console.log('Preço Normal: ' + precoNormal) : null;

        const superOferta = await page.evaluate(() => {
            const el = document.querySelector('.uniform-banner-box-price');
            if (!el) return null;
            return el.innerText;
        })
        superOferta != null ? console.log('Super Oferta: ' + superOferta) : null;

        const cupomDaLoja = await page.evaluate(() => {
            const el = document.querySelector('.coupon-mark-store');
            if (!el) return null;
            return el.innerText;
        })

        // page.click(".coupon-mark-store")
        // await Promise.all([
        //     page.waitForNavigation(),
        //     page.click(".coupon-mark-store")
        // ])

        // const cupomVendedor = await page.evaluate(() => {
        //     const el = document.querySelector('_1WbP-');
        //     if (!el) return null;
        //     return el.innerText;
        // })


        let dateTime = getFormattedDateTime();
        const anuncioMemoria = {};
        anuncioMemoria.title = title;
        anuncioMemoria.link = link;
        (cupomDaLoja ? anuncioMemoria.cupomDaLoja = cupomDaLoja : "");
        // (cupomVendedor ? anuncioMemoria.cupomVendedor = cupomVendedor : "");
        (precoNormal ? anuncioMemoria.precoNormal = precoNormal : "");
        (superOferta ? anuncioMemoria.superOferta = superOferta : "");
        anuncioMemoria.horaPesquisa = dateTime;

        list.push(anuncioMemoria);

        await page.goto(link);

        c++;
    }

    console.log(list);

    await page.waitForTimeout(3000);
    await browser.close()


})();


function getFormattedDateTime() {
    // Cria um objeto Date com a data e hora atuais
    var now = new Date();

    // Obtem as informações da data e hora
    var day = now.getDate().toString().padStart(2, '0'); // dia com dois dígitos
    var month = (now.getMonth() + 1).toString().padStart(2, '0'); // mês com dois dígitos
    var year = now.getFullYear(); // ano com quatro dígitos
    var hour = now.getHours().toString().padStart(2, '0'); // hora com dois dígitos
    var minute = now.getMinutes().toString().padStart(2, '0'); // minuto com dois dígitos
    var second = now.getSeconds().toString().padStart(2, '0'); // segundo com dois dígitos

    // Formata a data e hora no formato desejado
    var dateTimeString = day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;

    return dateTimeString;
}
