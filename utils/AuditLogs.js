// @ts-check
const Discord = require('discord.js');

class AuditLogs {
    /**
     * @param {import("../../../../Code/PSV/PSV.Bot/src/BotContext")} botContext
     */
    constructor(botContext) {
        this.botContext = botContext;
    }

    /**
     * @param {string} type
     * @param {string} message
     */
    async log(type, message) {
        const embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setAuthor('PSV Bot')
            .setTitle(type == null ? null : type)
            .setDescription(`${message}`)
            .setTimestamp();
        await this.botContext.logChannel.send(embed);
    }
}
module.exports = AuditLogs;
