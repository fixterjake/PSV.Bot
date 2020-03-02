const _ = require('lodash');
const logger = require('../utils/logger');

async function clearMessages(channel, number) {
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
    role: 'test',
    execute({ message, botContext, args }) {
        try {
            const number = parseInt(args[0]);
            if (_.size(args) > 0 && number > 0) {
                clearMessages(message.channel, number + 1);
            }
        } catch (error) {
            logger.info(error);
        }
    },
};
