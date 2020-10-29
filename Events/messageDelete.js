const Discord = require("discord.js");
const Users = require("../models/users.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async(client, message, config) => {
    if(message.channel.type === "dm") {
        return;
    }
    if(message.channel.type === "group") {
        return;
    }
    
    await Dashboard.findOne({guildID: message.guild.id}, (err, guild) => {
        
        if(!guild){
            const newConfig = new Dashboard({
                guildID: message.guild.id,
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
            if(err) console.log(err.stack);

        
    let swearWords = ["fuck", "nigga", "porn", "niger", "nigger", "bitch", "whore", "penis", "vagina", "asshole", "dick", "cunt", "thot", "twat", "jerkoff", "arse", "a$$", "as$", "a$s"];
    if(guild.addons.automod.noSwear === true) {
    for(var s in swearWords){
                if(message.content.toLowerCase().includes(swearWords[s])){
                    return;
                }
            }
        }
            let advertisement = ["https://", "http://", "www.", "discord.gg/", "youtube.com/"];
            if(guild.addons.automod.noLinks === true) {
                for(var a in advertisement) {
                    if(message.content.toLowerCase().includes(advertisement[a])) {
                        return;
                    }
                }
            }
                    if(message.author.bot) return;
                    if(message.content.startsWith(guild.prefix)) return;
                    if(guild.addons.advancedLogs.messageRemove === true) {
    
                        let logChannel = message.guild.channels.find(c => c.id === guild.channels.botLogs);
                        if(!logChannel){
                                logChannel = message.guild.channels.find(c => c.name === "blogs");
                        }

                        if(message.content.length > 900) {
                            message.content = message.content.substr(0,899) + "...";
                        }

                        if(!message.content) return;
                        let removeMessage = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setAuthor(message.author.tag, message.author.avatarURL)
                        .setDescription(`**A message sent by ${message.author} was removed from** ${message.channel}\n\`${message.content}\``)
                        .setTimestamp();

                        return logChannel.send(removeMessage); 
                    }
            });
};