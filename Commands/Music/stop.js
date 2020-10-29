const Discord = require('discord.js');
module.exports.run = async (client, msg, channel, args, config, guild, Discord, u) => {
    msg.delete();

    let joinchannel = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> You need to be in the same voice-channel as Techno to stop the song.`)
        .setColor(config.color)

    if (!msg.member.voiceChannel) return msg.channel.send(joinchannel);

    let noMusic = new Discord.RichEmbed()
        .setDescription(`**Music** | *Error*\n> You can't stop music if theres no music playing.`)
        .setColor(config.color)

    if (!msg.guild.me.voiceChannel) return msg.channel.send(noMusic);
    if (msg.guild.me.voiceChannelID !== msg.member.voiceChannelID) return msg.channel.send(joinchannel);

    msg.guild.me.voiceChannel.leave();
};