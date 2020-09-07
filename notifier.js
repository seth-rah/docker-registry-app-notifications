const express = require('express');

const app = express();
const port = process.env.PORT || 1337;

// Register all available notification handlers.
const handlers = {
	telegram: require('./interface/telegram'),
	discord: require('./interface/discord')
};

// Parse JSON request bodies.
app.use(express.json({
	type: 'application/vnd.docker.distribution.events.v1+json'
}));


// POST endpoint for /docker.
app.post('/docker', async (req, res, next) => {
	const events = req.body.events;

	// Check the body for validity.
	if (!events || events.constructor === Object && Object.keys(events).length === 0) {
		return res.status(400).end();
	}

        // Send response first, docker registry could be set as being impatient.
        res.header('Content-type', 'text/html');
        res.sendStatus(200);

	try {
		// Attempt to handle the event array.
		for (event of events) {
			await handleEvent(event);
		}
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

/**
 * Handles an incoming docker event.
 * 
 * @param {object} event 
 * @returns {Promise<void>}
 */
async function handleEvent(event) {
	if (event.target.tag && canHandleEvent(event)) {
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

/**
 * Returns whether an event can be handled based on its method and action.
 * 
 * @param {object} event
 * @returns {boolean}
 */
function canHandleEvent(event) {
	return [
		'PUT_push'
	].includes(`${event.request.method}_${event.action}`);
}
