const express = require('express') //for http server and post request
const app=express()                     
const bodyParser=require('body-parser') //to parse any body 
const puppeteer=require('puppeteer')    //to use headless browser
app.use(bodyParser.json())

async function run(input){
    try {
        const browser=await puppeteer.launch({headless:false}) //opens up a browser
        const page=await browser.newPage();                    //for new page
        await page.goto('https://online.manappuram.com/')      //go to manappuram payment portal
        const searchsel='#expresspaypopup'                     //click on express pay 
        await page.click(searchsel);                             
        await page.click('#pledgeno');                         //click on plegde card number tab
        await page.keyboard.type(input.pledgecard);            //types pledge card
    
        await Promise.all([                                    //clicks on express pay option 
            page.click('#expresspay'),
            page.waitForNavigation(),
          ]);
          await page.click('#txt_EmailID')                     //clicks on email tab 
          await page.keyboard.type(input.email)                //types email
          await page.click('#txt_Phone')                       //clicks on phone number tab
          await page.keyboard.type(input.phonenumber)          //types phone number 
          
        const paymode=input.mode;   
        if(paymode=='interest','full','part'){                 //checks the payment mode                             
          if(paymode=='interest')             
          {
            await page.click('#btn_payint')
            console.log('a')
    
          }
          if(paymode=='full')
           {
             await page.click('#btn_payfull')
             console.log('b')
           }
          if(paymode=='part')
           {
             await page.click('#txt_PartAmount')
             await page.keyboard.type(input.amount)
             await page.click('#btn_paypart')
           }
         }
         else{
             console.log("enter valid payment method")
        }
        page.waitForNavigation()
     } catch (e) {
        console.log(error);
       }
}

app.post('/manp',async (req,res)=>{
    const result = await run(req.body);
    return res.json({ result });
})
app.listen(3000)

