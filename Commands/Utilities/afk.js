const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {

    await Users.findOne({
        guildID: msg.guild.id,
        userID: msg.author.id
    }, (err, user) => {
        if (err) return console.log(err);

        let afkMessage = "> Reason `" + args.slice(0).join(" ") + "`";
        if (!args.slice(0).join(" ")) {
            afkMessage = "";
        }

        let afkEmbed = new Discord.RichEmbed()
            .setDescription(`**AFK**\n> ${msg.author.tag} is now afk\n${afkMessage}`).setColor(config.color);

        user.settings.afk.enabled = "true";
        user.settings.afk.message = args.slice(0).join(" ");
        user.save().catch(err => console.log(err));
        return channel.send(afkEmbed);

    });
};