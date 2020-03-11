module.exports = {
    name: '!reload',
    role: 'Staff Team',
    execute({ message, botContext }) {
        botContext.commandDispatcher.reloadAllCommands(message);
    },
};
