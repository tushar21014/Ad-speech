const express = require('express');
const app = express();
const port = process.env.PORT || 3004;
const player = require("play-sound")();
const cors = require('cors');   
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to Web Ad-Scraping-to-Speech API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const puppeteer = require('puppeteer');
const googleTTS = require('google-tts-api');

app.get('/scrape-and-speak', async (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({ error: 'Missing keyword parameter' });
    }

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Navigate to Google and perform a search
        await page.goto(`https://www.google.com/search?q=${keyword}`);

        // Extract the first shopping ad's text
        const adText = await page.evaluate(() => {
            const adElement = document.querySelector('.vYe7gd Havxif, .njFjte, .vYe7gd, .Havxif, .GJfQob');
            const adText = adElement ? adElement.innerText : 'No shopping ad found for this keyword';

            return adText;
        });

        const imageURL = await page.evaluate(() => {
            const imageElement = document.querySelector('.FsH7wb , .wtYWhc, .zr758c');
            const imageURL = imageElement ? imageElement.getAttribute('src') : null;

            return imageURL;
        });

        const adPrice = await page.evaluate(() => {
            const adPrice = document.querySelector('.z235y, .s1bFpb');
            const adText = adPrice ? adPrice.innerText : 'No shopping ad found for this keyword';

            return adText;
        });

        // Close the browser
        await browser.close();

        if (adText === 'No shopping ad found for this keyword') {
            return res.status(404).json({ error: 'No shopping ad found for this keyword' });
        }

        // Convert ad text to speech using google-tts-api
        // const audioURL = googleTTS.tts(`${keyword}. ${adText}`, 'en', 1);
        // googleTTS("Hello world", "en",1).then(url => mpvPlayer.load(url));
        const audioURL = googleTTS.getAudioUrl(`${adText}`, "en", 1);
        // console.log(audioURL)
        // mpvPlayer.load(audioURL).play();

        res.json({ keyword, adText, audioURL,imageURL,adPrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while scraping and converting to speech' });
    }
});

// Other routes and middleware can be added as needed