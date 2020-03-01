const Discord = require('discord.js');

class AuditLogs {
  constructor(botContext) {
    this.botContext = botContext;
  }

  async log(type, message) {
    const guild = this.botContext.discordClient.guilds.first();
    const logChannel = guild.channels.find((channel) => channel.name == 'logs');
    const embed = new Discord.RichEmbed()
      .setColor('#0099ff')
      .setAuthor('PSV Bot')
      .setTitle(type == null ? '' : type)
      .setTimestamp()
      .setDescription(`${message}`);
    await logChannel.send(embed);
  }
}
module.exports = AuditLogs;
