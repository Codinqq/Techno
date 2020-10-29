const Discord = require("discord.js");

module.exports.run = async (client, msg, channel, args, config, guild, Discord, u) => {
    msg.delete();

    let embed = new Discord.RichEmbed().setColor(config.color);

    let queueResp = "";
    let data = u.queue.get(msg.guild.id) || {};
    for (var i = 1; i < data.queue.length; i++) {
        if (!data.queue[i]) {
            queueResp += `Currently not playing anything.`;
        } else {
            queueResp += `> [${data.queue[i].songTitle}](https://www.youtube.com${data.queue[i].url})\n> Requested by: ${data.queue[i].requester}\n\n`;
        }
    }
    channel.send(embed.setDescription(`**Music** | *Queue*\n> Currently playing [${data.queue[0].songTitle}](https://www.youtube.com${data.queue[0].url})\n\n**Next Up**\n` + queueResp));

};