const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (
  client,
  msg,
  channel,
  args,
  config,
  guild,
  Discord
) => {
  Dashboard.findOne({
    guildID: msg.guild.id
  }, (err, guild) => {
    if (err) return console.log(err);

    msg.delete();
    if (!msg.member.hasPermission("ADMINISTRATOR")) {
      let noAccessEmbed = new Discord.RichEmbed()
        .setDescription(
          `**Rules** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``
        )
        .setColor(config.color);
      return channel.send(noAccessEmbed);
    }

    let rulesMessage = args.slice(0).join(" ");

    if (!rulesMessage) {
      let noRulesMessage = new Discord.RichEmbed().setColor(config.color)
        .setDescription(`**Rules**\n- Use this command to make an rules embed.\n\nTo use the command, use \`${guild.prefix}rules <rules>\`\nIf you want to send the rules in the current channel, include \`-c\` in the message.`);
      return channel.send(rulesMessage);
    }

    let rulesChannel = msg.guild.channels.find(c => c.name === "rules");

    if (msg.content.toLowerCase().includes("-c")) {
      rulesMessage = rulesMessage.replace("-c", " ");
      rulesChannel = msg.channel;
    }

    if (!rulesChannel) {
      let noRuleChannel = new Discord.RichEmbed().setColor(config.color)
        .setDescription(`**Rules** | *Error*\n*I couldn't find any channels named \`#rules\`*\n- To fix this, either make a channel named \`rules\` or use \`${guild.prefix}setup\`!`);
      return channel.send(noRuleChannel);
    }

    let rulesEmbed = new Discord.RichEmbed()
      .setDescription(
        `**Rules**\n${rulesMessage}`
      )
      .setColor(config.color)
      .setFooter(
        "Reply with ✅ if you accept with the rules, and ⛔ if you don't accept the rules."
      );

    rulesChannel.send(rulesEmbed).then(async m => {
      await m.react("✅");
      await m.react("⛔");
    });
  });
};