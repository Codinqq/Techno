const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
const moment = require("moment");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {

        if (err) return console.log(err);
        msg.delete();


        let userEmbed = new Discord.RichEmbed()
            .setColor(config.color)
            .setThumbnail(client.user.iconURL)
            .setDescription(`**Bot Information**\n> Name \`${client.user.tag}\`\n> Id \`${client.user.id}\`\n> Owner \`Codinq#9311\`\n> Created-Date \`${moment.utc(client.user.createdAt).format("MMM Do YYYY, HH:mm")} UTC\`\n\n> Server Count \`${client.guilds.size}\`\n> User Count \`${client.users.size}\`\n\n> Bot-Version \`${config.version}\`\n> Language \`Node.js\`\n> API-Version \`Discord.js v11.5\``);

        return msg.channel.send(userEmbed);

    });
};