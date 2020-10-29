const Discord = require("discord.js");
module.exports.run = async (client, msg, channel, args, config, guild, Discord, u) => {
  msg.delete();


  const embed = new Discord.RichEmbed().setColor(config.color);

  let fetched = u.queue.get(msg.guild.id);

  if (!fetched) return channel.send(embed.setDescription(`**Music** | *Error*\n> There currently aren't any music playing.`));

  if (msg.author.id === "165144718731116544") {
    channel.send(embed.setDescription(`**Music** | *Error*\n> Developer detected. \n> Skipping the song.`));
    return fetched.dispatcher.emit("end");
  }

  if (msg.member.voiceChannel !== msg.guild.me.voiceChannel) return channel.send(embed.setDescription(`**Music** | *Error*\n> Join the same voice-channel as Techno to skip the song.`));

  let userCount = msg.member.voiceChannel.members.size;

  let required = Math.ceil(userCount / 2);

  if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];

  if (fetched.queue[0].voteSkips.includes(msg.member.id)) return channel.send(embed.setDescription(`**Music** | *Error*\n> You have already voted to skip the song.`).setFooter(`${fetched.queue[0].voteSkips.length}/${required} votes required to skip the song.`));

  fetched.queue[0].voteSkips.push(msg.member.id);
  channel.send(embed.setDescription(`**Music**\n> ${msg.author.tag} voted to skip the song.`).setFooter(`${fetched.queue[0].voteSkips.length}/${required} votes required to skip the song.`));
  u.queue.set(msg.guild.id, fetched);

  if (fetched.queue[0].voteSkips.length >= required) {
    fetched.dispatcher.emit("end");
    return channel.send(embed.setDescription(`**Music**\n> Got the required amounts of voted to skip.\n> Skipping the song.`))
  }

};