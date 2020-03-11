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
            description += `**${row.type}** - **${row.user}**\n **-** ${row.reason}\n **-** ${row.timestamp}\n **-** By ${row.staffMember}\n\n`;
        });
    });

    sql = 'SELECT * FROM kicks WHERE client_id = ?';

    botContext.database.db.all(sql, [id], (error, rows) => {
        if (error) {
            logger.info(error);
        }
        rows.forEach((row) => {
            description += `**${row.type}** - **${row.user}**\n **-** ${row.reason}\n **-** ${row.timestamp}\n **-** By ${row.staffMember}\n\n`;
        });
    });

    sql = 'SELECT * FROM bans WHERE client_id = ?';

    botContext.database.db.all(sql, [id], (error, rows) => {
        if (error) {
            logger.info(error);
        }
        rows.forEach((row) => {
            description += `**${row.type}** - **${row.user}**\n **-** ${row.reason}\n **-** ${row.timestamp}\n **-** By ${row.staffMember}\n\n`;
        });
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 10);
    });
}

module.exports = {
    name: '!history',
    role: 'Staff Team',
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
                description = ``;
            } catch (error) {
                logger.info(error);
            }
        } else {
            message.channel.send(`**Usage**: !history id`);
        }
    },
};
