const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async (client, guild, config) => {
    Dashboard.findOne({guildID: guild.id}, async (err, guildDB) => {        if(err) return console.log(err);

        if(err) console.log(err);
        if(guildDB.blacklisted.blacklisted === true) {
            let blacklistEmbedGuild = new Discord.RichEmbed()
                        .setDescription(`**Admin Commands** | **Blacklist**\n> This guild has been blacklisted.\n> Reason: \`${guildDB.blacklisted.message}\``)
                        .setColor(config.color);

                        guild.channels.forEach((channel) => {
                            if(channel.name === "general"){
                                channel.send(blacklistEmbedGuild);

                            }
                        });
                        return await guild.leave();        
        } else {

            let defaultChannel = "";
     await guild.channels.forEach((channel) => {
        if (channel.type == "text") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) defaultChannel = channel;
        }
    });
    let botOwner = await client.users.get("165144718731116544");


        let logEmbed = new Discord.RichEmbed()
        .setDescription(`-------------------------------------------------------------------------------\n**Joined a server!**\nGuild **${guild.name}** | ID **${guild.id}**\nMembers **${guild.memberCount}** (Bots: **${guild.members.filter(member => member.user.bot).size}**)\nGuild Count **${client.guilds.size}** | User Count **${client.users.size}**\n-------------------------------------------------------------------------------`)
        .setColor(config.color);

        await botOwner.send(logEmbed);


        let joinEmbed = new Discord.RichEmbed()
        .setDescription(`**Thanks for inviting me!**\n- To check which commands I have use \`t!help\`\n**Useful links**\n[Website](https://botsfordiscord.com/bot/569068361686974465) - Invite Techno.\n[Support Server](https://discord.gg/MhajYyn) - Get help with Techno from one of our staff members.\n[Twitter](https://twitter.com/technodev_) - This will be the place where the new updates will be revealed first!`)
        .setColor(config.color);
        await defaultChannel.send(joinEmbed);
        }

    });
}