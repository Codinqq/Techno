const ytdl = require('ytdl-core');
const Discord = require('discord.js')


module.exports.run = async (client, msg, channel, args, config, guild, Discord, u) => {
    msg.delete();

    let fetched = u.queue.get(msg.guild.id)

    let nomusic = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> There currently aren't any music playing.`)
        .setColor(config.color)


    if (!fetched) return msg.channel.send(nomusic)
    let joinchannel = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> You need to be in the same channel as Techno to resume the song.`)
        .setColor(config.color)
    if (msg.member.voiceChannel !== msg.guild.me.voiceChannel) return msg.channel.send(joinchannel)

    let alreadypaused = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> The music is already playing.`)
        .setColor(config.color)

    if (fetched.dispatcher.resumed) return msg.channel.send(alreadypaused)

    fetched.dispatcher.resume();

    let paused = new Discord.RichEmbed()
        .setDescription(`**Music**\n> The music has been resumed.`)
        .setColor(config.color)

    channel.send(paused);


}