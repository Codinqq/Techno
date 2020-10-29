const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async (client, oldGuild, newGuild, config) => {
    await Dashboard.findOne({guildID: newGuild.id}, (err, guild) => {
        
        if(err) console.log(err.stack);
        
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
        
if(!guild.addons.advancedLogs.guildUpdate) {
                    guild.addons.advancedLogs.guildUpdate === false;
                    return guild.save().catch(err => console.log(err.stack));
                }
        if(guild.addons.advancedLogs.guildUpdate === true) {

        if(oldGuild.name != newGuild.name) {

            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Guild Updated** | Name-Update
            > The guild's name was changed from **${oldGuild.name}** to **${newGuild.name}**`)

            let logChannel = newGuild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = newGuild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }

        if(oldGuild.iconURL != newGuild.iconURL) {
            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setAuthor("Guild Updated | Icon-Update", newGuild.iconURL)
            .setDescription(`> The guild's icon was changed.`)
            .setThumbnail(oldGuild.iconURL);

            let logChannel = newGuild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = newGuild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }

        if(oldGuild.owner != newGuild.owner) {
            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Guild Updated** | Owner-Update\n> The guild's owner was changed from **${oldGuild.owner}** to **${newGuild.owner}**`);

            let logChannel = newGuild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = newGuild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }

        if(oldGuild.verificationLevel != newGuild.verificationLevel) {

            if(oldGuild.verificationLevel == 0) {
                oldGuild.verificationLevel = "None";
            }
            if(oldGuild.verificationLevel == 1) {
                oldGuild.verificationLevel = "Low (Verified Email)";
            }
            if(oldGuild.verificationLevel == 2) {
                oldGuild.verificationLevel = "Medium (Registered for 5 minutes)";
            }
            if(oldGuild.verificationLevel == 3) {
                oldGuild.verificationLevel = "High (Server-Member for 10 minutes)";
            }
            if(oldGuild.verificationLevel == 4) {
                oldGuild.verificationLevel = "Highest (Verified phone)";
            }

            if(newGuild.verificationLevel == 0) {
                newGuild.verificationLevel = "None";
            }
            if(newGuild.verificationLevel == 1) {
                newGuild.verificationLevel = "Low (Verified Email)";
            }
            if(newGuild.verificationLevel == 2) {
                newGuild.verificationLevel = "Medium (Registered for 5 minutes)";
            }
            if(newGuild.verificationLevel == 3) {
                newGuild.verificationLevel = "High (Server-Member for 10 minutes)";
            }
            if(newGuild.verificationLevel == 4) {
                newGuild.verificationLevel = "Highest (Verified phone)";
            }


            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Guild Updated** | Verification-Level\n> The guild's verification level was changed from **${oldGuild.verificationLevel}** to **${newGuild.verificationLevel}**`);

            let logChannel = newGuild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = newGuild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }

        if(oldGuild.region != newGuild.region) {
            let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Guild Updated** | Region-Update\n> The guilds region was changed from **${oldGuild.region}** to **${newGuild.region}**`);

            let logChannel = newGuild.channels.find(c => c.id === guild.channels.botLogs);
            if(!logChannel){
                logChannel = newGuild.channels.find(c => c.name === "blogs");
            }
    
            logChannel.send(embed);
        }
    }
    });
    
}