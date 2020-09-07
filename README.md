## What is this?

This is a hobby project to monitor new incoming images for a private docker repository by creating a listener that the registry can push notifications towards.

## How to Run

Multiple -e entries for various environments. environment variables listed further down.

```
docker run -d -e VARIABLE1=secret2 -e VARIABLE2=secret2 sethrah/dockerregistrynotifications
```

### Docker Compose
For fast setup, download the docker-compose.yml file and use docker-compose to manage the container a bit easier.

```
curl -o https://raw.githubusercontent.com/seth-rah/docker-registry-app-notifications/master/docker-compose.yml
```

Relpace environment variables as needed and run `docker-compose up -d` once completed.

## Environment Variables
### Telegram

[Set up a telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot) and get the `Bot Token`. Then add the bot to a group, make it admin and [extract the Chat ID](https://stackoverflow.com/a/32572159/882223).

```
Telegram Bot Token              = TELEGRAM_BOT_TOKEN
Telegram Chat ID                = TELEGRAM_CHAT_ID
```

### Discord
[Set up a channel webhook](https://github.com/Akizo96/de.isekaidev.discord.wbbBridge/wiki/How-to-get-Webhook-ID-&-Token). Extract the webhook ID and webhook token.

```
Discord webhook ID              = DISCORD_WEBHOOKID 
Discord Webhook token           = DISCORD_WEBHOOKTOKEN 
```

## Requirements
### Registry
The obvious requirement will be the service that we're monitoring, our private docker registry. Without a privately hosted docker registry, you won't have anything to monitor to push updates for. 

If you're looking to monitor the docker events on a server, to send messages to telegram, please look in the credits at the bottom to find the initial inspiration for this project.

[How to set up your docker registry so that it posts new events to a listener.](https://docs.docker.com/registry/notifications/) 

Your URL will look something like this once set up. 

https://server.running.this.project:1337/docker 

`1337` can be replaced with the port that you opened for the listener.

Be sure to append the /docker to the end of the URL, as it's expected.

Please ensure that there is sufficient time on the "timeout" for the endpoint on the registry.

### Network
The internal port `1337` needs to be mapped out of the container for the docker registry to have an endpoint to send notifications towards. At default the docker-compose file will open this on `1337`.

The network will be set to a bridged network mode for the container to have internet access, otherwise it won't be able to reach the endpoints you wish to receive notifications on.

## Plans

Additional application support. (slack planned)

Standardize adding additional interfaces to be simple drop in solutions.

## Contribution

Please let me know an issue or pull request.

## Credit

Initial repository that I butchered for my own purposes can be found [here](https://github.com/arefaslani/docker-telegram-notifier.git).

