const logger = require('../utils/logger');

module.exports = {
    name: '!addtodatabase',
    role: 'test',
    execute({ message, botContext }) {
        botContext.database.db.run(
            'INSERT INTO users (client_id, name) VALUES (?,?)',
            [message.author.id, message.author.username],
            (error) => {
                if (error) {
                    logger.info(error);
                }
                logger.info(`User ${message.author} added to database`);
            }
        );
        message.channel.send(`User ${message.author} added to database`);
    },
};
