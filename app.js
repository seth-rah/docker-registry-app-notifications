const Discord = require('discord.js');
const WebhookID = process.env.WEBHOOKID;
const WebhookToken = process.env.WEBHOOKTOKEN;
const TelegramClient = require('./telegram');
const templates = require('./templates');
const express = require('express');
const bodyParser = require("body-parser");
const imageRegExp = new RegExp(process.env.image_regexp);
const telegram = new TelegramClient();
const discordClient = new Discord.WebhookClient(WebhookID, WebhookToken);
const app = express();

app.use(bodyParser.urlencoded({
        extended: true
}));

app.use(bodyParser.json());

async function sendEvent(event) {
        if (imageRegExp.test(event.from)) {
                if('tag' in event.events[0].target){
                        console.log(event.events[0].target.tag);
                        const template = templates[`${event.events[0].request.method}_${event.events[0].action}`];
                        if (template) {
                                console.log("Valid event received");
                                const attachment = template(event);
                if (typeof TelegramClient.tgtoken !== 'undefined' && TelegramClient.tgtoken !== 'undefined'){
                    try{
                        await telegram.send(attachment)
                    } catch (e) {
                        handleErrorNotify(e);
                    }
                }
                if (typeof WebhookID !== 'undefined' && WebhookToken !== 'undefined'){
                        var embed = new Discord.MessageEmbed()
                        .setTitle('NEW IMAGE')
                        .setColor('#00C0FF')
                        .addFields(
                                    {name:'Image', value: event.events[0].target.repository, inline: true},
                                    {name:'Tag', value: event.events[0].target.tag, inline: true},
                                    {name:'Host', value: event.events[0].request.host},
                                    {name:'Source', value: event.events[0].request.addr},
                                    {name:'Entire Earl', value: [event.events[0].request.host + "/" + event.events[0].target.repository + ":" + event.events[0].target.tag]}
                                    );
                    try{
                        await discordClient.send('Live registry image:', {
                        username: 'EeziBot',
                        embeds: [embed],
                        });
                    }
                    catch (e) {
                        handleErrorNotify(e);
                    }
                }
                        }
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
        console.log("handle error called, parsed invalid JSON from registry");
        console.error(e);
}

function handleErrorNotify(e) {
        console.log("handle error called, telegram notification sent out.");
        console.error(e);
        telegram.sendError(e).catch(console.error);
}

const PORT = process.env.PORT || 1337

app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`)
})

main().catch(handleError);
main().catch(handleErrorNotify);
