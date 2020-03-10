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

        /**
         * @type {Database}
         */
        this.database = null;

        /**
         * @type {Channel} - this comes from DiscordJS
         */
        this.logChannel = null;

        /**
         * @type {Channel} - this comes from DiscordJS
         */
        this.modChannel = null;
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

    registerLogChannel(guild) {
        this.logChannel = guild.channels.find(
            (channel) => channel.name == 'logs'
        );
    }

    registerModerationChannel(guild) {
        this.modChannel = guild.channels.find(
            (channel) => channel.name == 'moderation'
        );
    }
}

module.exports = BotContext;
