const express = require('express')
const app=express()
const bodyParser=require('body-parser')
const puppeteer=require('puppeteer')
app.use(bodyParser.json())
// const response={
//     cat1:'mobile phones'
//     ,text1:'moto G'
// }
// let category=process.argv[2];

async function run(category){
    try {
        const browser=await puppeteer.launch({headless:false})
        const page=await browser.newPage();
        await page.goto('https://amazon.in')
        const searchsel='#twotabsearchtextbox'
        const submit='#nav-search > form > div.nav-right > div > input'
        await page.click(searchsel);
        await page.keyboard.type(category);
        await page.click(submit);
        await page.waitForNavigation();                                        
        
        const text=await page.evaluate(()=> {
            let title=document.querySelector('#result_1 > div > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1) > a > h2,#result_0 > div > div.a-row.a-spacing-none > div.a-row.a-spacing-mini > a > h2,#result_0 > div > div:nth-child(5) > div.a-row.a-spacing-none.sx-line-clamp-4 > a > h2,#result_0 > div > div > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1),#crwReviewRow1 > div.crwContentContainer > div.crwProductDetail > div.crwTitle > a,#result_0 > div > div:nth-child(5) > div:nth-child(1) > a > h2').innerText
            return title
        });
        //await page.click('#result_1 > div > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1) > a > h2,#result_0 > div > div.a-row.a-spacing-none > div.a-row.a-spacing-mini > a > h2,#result_0 > div > div:nth-child(5) > div.a-row.a-spacing-none.sx-line-clamp-4 > a > h2,#result_0 > div > div > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1),#crwReviewRow1 > div.crwContentContainer > div.crwProductDetail > div.crwTitle > a,#result_0 > div > div:nth-child(5) > div:nth-child(1) > a > h2')
        const p = await page.evaluate(()=>{
            let title1=document.querySelector('span.a-size-base.a-color-price-s-price.a-text-bold').innerText
            console.log(title1)
            return title1
        });
        browser.close();
        let allinf = {
            name: text,
           Price: p
        }
        return allinf;
    } catch (e) {
        console.log(e);
    }
}



// app.get('/api/search',(req,res)=>{
//     res.send(response)
// })
app.post('/api/search',async (req,res)=>{
    const result = await run(req.body.search);
    return res.json({ result });
})
//app.put('/profile',(res,req)=>{
  //  Object.assign(profile,req.body)
    //console.log(profile)
    //res.sendStatus(204)
//})
app.listen(8081)

// run();