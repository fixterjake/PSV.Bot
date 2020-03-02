/**
 * This contains classes that we need from many different areas of the
 * bot. This allows us to just pass the context around instead of
 * several different parameters.
 */
class BotContext {
    constructor() {
        /**
         * @type {CommandDispatcher}
         */
        this.commandDispatcher = null;

        /**
         * @type {Client} - this comes from DiscordJS
         */
        this.discordClient = null;

        this.database = null;
    }

    registerCommandDispatcher(commandDispatcher) {
        this.commandDispatcher = commandDispatcher;
    }

    registerDiscordClient(discordClient) {
        this.discordClient = discordClient;
    }

    registerDatabase(database) {
        this.database = database;
    }
}

module.exports = BotContext;
