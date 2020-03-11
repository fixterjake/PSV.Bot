// @ts-check
const logger = require('../utils/logger');

/**
 * @param {{ id: any; username: any; }} member
 * @param {{ database: { db: { run: (arg0: string, arg1: any[], arg2: (error: any) => void) => void; }; }; }} botContext
 */
async function addToDatabase(member, botContext) {
    /**
     * @param {string} error
     */
    botContext.database.db.run(
        'INSERT INTO users (client_id, name, verified) VALUES (?,?,?)',
        [member.id, member.username, false],
        (error) => {
            if (error) {
                logger.info(error);
            }
            else {
                logger.info(`User ${member.username} added to database`);
            }
        }
    );
}

module.exports = {
    name: '!addtodatabase',
    role: 'Staff Team',
    execute({ message, botContext }) {
        const users = botContext.discordClient.guilds.first().members;
        /**
         * @param {{ user: { bot: any; }; }} member
         */
        users.forEach((member) => {
            if (!member.user.bot) {
                addToDatabase(member.user, botContext);
            }
        });
        message.channel.send('All users added to database');
    },
};
