const _ = require('lodash');
const Discord = require('discord.js');
const logger = require('../utils/logger');

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
        date.getMinutes() +
        ':' +
        date.getSeconds();
    botContext.database.db.run(
        'INSERT INTO warnings (client_id, user, timestamp, reason) VALUES (?,?,?,?)',
        [user.id, user.username, dateString, reason],
        (error) => {
            if (error) {
                logger.info(error);
            }
            user.send(
                `You have been warned in **Power Set Virtual** by **${staffMember.username}**\n\n **Reason**: ${reason}`
            );
        }
    );
}

module.exports = {
    name: '!warn',
    role: 'test',
    execute({ message, botContext, args }) {
        if (_.size(args) > 0) {
            try {
                const user = message.mentions.users.first();
                const reasonArray = args.slice(1, args.count);
                const reason = reasonArray.join(' ');
                const staffMember = message.author;
                warn(user, reason, botContext, staffMember);
                logger.info(`User ${user} warned for ${reason}`);
                const embed = new Discord.RichEmbed()
                    .setAuthor('PSV Bot')
                    .setColor('#0099ff')
                    .setDescription(
                        `**User** ${user} warned\n\n **Reason**: ${reason}`
                    )
                    .setTimestamp();
                message.channel.send(embed);
            } catch (error) {
                logger.info(error);
            }
        }
    },
};
