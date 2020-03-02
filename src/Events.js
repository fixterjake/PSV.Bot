const logger = require('../utils/logger');
const AuditLogs = require('../utils/AuditLogs');

class Events {
    constructor(botContext) {
        this.botContext = botContext;
        this.AuditLogs = new AuditLogs(this.botContext);
        logger.info('Events loaded.');
    }

    async onGuildMemberAdded(member) {
        this.botContext.database.db.run(
            'INSERT INTO users (client_id, name) VALUES (?,?)',
            [member.id, member.username],
            (error) => {
                logger.info(error);
            }
        );
        this.AuditLogs.log('Member Joined', `**Member**: ${member}`);
    }

    async onGuildMemberRemoved(member) {
        this.AuditLogs.log('Member Left', `**Member**: ${member}`);
    }

    async onGuildMemberUpdated(oldMember, newMember) {}

    async onChannelCreated(channel) {
        this.AuditLogs.log('Channel Created', `**Channel**: ${channel}`);
    }

    async onChannelDeleted(channel) {
        this.AuditLogs.log('Channel Deleted', `**Channel**: ${channel}`);
    }

    async onGuildBanAdded(guild, user) {
        this.AuditLogs.log('Ban Added', `**User**: ${user}`);
    }

    async onGuildBanRemoved(guild, user) {
        this.AuditLogs.log('Ban Removed', `**User**: ${user}`);
    }

    async onMessageDeleted(message) {
        this.AuditLogs.log(
            'Message Deleted',
            `**Message**: ${message.content}`
        );
    }

    async onMessageDeletedBulk(messages) {
        this.AuditLogs.log(
            'Message Bulk Delete',
            `**Messaged Deleted**: ${messages.count}`
        );
    }

    async onMessageUpdated(oldMessage, newMessage) {
        if (newMessage.author.bot) {
            return;
        }
        this.AuditLogs.log(
            'Messaged Updated',
            `**Old Message**: ${oldMessage.content}\n\n **New Message**: ${newMessage.content}`
        );
    }

    async onRoleCreated(role) {
        this.AuditLogs.log('Role Created', `**Role**: ${role}`);
    }

    async onRoleDeleted(role) {
        this.AuditLogs.log('Role Deleted', `**Role**: ${role}`);
    }

    async onUserUpdated(oldUser, newUser) {}
}

module.exports = Events;
