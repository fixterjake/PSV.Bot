// @ts-check
const Discord = require('discord.js');
const CommandDispatcher = require('./CommandDispatcher');
const BotContext = require('./BotContext');
const BotEvents = require('./Events');
const logger = require('../utils/logger');
const AuditLog = require('../utils/AuditLogs');
const Database = require('../utils/Database');

require('dotenv').config();

class Main {
    constructor() {
        this.botContext = new BotContext();
        this.database = new Database();
        this.commandDispatcher = new CommandDispatcher(this.botContext);
        this.botEvents = new BotEvents(this.botContext, this.database);
        this.auditLog = new AuditLog(this.botContext);
        this.discordClient = new Discord.Client();

        this.botContext.registerCommandDispatcher(this.commandDispatcher);
        this.botContext.registerDiscordClient(this.discordClient);
        this.botContext.registerDatabase(this.database);
    }

    async init() {
        await Promise.all([this.commandDispatcher.initialize()]);
        await this.SetupDiscordBot();
    }

    async SetupDiscordBot() {
        this.discordClient.once('ready', () => {
            this.botContext.registerLogChannel(
                this.botContext.discordClient.guilds.first()
            );
            this.botContext.registerModerationChannel(
                this.botContext.discordClient.guilds.first()
            );
            logger.info('Connected to Discord!');
            this.auditLog.log('Info', 'Bot Started');
        });
        this.discordClient.on('message', async (message) => {
            await this.commandDispatcher.dispatchCommand(message);
        });
        this.discordClient.on('guildMemberAdd', async (member) => {
            await this.botEvents.onGuildMemberAdded(member);
        });
        this.discordClient.on('guildMemberRemove', async (member) => {
            await this.botEvents.onGuildMemberRemoved(member);
        });
        this.discordClient.on(
            'guildMemberUpdate',
            async (oldMember, newMember) => {
                await this.botEvents.onGuildMemberUpdated(oldMember, newMember);
            }
        );
        this.discordClient.on('channelCreate', async (channel) => {
            await this.botEvents.onChannelCreated(channel);
        });
        this.discordClient.on('channelDelete', async (channel) => {
            await this.botEvents.onChannelDeleted(channel);
        });
        this.discordClient.on('guildBanAdd', async (guild, user) => {
            await this.botEvents.onGuildBanAdded(guild, user);
        });
        this.discordClient.on('guildBanRemove', async (guild, user) => {
            await this.botEvents.onGuildBanRemoved(guild, user);
        });
        this.discordClient.on('messageDelete', async (message) => {
            await this.botEvents.onMessageDeleted(message);
        });
        this.discordClient.on('messageDeleteBulk', async (messages) => {
            await this.botEvents.onMessageDeletedBulk(messages);
        });
        this.discordClient.on(
            'messageUpdate',
            async (oldMessage, newMessage) => {
                await this.botEvents.onMessageUpdated(oldMessage, newMessage);
            }
        );
        this.discordClient.on('roleCreate', async (role) => {
            await this.botEvents.onRoleCreated(role);
        });
        this.discordClient.on('roleDelete', async (role) => {
            await this.botEvents.onRoleDeleted(role);
        });
        this.discordClient.on('userUpdate', async (oldUser, newUser) => {
            await this.botEvents.onUserUpdated(oldUser, newUser);
        });
        const authToken = process.env.DISCORD_AUTH;
        await this.discordClient.login(authToken);
    }
}

async function main() {
    const mainInstance = new Main();
    try {
        await mainInstance.init();
    } catch (error) {
        logger.error(`Error initializing: `, error);
    }
}

main();
