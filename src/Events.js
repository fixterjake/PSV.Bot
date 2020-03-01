const logger = require('../utils/logger');
const AuditLogs = require('../utils/AuditLogs');

class Events {
    constructor(botContext) {
        this.botContext = botContext;
        this.AuditLogs = new AuditLogs(this.botContext);
        logger.info("Events loaded.");
    }

    async onGuildMemberAdded(member) {
    
    }

    async onGuildMemberRemoved(member) {

    }

    async onGuildMemberUpdated(oldMember, newMember) {

    }

    async onChannelCreated(channel) {

    }

    async onChannelDeleted(channel) {

    }

    async onGuildBanAdded(guild, user) {

    }

    async onGuildBanRemoved(guild, user) {

    }

    async onMessageDeleted(message) {

    }

    async onMessageDeletedBulk(messages) {

    }

    async onMessageUpdated(oldMessage, newMessage) {

    }

    async onRoleCreated(role) {

    }

    async onRoleDeleted(role) {

    }

    async onUserUpdated(oldUser, newUser) {

    }
}

module.exports = Events;