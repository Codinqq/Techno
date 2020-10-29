const Discord = require("discord.js");

module.exports.run = async (client, msg, channel, args, config, guild, Discord, u) => {
    msg.delete();
    let data = u.queue.get(msg.guild.id) || {};

    let noMusicEmbed = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> There currently aren't any music playing.`)
        .setColor(config.color)

    if (!data.queue[0].songTitle) return channel.send(nomusicEmbed);

    let betweenEmbed = new Discord.RichEmbed()
        .setDescription(`**Music**\n> Currently playing [${data.queue[0].songTitle}](https://www.youtube.com${data.queue[0].url})\n\n> Next Up [${data.queue[1].songTitle}](https://www.youtube.com${data.queue[1].url})`)
        .setColor(config.color)

    return channel.send(betweenEmbed);
}