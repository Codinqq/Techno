const Discord = require("discord.js");
const Users = require("../models/users.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async(client, oldMessage, newMessage, config) => {
    if(newMessage.channel.type === "dm") {
        return;
    }
    if(newMessage.channel.type === "group") {
        return;
    }
    if(newMessage.author.bot) return;
    if(newMessage.author.id === client.user.id) return;
    
    
    
    Dashboard.findOne({guildID: newMessage.guild.id}, (err, guild) => {
            if(err) console.log(err.stack);
            
            if(!guild){
            const newConfig = new Dashboard({
                guildID: newMessage.guild.id,
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

        let logChannel = newMessage.guild.channels.find(c => c.id === guild.channels.botLogs);
                    if(!logChannel){
                            logChannel = newMessage.guild.channels.find(c => c.name === "blogs");
                    }


        let swearWords = ["fuck", "nigga", "porn", "niger", "nigger", "bitch", "whore", "penis", "vagina", "asshole", "dick", "cunt", "thot", "twat", "jerkoff", "arse", "a$$", "as$", "a$s"];
        if(guild.addons.automod.noSwear === true) {
        for(var s in swearWords){
                if(newMessage.content.toLowerCase().includes(swearWords[s])){
                    newMessage.delete();

                    let logEmbed = new Discord.RichEmbed()
                    .setDescription(`**Anti-Swearing**\n- User \`${newMessage.author.tag}\`\n- Channel ${newMessage.channel}\n- Message \`${newMessage.content.substring(0, 999)}\``)
                    .setColor(config.color);
                    logChannel.send(logEmbed);

                    let warnEmbed = new Discord.RichEmbed()
                    .setDescription(`**Anti-Swearing**\nSwearing is not allowed on this server, ${newMessage.author.tag}!`).setColor(config.color);
                    
                    return newMessage.channel.send(warnEmbed).then(m => m.delete(2000));
                }
            }
        }
            let advertisement = ["https://", "http://", "www.", "discord.gg/", "youtube.com/"];
            if(guild.addons.automod.noLinks === true) {
                for(var a in advertisement) {
                    if(newMessage.content.toLowerCase().includes(advertisement[a])) {
                        newMessage.delete();
                        let logEmbed = new Discord.RichEmbed()
                    .setDescription(`**Anti-Advertising**\n- User \`${newMessage.author.tag}\`\n- Channel ${newMessage.channel}\n- Message \`${newMessage.content.substring(0, 999)}\``)
                    .setColor(config.color);
                    logChannel.send(logEmbed);

                    let warnEmbed = new Discord.RichEmbed()
                    .setDescription(`**Anti-Advertising**\nAdvertising is not allowed on this server, ${newMessage.author.tag}!`).setColor(config.color);
                    
                    return newMessage.channel.send(warnEmbed).then(m => m.delete(2000));
                    }
                }
            }

        if(guild.addons.advancedLogs.messageEdited === true) {

                if(newMessage.content === oldMessage.content) {
                    return;
                }

                if(oldMessage.content.length > 900) {
                    oldMessage.content = oldMessage.content.substr(0,899) + "...";
                }

                if(newMessage.content.length > 900) {
                    newMessage.content = newMessage.content.substr(0,899) + "...";
                }

                let editMessage = new Discord.RichEmbed()
                .setColor(config.color)
                .setAuthor(newMessage.author.tag, newMessage.author.avatarURL)
                .setDescription(`**${newMessage.author} edited their message from**\`\`\`${oldMessage.content}\`\`\` **to** \`\`\`${newMessage.content}\`\`\`\n[Jump To Message](${newMessage.url})`).setTimestamp();
                return logChannel.send(editMessage);
        }
    });
};