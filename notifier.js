const express = require('express');

const app = express();
const port = process.env.PORT || 1337;

// Register all available notification handlers.
const handlers = {
	telegram: require('./interface/telegram'),
	discord: require('./interface/discord') 
};

// Parse JSON request bodies.
app.use(express.json());

// POST endpoint for /docker.
app.post('/docker', async (req, res, next) => {
	// Check that the body is there.
	if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
		return res.status(400).end();
	}

	// Attempt to handle the event.
	try {
		await handleEvent(req.body);
		return res.status(200).end();
	} catch (error) {
		next(error);
	}
});

// Default error handler.
app.use(async (err, req, res, next) => {
	console.error(err);
	await handlers.telegram.sendError(err);
	res.status(500).json({ error: err.message });
});

// Start listening.
app.listen(port, () => {
	console.log(`Notification handler listening on port ${port}`);
});

// Handles a docker event that was posted to /docker.
async function handleEvent(event) {
	if (event.target.tag) {
		console.log(`Handling ${event.action} event ${event.id}!`);

		for (handler in handlers) {
			console.log(`Firing ${handler} handler!`);

			try {
				await handlers[handler].send(event);
			} catch (error) {
				console.error(error.message);
			}
		}
	}
}
