// @ts-check
const logger = require('../utils/logger');
const AuditLogs = require('../utils/AuditLogs');

class Events {
    /**
     * @param {import("../../../../Code/PSV/PSV.Bot/src/BotContext")} botContext
     */
    constructor(botContext, database) {
        this.botContext = botContext;
        this.database = database;
        this.AuditLogs = new AuditLogs(this.botContext);
        logger.info('Events loaded.');
    }

    /**
     * @param {import("discord.js").GuildMember} member
     */
    async onGuildMemberAdded(member) {
        /**
         * @param {string} error
         */
        this.botContext.database.db.run(
            'INSERT INTO users (client_id, name, verified) VALUES (?,?,?)',
            [member.user.id, member.user.username, false],
            (error) => {
                if (error) {
                    logger.info(error);
                }
            }
        );
        logger.info(`User ${member.user.username} added to database`);
        this.AuditLogs.log('Member Joined', `**Member**: ${member}`);
    }

    /**
     * @param {import("discord.js").GuildMember} member
     */
    async onGuildMemberRemoved(member) {
        this.AuditLogs.log('Member Left', `**Member**: ${member}`);
    }

    /**
     * @param {import("discord.js").GuildMember} oldMember
     * @param {import("discord.js").GuildMember} newMember
     */
    async onGuildMemberUpdated(oldMember, newMember) {}

    /**
     * @param {import("discord.js").Channel} channel
     */
    async onChannelCreated(channel) {
        if (channel.type != "dm") {
            this.AuditLogs.log('Channel Created', `**Channel**: ${channel}`);
        }
    }

    /**
     * @param {import("discord.js").Channel} channel
     */
    async onChannelDeleted(channel) {
        this.AuditLogs.log('Channel Deleted', `**Channel**: ${channel}`);
    }

    /**
     * @param {import("discord.js").Guild} guild
     * @param {import("discord.js").User} user
     */
    async onGuildBanAdded(guild, user) {
        this.AuditLogs.log('Ban Added', `**User**: ${user}`);
    }

    /**
     * @param {import("discord.js").Guild} guild
     * @param {import("discord.js").User} user
     */
    async onGuildBanRemoved(guild, user) {
        this.AuditLogs.log('Ban Removed', `**User**: ${user}`);
    }

    /**
     * @param {import("discord.js").Message} message
     */
    async onMessageDeleted(message) {
        this.AuditLogs.log(
            'Message Deleted',
            `**Message**: ${message.content}`
        );
    }

    /**
     * @param {import("discord.js").Collection<string, import("discord.js").Message>} messages
     */
    async onMessageDeletedBulk(messages) {
        this.AuditLogs.log(
            'Message Bulk Delete',
            `**Messaged Deleted**: ${messages.size}`
        );
    }

    /**
     * @param {import("discord.js").Message} oldMessage
     * @param {import("discord.js").Message} newMessage
     */
    async onMessageUpdated(oldMessage, newMessage) {
        if (newMessage.author.bot) {
            return;
        }
        this.AuditLogs.log(
            'Messaged Updated',
            `**Old Message**: ${oldMessage.content}\n\n **New Message**: ${newMessage.content}`
        );
    }

    /**
     * @param {import("discord.js").Role} role
     */
    async onRoleCreated(role) {
        this.AuditLogs.log('Role Created', `**Role**: ${role}`);
    }

    /**
     * @param {import("discord.js").Role} role
     */
    async onRoleDeleted(role) {
        this.AuditLogs.log('Role Deleted', `**Role**: ${role}`);
    }

    /**
     * @param {import("discord.js").User} oldUser
     * @param {import("discord.js").User} newUser
     */
    async onUserUpdated(oldUser, newUser) {}
}

module.exports = Events;
