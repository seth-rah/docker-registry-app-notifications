const discord = require('discord.js');
const discordWebhookID = process.env.DISCORD_WEBHOOKID;
const discordWebhookToken = process.env.DISCORD_WEBHOOKTOKEN;

//Check if variables are in use.
if (typeof discordWebhookID === 'undefined'){
	console.log("To use Discord integration, please make sure you have DISCORD_WEBHOOKID set as an environment variable.");
}

if (typeof discordWebhookToken === 'undefined'){
	console.log("To use Discord integration, please make sure you have DISCORD_WEBHOOKTOKEN set as an environment variable.");
}

class discordClient {
	constructor(defaults) {
		this.discordConnect = new discord.WebhookClient(discordWebhookID, discordWebhookToken);
	}

	send(message) {
		if (typeof discordWebhookID !== 'undefined' && typeof discordWebhookToken !== 'undefined'){
			const obj = JSON.parse(message);
			const messageContents =	new discord.MessageEmbed()
				.setTitle('NEW IMAGE')
				.setColor('#00C0FF')
				.addFields(
					{name:'Image', value: obj.target.repository, inline: true},
					{name:'Tag', value: obj.target.tag, inline: true},
					{name:'Host', value: obj.request.host},
					{name:'Source', value: obj.request.addr},
					{name:'Full Earl', value: [obj.request.host + "/" + obj.target.repository + ":" + obj.target.tag]}
				);
			try{
				this.discordConnect.send('Live registry image:', {
					username: 'EeziBot',
					embeds: [messageContents],
				});
			}
			catch (e) {
				handleErrorNotify(e);
			}
		}
	}

	async sendError(e) {
		await this.send(`Error: ${e}`);
	}
}

module.exports = discordClient;
