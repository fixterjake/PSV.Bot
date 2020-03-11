// @ts-check
const _ = require('lodash');
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
        let date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        let userDate = member.user.createdAt;
        if (userDate < date) {
            logger.info(`User ${member.user.username} added to database`);
            this.AuditLogs.log(
                'Member Joined',
                `**Member**: ${
                    member.user
                }\n\n **Warning** User created within 7 days!\n**Creation Date**: ${member.user.createdAt.toDateString()}`
            );
        } else {
            logger.info(`User ${member.user.username} added to database`);
            this.AuditLogs.log('Member Joined', `**Member**: ${member}`);
        }
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
    async onGuildMemberUpdated(oldMember, newMember) {
        let change = ``;
        let description = ``;
        if (oldMember.nickname == null && _.isString(newMember.nickname)) {
            change = `Nickname Added`;
            description = `**User**: ${newMember.user}\n\n**Nickname**: ${newMember.nickname}`;
        } else if (
            _.isString(oldMember.nickname) &&
            newMember.nickname == null
        ) {
            change = `Nickname Removed`;
            description = `**User**: ${newMember.user}\n\n**Nickname**: ${oldMember.nickname}`;
        } else if (oldMember.nickname != newMember.nickname) {
            change = `Nickname Changed`;
            description = `**User**: ${newMember.user}\n\n**Old Nickname**: ${oldMember.nickname}\n\n**New Nickname**: ${newMember.nickname}`;
        }
        let guild = this.botContext.discordClient.guilds.first();
        let entry = await guild
            .fetchAuditLogs({ type: 'MEMBER_UPDATE' })
            .then((audit) => audit.entries.first());

        if (change === '' || change === 'none') {
            entry = await guild
                .fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' })
                .then((audit) => audit.entries.first());

            if (entry && entry.changes) {
                change = '';
                entry.changes.forEach(function(data) {
                    let roleChanges = data.new;

                    if (data.new !== undefined) {
                        roleChanges.forEach(function(changedRole) {
                            if (data.key === '$add') {
                                change = 'Role Added';
                                description = `**User**: ${newMember.user}\n\n
                                               **Role**: ${guild.roles.find(
                                                    (role) =>
                                                    role.id ===
                                                    changedRole.id
                                                )}`;
                            } else {
                                change = 'Role Removed';
                                description = `**User**: ${newMember.user}\n\n
                                               **Role**: ${guild.roles.find(
                                                    (role) =>
                                                    role.id ===
                                                    changedRole.id
                                                )}`;
                            }
                        });
                    }
                });
            }
        }
        if (change === ``) {
            return;
        }
        this.AuditLogs.log(change, description);
    }

    /**
     * @param {import("discord.js").Channel} channel
     */
    async onChannelCreated(channel) {
        if (channel.type != 'dm') {
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

    async onMessageDeleted(message) {
        this.AuditLogs.log(
            'Message Deleted',
            `**User**: ${message.author}\n\n**Channel**: ${message.channel}\n\n**Message**: ${message.content}`
        );
    }

    /**
     * @param {import("discord.js").Collection<string, import("discord.js").Message>} messages
     */
    async onMessageDeletedBulk(messages) {
        this.AuditLogs.log(
            'Message Bulk Delete',
            `**Messaged Deleted**: ${messages.size - 1}`
        );
    }

    async onMessageUpdated(oldMessage, newMessage) {
        if (newMessage.author.bot) {
            return;
        }
        this.AuditLogs.log(
            'Messaged Updated',
            `**User**: ${newMessage.author}\n\n**Channel**:${newMessage.channel}\n\n**Old Message**: ${oldMessage.content}\n\n**New Message**: ${newMessage.content}`
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
}

module.exports = Events;
