const TeleBot = require('node-telegram-bot-api');
const Token = '5822168156:AAG_hwjZimGyx91u9RoJVcc1aw9VSY8_EX4';

const bot = new TeleBot(Token, {  polling: true });

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `echo: ${msg.text}`);
});
