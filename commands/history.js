const _ = require('lodash');
const Discord = require('discord.js');
const logger = require('../utils/logger');

let description = ``;

/**
 * @param {number} id
 * @param {{ database: { db: { each: (arg0: string, arg1: any[], arg2: (error: any, row: any) => void) => void; }; }; }} botContext
 */
function getHistory(channel, id, botContext) {
    description += `**Moderation History**\n\n`;
    let sql = 'SELECT * FROM warnings WHERE client_id = ?';
    /**
     * @param {string} error
     * @param {{ reason: string; }} row
     */
    botContext.database.db.all(sql, [id], (error, rows) => {
        if (error) {
            logger.info(error);
        }
        rows.forEach((row) => {
            description += `**${row.user}**\n **-** ${row.reason}\n **-** ${row.timestamp}\n **-** By ${row.staffMembern}\n\n`;
        });
    });
    return new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
}

module.exports = {
    name: '!history',
    role: 'test',
    async execute({ message, botContext, args }) {
        if (_.size(args) > 0) {
            try {
                const id = parseInt(args[0]);
                await getHistory(message.channel, id, botContext);
                const embed = new Discord.RichEmbed()
                    .setAuthor('PSV Bot')
                    .setColor('#0099ff')
                    .setDescription(description)
                    .setTimestamp();
                message.channel.send(embed);
            } catch (error) {
                logger.info(error);
            }
        }
        else {
            message.channel.send(`**Usage**: !history id`);
        }
    },
};
