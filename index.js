/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
// exports.generatePDF = (req, res) => {
//     // let message = req.query.message || req.body.message || 'Hello World!';
//     let message = 'Hello World!';
//     res.status(200).send(message);
// };
const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'yba-shirts.appspot.com';
const bucket = storage.bucket(bucketName);

// exports.generatePDF = async (req, res) => {
//     // need to get the url from the link
//     const link = 'nes/7269'
//     try {
//         const browser = await puppeteer.launch({
//             headless: false,
//         });
//         console.log('browser');
//         const page = await browser.newPage();
//         console.log('page');
//         await page.setViewport({ width: 1920, height: 1080 });
//         console.log('viewport');
//         await page.goto(`https://portal.ybashirts.com`, {
//             waitUntil: 'networkidle0',
//         });
//         console.log('goto');
//         process.env.PUPPET_EMAIL
//         // change this to process.env.PUPPET_EMAIL and process.env.PUPPET_PASS
//         await page.type('#email', 'puppeteer@puppeteer.com');
//         console.log('email');
//         await page.type('#password', 'puppeteer');
//         console.log('password');
//         await page.click('#signIn', {
//             waitUntil: 'networkidle0'
//         })
//         console.log('signin');
//         await new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 page
//                     // .goto(`https://portal.ybashirts.com/${link}`, {
//                     .goto(`https://google.com`, {
//                         waitUntil: 'networkidle0',
//                     })
//                     .then(() => {
//                         resolve();
//                     })
//                     .catch((err) => {
//                         reject(err);
//                     });
//             }, 2000);
//         })
//         console.log('goto nes');
//         // await page.emulateMedia('screen');
//         // await page.emulateMedia('screen');
//         console.log('emulateMedia');
//         setTimeout(async () => {
//             const pdf = await page.pdf({
//               format: 'A4',
//               landscape: true,
//               printBackground: true,
//             });
//             console.log('pdfs', pdf);
//             // await browser.close();
//             res.send(pdf);
//           }, 2000);
//         // const pdf = await page.pdf({
//         //     format: 'a4',
//         //     landscape: true,
//         //     printBackground: true,
//         // });
//         // console.log('pdf', pdf);
//         // res.send(pdf);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send(err);
//     }
// };

// exports.generatePDF = async (req, res) => {
//     // need to get the url from the link
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.goto('https://google.com', {waitUntil: 'networkidle0'});
//   const pdf = await page.pdf({ format: 'A4' });
//   console.log('blablablablabal');
//   await browser.close();
//   res.send(pdf);
//   return pdf
// };

exports.generatePDF = async (req, res) => {
    console.log('Got Here');
    const { fileName } = req.body;
    const puppeteer = require('puppeteer');

    try {
        const browser = await puppeteer.launch({args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto("https://google.com", {waitUntil: 'networkidle0'});
        await page.emulateMedia('screen');
        const pdf = await page.pdf({
            format: 'A4',
            landscape: true,
            printBackground: true,
        });
        console.log(pdf);
        browser.close();
        const file = bucket.file(fileName);
        await file
            .createWriteStream()
            .on('error', (err) => {
                throw err;
            })
            .on('finish', async () => {
                console.log(`Created: ${fileName}`);
                await file.makePublic();
                res.send('Created NESPDF');
            })
            .end(pdf)
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err);
    }};
