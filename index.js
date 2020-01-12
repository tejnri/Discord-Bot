const Discord = require('discord.js');
const logger = require('./logger');
const config = require('./config');
const MessageHandle = require("./MessageHandler");

// Initialize Discord Bot
const bot = new Discord.Client();
// Confirm the login
bot.on('ready', function () {
    logger.info('Connected!');
    logger.info(`Logged in as: ${bot.user.username}`);
});
// Handle the incoming msgs
bot.on('message', message => {
    MessageHandle.get(logger).handleMessage(message);
});
// Login into discord
bot.login(config('DISCORD_TOKEN'));