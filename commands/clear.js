// @ts-check
const _ = require('lodash');
const logger = require('../utils/logger');

/**
 * @param {{ fetchMessages: (arg0: { limit: any; }) => Promise<any>; bulkDelete: (arg0: any) => void; }} channel
 * @param {number} number
 */
async function clearMessages(channel, number) {
    /**
     * @param {any} messages
     */
    /**
     * @param {string} error
     */
    channel
        .fetchMessages({ limit: number })
        .then((messages) => {
            channel.bulkDelete(messages);
        })
        .catch((error) => {
            logger.info(error);
        });
}

module.exports = {
    name: '!clear',
    role: 'Staff Team',
    execute({ message, botContext, args }) {
        if (_.size(args) > 0) {
            try {
                const number = parseInt(args[0]);
                if (_.size(args) > 0 && number > 0) {
                    clearMessages(message.channel, number + 1);
                }
            } catch (error) {
                logger.info(error);
            }
        }
        else {
            message.channel.send(`**Usage**: !clear number`);
        }
    },
};
