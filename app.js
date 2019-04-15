const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const nodemailer = require("nodemailer");

// Rutas
const IndexRouter = require('./routes/index');


app.set('view engine', 'ejs');
app.use(IndexRouter);

//printPDF();
//

async function printPDF() {
    const fecha = new Date().toISOString().slice(0, 10);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ path: `Monitoreos/Monitoreo_${fecha}.pdf`, format: 'A4' });

    await browser.close();
    //main(`Monitoreos/Monitoreo_${fecha}.pdf`, `Monitoreo_${fecha}.pdf`).catch(console.error);
};

async function main(att, name) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: null,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "testdbnetenvio", // generated ethereal user
            pass: "Ealym221-" // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: "amoyach@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
        attachments: [
            {   // file on disk as an attachment
                filename: name,
                path: att // stream this file
            }
        ]
        
    });
}






app.listen(5000, () => console.log("Working on localhost:5000"));