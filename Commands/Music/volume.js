const ytdl = require("ytdl-core");
const Discord = require("discord.js");

module.exports.run = async (client, msg, channel, args, config, guild, Discord, u) => {
    msg.delete();

    const embed = new Discord.RichEmbed().setColor(config.color);

    let fetched = u.queue.get(msg.guild.id);

    let nofetched = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> There currently aren't any music playing.`)
        .setColor(config.color)

    let sameChannel = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> You need to be in the same channel as Techno to change the volume of the song.`)
        .setColor(config.color)

    if (!fetched) return channel.send(nofetched);
    if (msg.member.voiceChannel !== msg.guild.me.voiceChannel) return channel.send(sameChannel);

    let betweenEmbed = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> Please use a number between 0 and 100.`)
        .setColor(config.color)
    if (isNaN(args[0]) || args[0] > 100 || args[0] < 0) return channel.send(betweenEmbed);

    fetched.dispatcher.setVolume(args[0] / 100);

    return channel.send(embed.setDescription(`**Music**\n> Set the volume to \`${args[0]}\``));

};