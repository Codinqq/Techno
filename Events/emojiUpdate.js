const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async(client, oldEmoji, newEmoji, config) => {
    await Dashboard.findOne({guildID: newEmoji.guild.id}, (err, guild) => {
        
            if(!guild){
            const newConfig = new Dashboard({
                guildID: newEmoji.guild.id,
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
if(!guild.addons.advancedLogs.emojiEdited) {
                    guild.addons.advancedLogs.emojiEdited === false;
                    return guild.save().catch(err => console.log(err.stack));
                }
        if(guild.addons.advancedLogs.emojiEdited === true) {

    if(oldEmoji.name != newEmoji.name) {

        let embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setDescription(`**Emoji Update** | Name-Changed\n> The name of the emoji <:${newEmoji.name}:${newEmoji.id}> was changed from **${oldEmoji.name}** to **${newEmoji.name}**`)

        let logChannel = newEmoji.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
            logChannel = newEmoji.guild.channels.find(c => c.name === "blogs");
        }

        logChannel.send(embed);
            }
        }
    });

};