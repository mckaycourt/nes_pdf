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

exports.generatePDF = async (req, res) => {
    // need to get the url from the link
    const link = 'nes/7269'
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(`https://portal.ybashirts.com/${link}`, {
            waitUntil: 'networkidle0',
        });
        await page.type('#email', process.env.PUPPET_EMAIL);
        await page.type('#password', process.env.PUPPET_PASS);
        await page.click('#signIn', {
            waitUntil: 'networkidle0'
        })
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                page
                    .goto(`https://portal.ybashirts.com/${link}`, {
                        waitUntil: 'networkidle0',
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }, 2000);
        })
        await page.emulateMedia('screen');

        const pdf = await page.pdf({
            format: 'a4',
            landscape: true,
            printBackground: true,
        });

        res.send(pdf);
    } catch (err) {
        res.status(500).send(err);
    }
};