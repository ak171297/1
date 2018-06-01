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

async function run(input){
    try {
        const browser=await puppeteer.launch({headless:false})
        const page=await browser.newPage();
        await page.goto('https://online.manappuram.com/')
        const searchsel='#expresspaypopup'
        const submit='#expresspay'
        await page.click(searchsel);
        await page.click('#pledgeno');
        await page.keyboard.type(input.pledgecard);
        await page.click(submit);
        await page.evaluate((a, b) => {
            document.querySelector('#txt_EmailID').value = a;
            document.querySelector('#txt_Phone').value = b;
    
          }, input.email, input.phonenumber);
        // await page.click('#txt_EmailID')
        // await page.keyboard.type(input.email)
        // await page.click('#txt_Phone')
        // await page.keyboard.type(input.phonenumber)

        await page.waitForNavigation();
        var paymode=input.mode;                                        
        if(paymode==="interest")
        {
            await page.click('#btn_payint')
        }
        if(paymode==="full")
        {
            await page.click('#btn_payfull')
        }
        if(paymode==="part")
        {
            await page.click('#txt_PartAmount')
            await page.keyboard.type(input.amount)
            await page.click('#btn_paypart')
        }
        else{
            console.log("enter valid payment method")
        }
        //const text=await page.evaluate(()=> {
          //  let title=document.querySelector('#result_1 > div > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1) > a > h2,#result_0 > div > div.a-row.a-spacing-none > div.a-row.a-spacing-mini > a > h2,#result_0 > div > div:nth-child(5) > div.a-row.a-spacing-none.sx-line-clamp-4 > a > h2,#result_0 > div > div > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1),#crwReviewRow1 > div.crwContentContainer > div.crwProductDetail > div.crwTitle > a,#result_0 > div > div:nth-child(5) > div:nth-child(1) > a > h2').innerText
            //return title
        //});
        //await page.click('#result_1 > div > div.a-fixed-left-grid > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1) > a > h2,#result_0 > div > div.a-row.a-spacing-none > div.a-row.a-spacing-mini > a > h2,#result_0 > div > div:nth-child(5) > div.a-row.a-spacing-none.sx-line-clamp-4 > a > h2,#result_0 > div > div > div > div.a-fixed-left-grid-col.a-col-right > div.a-row.a-spacing-small > div:nth-child(1),#crwReviewRow1 > div.crwContentContainer > div.crwProductDetail > div.crwTitle > a,#result_0 > div > div:nth-child(5) > div:nth-child(1) > a > h2')
        //const p = await page.evaluate(()=>{
          //  let title1=document.querySelector('span.a-size-base.a-color-price-s-price.a-text-bold').innerText
         //   console.log(title1)
           // return title1
        //});
        //browser.close();
        //let allinf = {
          //  name: text,
          // Price: p
       // }
        //return allinf;
    } catch (e) {
        console.log(e);
    }
}



// app.get('/api/search',(req,res)=>{
//     res.send(response)
// })
app.post('/manp',async (req,res)=>{
    const result = await run(req.body);
    return res.json({ result });
})
//app.put('/profile',(res,req)=>{
  //  Object.assign(profile,req.body)
    //console.log(profile)
    //res.sendStatus(204)
//})
app.listen(3000)

// run();