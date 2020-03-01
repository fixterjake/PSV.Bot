module.exports = {
    name: '!ping',
    role: 'test',
    execute({ message, botContext }) {
      message.channel.send("Pong");
    },
};