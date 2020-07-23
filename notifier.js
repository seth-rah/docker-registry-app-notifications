const telegramClient = require('./interface/telegram');
const discordClient = require('./interface/discord');
const templates = require('./templates');

const express = require('express');
const bodyParser = require("body-parser");

const listener = express();
const telegram = new telegramClient();
const discord = new discordClient();

//OPEN LISTENER PORT
listener.listen(1337, () => {
	console.log(`Listener started on port 1337 internally`)
})

//CONFIGURE LISTENER
listener.use(bodyParser.urlencoded({
	extended: true
}));

listener.use(bodyParser.json());

//GENERIC ERROR HANDLER
function handleError(e) {
	console.log("handle error called");
	console.error(e);
	telegram.sendError(e).catch(console.error);
}

//START APPLICATION
async function main() {
	await sendEventStream();
}

//AWAITS NEW MESSAGES ON THE LISTENER
async function sendEventStream() {
	const eventStream = await listener.post('/docker', function(req, res) {
		res.header('Content-type', 'text/html');
		res.sendStatus(200);
		req.on('data', function(data) {
			try {
				sendEvent(JSON.parse(data.toString('utf8')));
			} catch (e) {
				console.log("failed to parse: " + data.toString('utf8'))
				handleError(e);
			}
		});
	});
}

//HANDLES MESSAGES RECEIVED BY THE LISTENER AND SENDS THEM TO THE DEFINED INTERFACES
async function sendEvent(event) {
	if('tag' in event.events[0].target){

		//SET TEMPLATE BASED ON METHOD AND ACTION RECEIVED
		//COULD BE USEFUL AT A LATER STAGE WHEN MULTIPLE DIFFERENT EVENT TYPES SHOULD BE MONITORED
		const template = templates[`${event.events[0].request.method}_${event.events[0].action}`];

		//CHECK IF TEMPLATE CONDITIONS ARE MET
		if (template) {
			console.log("Valid event received");
			const attachment = template(event);

			//TELEGRAM
			try{
				await telegram.send(attachment)
			} catch (e) {
				handleError(e);
			}

			//DISCORD
			try{
				await discord.send(attachment)
			} catch (e) {
				handleError(e);
			}
		}
	}
}

main().catch(handleError);
