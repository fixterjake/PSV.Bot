// @ts-check
const fs = require('fs');
const logger = require('../utils/logger');
const _ = require('lodash');
const path = require('path');
const AuditLog = require('../utils/AuditLogs');

/**
 * Class responsible for loading, reloading, and dispatching commands.
 */
class CommandDispatcher {
    /**
     * @param {import("../../../../Code/PSV/PSV.Bot/src/BotContext")} botContext
     */
    constructor(botContext) {
        /**
         * Keys: command names. Aliases will be represented here too.
         * Values: the entirety of the exports from a single command's JS file.
         * @type {Object<string, Object>}
         */
        this.commands = {};

        this.botContext = botContext;

        this.auditLogs = new AuditLog(this.botContext);
    }

    async initialize() {
        await this.reloadAllCommands();
    }

    async dispatchCommand(message) {
        const {
            channel: { type: channelType },
            author: { bot: senderIsABot },
            content: messageContent,
        } = message;

        // Don't react to bots at all (including itself)
        if (senderIsABot) {
            return;
        }

        // Only handle messages from DMs and regular server text chat.
        if (!_.includes(['text'], channelType)) {
            return;
        }

        const commandAndArguments = this.splitMessageIntoCommandAndArguments(
            messageContent
        );

        if (_.isNil(commandAndArguments)) {
            return;
        }

        const { command, args } = commandAndArguments;
        const matchingCommand = this.commands[command];
        if (_.isNil(matchingCommand)) {
            return;
        }

        if (!this.isUserAuthorized(message, matchingCommand, this.botContext)) {
            message.channel.send('You are not authorized to execute that command!');
            return;
        }

        // Note that this could be asynchronous, so if you ever want to act
        // on the result of it, you'll need to await this.
        try {
            await matchingCommand.execute({
                message,
                args,
                botContext: this.botContext,
            });
            if (message.type != 'dm') {
                this.auditLogs.log(
                    'Command Sent',
                    `\nChannel: ${message.channel}\n
                    User: ${message.author}\n
                    Command: ${message.content}`
                );
            }
        } catch (error) {
            this.sendErrorToAuthor(error, message);
        }
    }

    /**
     * Checks if the author of the message can access the command that
     * they're trying to use.
     * @return {boolean}
     * @param {{ member: { roles: { has: (arg0: any) => any; }; }; }} message
     * @param {{ role: string; }} matchingCommand
     * @param {{ discordClient: { guilds: { first: () => any; }; }; }} botContext
     */
    isUserAuthorized(message, matchingCommand, botContext) {
        const guild = botContext.discordClient.guilds.first();
        const role = guild.roles.find(
            (role) => role.name == matchingCommand.role
        );
        return (
            matchingCommand.role == 'All' || message.member.roles.has(role.id)
        );
    }

    /**
     * Separates out a command from its arguments (if any exist).
     * @param {string} messageContent
     * @return {?Object} - see below for the structure
     */
    splitMessageIntoCommandAndArguments(messageContent) {
        if (_.isNil(messageContent) || _.isEmpty(messageContent)) {
            return null;
        }

        const allArgsIncludingCommand = messageContent.split(/ +/);
        return {
            command: allArgsIncludingCommand[0],
            args: _.slice(allArgsIncludingCommand, 1),
        };
    }

    /**
     * Returns an absolute path to the commands folder (which should just
     * be ../commands). If we didn't have an absolute path, then the cwd
     * would be used for the relative directory, so I think this is
     * better.
     */
    getPathToCommandsFolder() {
        return path.resolve(path.join(__dirname, '..', 'commands'));
    }

    async reloadAllCommands(message = null) {
        this.commands = {};

        logger.info('Reloading all commands');

        const commandFiles = fs
            .readdirSync(this.getPathToCommandsFolder())
            .filter((file) => file.endsWith('.js'));

        const successValues = _.map(commandFiles, (file) =>
            this.reloadCommand(file, message)
        );

        const successfullyLoaded = _.sumBy(successValues, (v) => (v ? 1 : 0));

        const successMessage = `Successfully reloaded ${successfullyLoaded}/${_.size(
            commandFiles
        )} commands`;
        logger.info(successMessage);
        if (!_.isNil(message)) {
            await message.channel.send(successMessage);
        }
    }

    /**
     * This will reload a single command.
     * @param {string} fileNameAndExtension - something like "command.js"
     * param message - if defined, then this function was
     * triggered by a user message rather than internally, that way it can
     * replied to.
     * @return {boolean} if true, this was successful
     */
    reloadCommand(fileNameAndExtension, message = null) {
        const resolvePath = path.join(
            this.getPathToCommandsFolder(),
            fileNameAndExtension
        );

        // Clear the cache so that we get the newest data
        delete require.cache[require.resolve(resolvePath)];
        try {
            const command = require(resolvePath);

            const { name, aliases = [] } = command;
            const allPossibleNames = _.concat(name, aliases);
            _.forEach(allPossibleNames, (name) => {
                if (!_.isNil(this.commands[name])) {
                    this.sendErrorToAuthor(
                        new Error(
                            `A command already exists with the name or alias "${name}"`
                        ),
                        message
                    );
                    return false;
                }
                this.commands[name] = command;
            });

            return true;
        } catch (error) {
            this.sendErrorToAuthor(
                new Error(
                    `Couldn't reload ${fileNameAndExtension}: ${error.message}`
                ),
                message
            );
            return false;
        }
    }

    /**
     * If the Message passed in exists, then this will DM the error's
     * stack to the author.
     * @param {Error} error
     * param {?Message} message
     */
    sendErrorToAuthor(error, message) {
        if (_.isNil(message)) {
            throw error;
        }

        // This is asynchronous, but we don't wait for it to finish since
        // the error stack should be enough to identify what went wrong.
        message.author.send(`An error occurred: ${error.stack}`);
    }
}

module.exports = CommandDispatcher;
