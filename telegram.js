const {promisify} = require('util');
const Telegram = require('telegraf/telegram');
const tgtoken = process.env.TELEGRAM_NOTIFIER_BOT_TOKEN;
const tgchat = process.env.TELEGRAM_NOTIFIER_CHAT_ID;

class TelegramClient {
  constructor(defaults) {
    this.telegram = new Telegram(tgtoken,
                                  defaults);
  }

  send(message) {
    this.telegram.sendMessage(
      tgchat,
      message,
      { parse_mode: 'HTML' }
    );
  }

  async sendError(e) {
    await this.send(`Error: ${e}`);
  }
}

module.exports = TelegramClient;
module.exports.tgtoken = tgtoken;
module.exports.tgchat = tgchat;
