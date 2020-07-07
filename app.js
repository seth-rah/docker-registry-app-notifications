const TelegramClient = require('./telegram');
const templates = require('./templates');
const express = require('express');
const bodyParser = require("body-parser");
const imageRegExp = new RegExp(process.env.image_regexp);
const telegram = new TelegramClient();
const app = express();

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

async function sendEvent(event) {
	if (imageRegExp.test(event.from)) {
		const template = templates[`${event.events[0].request.method}_${event.events[0].action}`];
		if (template) {
			console.log("Valid event received");
			const attachment = template(event);
			await telegram.send(attachment)
		}
	}
}

async function sendEventStream() {
	console.log("send event stream called");
	const eventStream = await app.post('/docker', function(req, res) {
		res.header('Content-type', 'text/html');
		res.sendStatus(200);
		req.on('data', function(data) {
			try {
				sendEvent(JSON.parse(data.toString('utf8')));
			} catch (e) {
				handleError(e);
			}
		});
	});
}

async function main() {
	console.log("main called");
	await sendEventStream();
}

function handleError(e) {
	console.log("handle error called");
	console.error(e);
	telegram.sendError(e).catch(console.error);
}

const PORT = process.env.PORT || 1337

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`)
})

main().catch(handleError);
