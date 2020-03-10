// @ts-check
const _ = require('lodash');
const Discord = require('discord.js');
const logger = require('../utils/logger');

/**
 * @param {number} id
 * @param {{ database: { db: { each: (arg0: string, arg1: any[], arg2: (error: any, row: any) => void) => void; }; }; }} botContext
 */
function getHistory(id, botContext) {
    let description = ``;
    let sql = 'SELECT * FROM warnings WHERE id = ?';
    /**
     * @param {string} error
     * @param {{ reason: string; }} row
     */
    botContext.database.db.each(sql, [id], (error, row) => {
        if (error) {
            logger.info(error);
        }
        logger.info(row.reason);
        description += row.reason;
    });
    return description;
}

module.exports = {
    name: '!history',
    role: 'test',
    execute({ message, botContext, args }) {
        if (_.size(args) > 0) {
            try {
                const id = parseInt(args[0]);
                const description = getHistory(id, botContext);
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
    },
};
