module.exports = {
  name: '!reload',
  role: 'test',
  execute({ message, botContext }) {
    botContext.commandDispatcher.reloadAllCommands(message);
  },
};
