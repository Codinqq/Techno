const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async (client, oldRole, newRole, config) => {
    await Dashboard.findOne({guildID: newRole.guild.id}, async (err, guild) => { 
        
        if(!guild){
            const newConfig = new Dashboard({
                guildID: guild.id,
                prefix: "t!",
            channels: {
                botLogs: "Not Defined",
            },
            addons: {
                automod: {
                    noSwear: false,
                    noSpam: false,
                    noLinks: false
                },
                advancedLogs: {
                    messageEdited: false,
                    messageRemove: false,
                    emojiEdited: false,
                    banAdd: false,
                    memberUpdate: false,
                    guildUpdate: false,
                    roleUpdate: false,
                    channelUpdate: false,
                },
                levels: {
                    enabled: false,
                    levelupMessage: "Not Defined",
                },
                memberLogs: {
                    enabled: false,
                    joinRole: "Not Defined",
                    messages: {
                        join: "Not Defined",
                        leave: "Not Defined"
                    },
                    channel: "Not Defined"
                }
            }
            });
            return newConfig.save().catch(err => console.log(err.stack));
        }
        
        if(err) return console.log(err.stack);
                if(!guild.addons.advancedLogs.roleUpdate) {
                    guild.addons.advancedLogs.roleUpdate === false;
                    return guild.save().catch(err => console.log(err.stack));
                }

        if(guild.addons.advancedLogs.roleUpdate === true) {

    if(oldRole.hexColor != newRole.hexColor) {

        let embed = new Discord.RichEmbed()
        .setColor(newRole.hexColor)
        .setDescription(`**Role Update** | Color Changed\n> The color of **${newRole.name}** was changed from \`${oldRole.hexColor}\` to \`${newRole.hexColor}\``);

        let logChannel = newRole.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
            logChannel = newRole.guild.channels.find(c => c.name === "blogs");
        }

        logChannel.send(embed);
    }
    if(oldRole.name != newRole.name) {

        let embed = new Discord.RichEmbed()
        .setColor(newRole.hexColor)
        .setDescription(`**Role Update** | Name Changed\n> The name of **${oldRole.name}** was changed to **${newRole.name}**`);

        let logChannel = newRole.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
            logChannel = newRole.guild.channels.find(c => c.name === "blogs");
        }

        logChannel.send(embed);
    }
    if(oldRole.hoist != newRole.hoist) {

        if(newRole.hoist === false) {
            let embed = new Discord.RichEmbed()
            .setColor(newRole.hexColor)
            .setDescription(`**Role Update** | Separate Category\n> The role ${newRole.name} is no longer in a separate category in the user list.`);
        let logChannel = newRole.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
            logChannel = newRole.guild.channels.find(c => c.name === "blogs");
        }

        logChannel.send(embed);
        } else {
            let embed = new Discord.RichEmbed()
            .setColor(newRole.hexColor)
            .setDescription(`**Role Update** | Separate Category\n> The role ${newRole.name} is now in a separate category in the user list.`);

        let logChannel = newRole.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
            logChannel = newRole.guild.channels.find(c => c.name === "blogs");
        }

        logChannel.send(embed);
        }

    }
}
    });
}