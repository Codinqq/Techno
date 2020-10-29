const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");


const rString = require("randomstring");
const Canvas = require('canvas');
const { createCanvas, loadImage } = require('canvas');

module.exports.run = async (client, member, config) => {
    Dashboard.findOne({guildID: member.guild.id}, (err, guild) => {
        if(!guild){
            const newConfig = new Dashboard({
                guildID: member.guild.id,
                prefix: "t!",
            channels: {
                botLogs: "Not Defined",
            },
            addons: {
                verification:{
                    enabled: false,
                    code: "0000",
                    random: true,
                    roleID: ""
                },
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
            return newConfig.save().catch(err => console.log(err));
        }
        if(err) return console.log(err);

        Users.findOne({userID: member.id, guildID: member.guild.id}, async (err, user) => {
            if(err) throw err;
            if(!user){
                const userDB = new Users({
                    userID: member.id,
                    guildID: member.guild.id,
                    levels: {
                        level: 0,
                        xp: 0,
                        messages: 0,
                    },
                    punishments: {
                        warns: 0,
                        bans: 0,
                        kicks: 0,
                        autowarn: 0,
                        spam: 0,
                    },
                    settings: {
                        afk: {
                            enabled: "false",
                            message: "None"
                        }
                    }
                });
                
                return userDB.save().catch(err => console.log(err));
            
            }

    });
    let memberLog = member.guild.channels.find(c => c.id === guild.addons.memberLogs.channel);
    if(!memberLog){
        memberLog = member.guild.channels.find(c => c.name === "memberlogs");
    }
    let joinMessage = guild.addons.memberLogs.messages.join;
    joinMessage = joinMessage.replace("[USER]", member.user.tag).replace("[COUNT]", member.guild.memberCount).replace("[SERVER]", member.guild.name).replace("[USER]", member.tag).replace("[COUNT]", member.guild.memberCount).replace("[SERVER]", member.guild.name);
    
    if(guild.addons.memberLogs.enabled) {

        let joinEmbed = new Discord.RichEmbed()
        .setDescription(joinMessage)
        .setColor(config.color);
        if(guild.addons.memberLogs.joinRole && guild.addons.memberLogs.joinRole != "Not Defined") {
            member.addRole(guild.addons.memberLogs.joinRole);
        }
        if(memberLog){
            memberLog.send(joinEmbed);
        }
        let logEmbed = new Discord.RichEmbed()
        .setDescription(`${member.user.tag} joined the server!`)
        .setColor(config.color);
        let logChannel = member.guild.channels.find(c => c.id === guild.channels.botLogs);
        if(!logChannel){
                logChannel = member.guild.channels.find(c => c.name === "blogs");
                if(!logChannel) return;
        }
        return logChannel.send(logEmbed);
    };
    });
}