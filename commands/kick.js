// @ts-check
const _ = require('lodash');
const Discord = require('discord.js');
const logger = require('../utils/logger');

/**
 * @param {{ id: any; username: any; send: (arg0: string) => void; }} user
 * @param {any} reason
 * @param {{ discordClient: { guilds: { first: () => { (): any; new (): any; member: { (arg0: any): any; new (): any; }; }; }; }; database: { db: { run: (arg0: string, arg1: any[], arg2: (error: any) => void) => void; }; }; }} botContext
 * @param {{ username: any; }} staffMember
 */
async function kick(user, reason, botContext, staffMember) {
    const member = botContext.discordClient.guilds.first().member(user);
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
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
        date.getMinutes() +
        ':' +
        date.getSeconds();
    user.send(
        `You have been kicked from **Power Set Virtual** by **${staffMember.username}**\n\n **Reason**: ${reason}`
    );
    botContext.database.db.run(
        'INSERT INTO kicks (client_id, user, staffMember, timestamp, reason) VALUES (?,?,?,?,?)',
        [user.id, user.username, staffMember.username, dateString, reason],
        (error) => {
            if (error) {
                logger.info(error);
            }
        }
    );
    await delay(100);
    member.kick(reason);
    return true;
}

module.exports = {
    name: '!kick',
    role: 'test',
    execute({ message, botContext, args }) {
        if (_.size(args) > 0) {
            try {
                const userMention = message.mentions.users.first();
                const reasonArray = args.slice(1, args.count);
                const reason = reasonArray.join(' ');
                const staffMember = message.author;
                if (kick(userMention, reason, botContext, staffMember)) {
                    logger.info(
                        `User ${userMention.username} kicked for '${reason}'`
                    );
                    const embed = new Discord.RichEmbed()
                        .setAuthor('PSV Bot')
                        .setColor('#0099ff')
                        .setDescription(
                            `${userMention} kicked by ${message.author}\n\n **Reason**: ${reason}`
                        )
                        .setTimestamp();
                    botContext.modChannel.send(embed).then(message.delete());
                }
            } catch (error) {
                logger.info(error);
            }
        }
    },
};