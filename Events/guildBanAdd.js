const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async(client, guild, user, config) => {
    await Dashboard.findOne({guildID: guild.id}, async (err, guildDB) => {
        
        
        if(!guildDB){
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
        
if(!guildDB.addons.advancedLogs.banAdd) {
                    guildDB.addons.advancedLogs.banAdd === false;
                    return guildDB.save().catch(err => console.log(err.stack));
                }        
        if(guildDB.addons.advancedLogs.banAdd === true) {

        let embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setDescription(`**User banned**\n> A user named ${user.tag} was banned.`);

        let logChannel = guild.channels.find(c => c.id === guildDB.channels.botLogs);
        if(!logChannel){
            logChannel = guild.channels.find(c => c.name === "blogs");
        }

        logChannel.send(embed);
    }
    });

};