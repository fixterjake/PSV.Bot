// @ts-check
const _ = require('lodash');
const Discord = require('discord.js');
const logger = require('../utils/logger');

/**
 * @param {{ id: any; username: any; send: (arg0: string) => void; }} user
 * @param {any} reason
 * @param {{ database: { db: { run: (arg0: string, arg1: any[], arg2: (error: any) => void) => void; }; }; }} botContext
 * @param {{ username: any; id: any; }} staffMember
 */
async function warn(user, reason, botContext, staffMember) {
    const date = new Date();
    const dateString =
        date.getMonth() +
        1 +
        '/' +
        date.getDate() +
        '/' +
        date.getFullYear() +
        ' | ' +
        date.getHours() +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())   +
        ':' +
        date.getSeconds();
    /**
     * @param {string} error
     */
    /**
     * @param {string} error
     */
    botContext.database.db.run(
        'INSERT INTO warnings (client_id, type, user, staffMember, staffMember_id, timestamp, reason) VALUES (?,?,?,?,?,?,?)',
        [user.id, 'Warn', user.username, staffMember.username, staffMember.id, dateString, reason],
        (error) => {
            if (error) {
                logger.info(error);
            }
        }
    );
    user.send(
        `You have been warned in **Power Set Virtual** by **${staffMember.username}**\n\n **Reason**: ${reason}`
    );
}

module.exports = {
    name: '!warn',
    role: 'Staff Team',
    execute({ message, botContext, args }) {
        if (_.size(args) > 0) {
            try {
                const user = message.mentions.users.first();
                const reasonArray = args.slice(1, args.count);
                const reason = reasonArray.join(' ');
                const staffMember = message.author;
                warn(user, reason, botContext, staffMember);
                logger.info(`User ${user.username} warned by ${staffMember.username} for '${reason}'`);
                const embed = new Discord.RichEmbed()
                    .setAuthor('PSV Bot')
                    .setColor('#0099ff')
                    .setDescription(
                        `${user} warned by ${message.author}\n\n **Reason**: ${reason}`
                    )
                    .setTimestamp();
                botContext.modChannel.send(embed);
                message.channel.send(`**${user.username}** has been warned`);
            } catch (error) {
                logger.info(error);
            }
        }
        else {
            message.channel.send(`**Usage**: !warn @user reason`);
        }
    },
};
