const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async(client, channel, config) => {
    await Dashboard.findOne({guildID: channel.guild.id}, (err, guild) => {
        
        
            if(!guild){
            const newConfig = new Dashboard({
                guildID: channel.guild.id,
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
        if(!guild.addons.advancedLogs.channelUpdate) {
                    guild.addons.advancedLogs.channelUpdate === false;
                    return guild.save().catch(err => console.log(err.stack));
                }
        if(guild.addons.advancedLogs.channelUpdate === true) {
            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Channel Created**\n> A channel named **${channel.name}** was created, and has the id of **${channel.id}**`);
    
            let logChannel = channel.guild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = channel.guild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }

    });

};