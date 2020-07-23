const telegram = require('telegraf/telegram');
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChat = process.env.TELEGRAM_CHAT_ID;

//Check if variables are in use.
if (typeof telegramToken === 'undefined') {
	console.log("To use Telegram integration, please make sure you have TELEGRAM_BOT_TOKEN set as an environment variable.");
}

if (typeof telegramChat === 'undefined') {
	console.log("To use Telegram integration, please make sure you have TELEGRAM_CHAT_ID set as an environment variable.");
}

class telegramClient {
	constructor(defaults) {
		this.telegram = new telegram(telegramToken, defaults);
	}

	async send(event) {
		if (!telegramToken || !telegramChat) {
			throw new Error('Telegram environment incorrect! Skipping!');
		}

		const message = [
			`<b>NEW IMAGE</b>: ${event.target.repository} \n\n`,
			`<b>Tag</b>: ${event.target.tag} \n`,
			`<b>Host</b>: ${event.request.host} \n`,
			`<b>Source</b>: ${event.request.addr} \n`,
			`<b>Full Earl</b>: ${event.request.host}/${event.target.repository}:${event.target.tag}`
		].join('');

		await this.telegram.sendMessage(
			telegramChat,
			message,
			{ parse_mode: 'HTML' }
		);
	}

	async sendError(e) {
		try {
			await this.send(`Error: ${e}`);
		} catch (error) {
			console.error(error);
		}
	}
}

module.exports = new telegramClient();
