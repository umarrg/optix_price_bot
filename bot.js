const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
const port = 4000;
const axios = require('axios');
const token = "6656307885:AAHdMnmzYnyVs9Cs4UgIGBm2vM0YvMxoD5c";
const bot = new TelegramBot(token, { polling: true });

app.get('/', (req, res) => {
    res.send('Hello, this is Scanner Bot');
});

const commands = [
    { command: '/track', description: 'get price' },

];
bot.setMyCommands(commands);
bot.onText(/\/track (.+)/, async (msg, match) => {


    const chatId = msg.chat.id;
    const resp = match[1];
    let name = await getCryptoName(resp)
    let price = await getCryptoPrice(name);
    bot.sendMessage(chatId, price);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const text = `Presenting the Optix Price Bot, your tool for staying informed about the most recent cryptocurrency prices using a straightforward command.

🔍 How to Utilize:
Input /track to retrieve the current price of any cryptocurrency.

For further details, check out:

Advertisement: @ShibaArchives

Collaboration Opportunities: @ShibaArchives

Find us on: 
Telegram: @OptixToken
Website: optixtoken.com
Twitter: https://x.com/OptixToken`;

    bot.sendMessage(chatId, text);
});

async function getCryptoName(symbol) {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${symbol}`, {

        });


        if (response.data.coins.length > 0) {
            const cryptoData = response.data.coins[0].id;
            return cryptoData;
        } else {
            console.log(`Cryptocurrency with symbol ${symbol} not found`);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

async function getCryptoPrice(symbol) {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${symbol}`;
    try {
        const response = await axios.get(apiUrl);
        if (response.data && response.data[0].current_price && response.data[0].price_change_percentage_24h) {
            console.log(response.data[0].current_price);
            const price = "$" + response.data[0].current_price;
            return price;

        }

    } catch (error) {
        console.error(`Error fetching data: ${error.message}`);
        return error.message;

    }
}
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});