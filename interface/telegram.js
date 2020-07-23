const telegram = require('telegraf/telegram');
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChat = process.env.TELEGRAM_CHAT_ID;

//Check if variables are in use.
if (typeof telegramToken === 'undefined'){
	console.log("To use Telegram integration, please make sure you have TELEGRAM_BOT_TOKEN set as an environment variable.");
}

if (typeof telegramChat === 'undefined'){
	console.log("To use Telegram integration, please make sure you have TELEGRAM_CHAT_ID set as an environment variable.");
}

class telegramClient {
	constructor(defaults) {
		this.telegram = new telegram(telegramToken, defaults);
	}

	send(message) {
		if (typeof telegramToken !== 'undefined' && typeof telegramChat !== 'undefined'){
			const obj = JSON.parse(message);
			//telegram parses newlines, so code formatting is cleaner this way.
			const messageContents =	`<b>NEW IMAGE</b>: ${obj.target.repository} \n\n<b>Tag</b>: ${obj.target.tag} \n<b>Host</b>: ${obj.request.host} \n<b>Source</b>: ${obj.request.addr} \n<b>Full Earl</b>: ${obj.request.host}/${obj.target.repository}:${obj.target.tag}`;
			this.telegram.sendMessage(telegramChat,	messageContents, {parse_mode: 'HTML'});
		}
	}

	async sendError(e) {
		await this.send(`Error: ${e}`);
	}
}

module.exports = telegramClient;
