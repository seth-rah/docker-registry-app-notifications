const discord = require('discord.js');
const discordWebhookID = process.env.DISCORD_WEBHOOKID;
const discordWebhookToken = process.env.DISCORD_WEBHOOKTOKEN;

//Check if variables are in use.
if (typeof discordWebhookID === 'undefined') {
	console.log("To use Discord integration, please make sure you have DISCORD_WEBHOOKID set as an environment variable.");
}

if (typeof discordWebhookToken === 'undefined') {
	console.log("To use Discord integration, please make sure you have DISCORD_WEBHOOKTOKEN set as an environment variable.");
}

class discordClient {
	constructor() {
		this.discordConnect = new discord.WebhookClient(
			discordWebhookID,
			discordWebhookToken
		);
	}

	async send(event) {
		if (!discordWebhookID || !discordWebhookToken) {
			throw new Error('Discord environment incorrect! Skipping!');
		}

		const messageContents = new discord.MessageEmbed()
			.setTitle('NEW IMAGE')
			.setColor('#00C0FF')
			.addFields(
				{ name: 'Image', value: event.target.repository, inline: true },
				{ name: 'Tag', value: event.target.tag, inline: true },
				{ name: 'Host', value: event.request.host },
				{ name: 'Source', value: event.request.addr },
				{ name: 'Full Earl', value: [event.request.host + "/" + event.target.repository + ":" + event.target.tag] }
			);

		await this.discordConnect.send('Live registry image:', {
			username: 'EeziBot',
			embeds: [messageContents],
		});
	}

	async sendError(e) {
		await this.send(`Error: ${e}`);
	}
}

module.exports = new discordClient();
