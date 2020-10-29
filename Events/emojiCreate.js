const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async(client, emoji, config) => {
    await Dashboard.findOne({guildID: emoji.guild.id}, (err, guild) => {
        
        
            if(!guild){
            const newConfig = new Dashboard({
                guildID: emoji.guild.id,
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
            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Emoji Created**\n> An emoji named **${emoji.name}** was created and looks like <:${emoji.name}:${emoji.id}>`);
    
            let logChannel = emoji.guild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = emoji.guild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }

    });

};