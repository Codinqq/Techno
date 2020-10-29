const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
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

Users.findOneAndDelete({userID: member.id, guildID: member.guild.id}, async (err, user) => {
if(err) console.log(err.stack);
});

if(!guild){
const newConfig = new Dashboard({
guildID: member.guild.id,
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

let mlogChannel = member.guild.channels.find(c => c.id === guild.addons.memberLogs.channel);
if(!mlogChannel){
mlogChannel = member.guild.channels.find(c => c.name === "memberlogs");
}             
let leaveMessage = guild.addons.memberLogs.messages.leave;
leaveMessage = leaveMessage.replace("[USER]", member.user.tag).replace("[COUNT]", member.guild.memberCount).replace("[SERVER]", member.guild.name).replace("[USER]", member.tag).replace("[COUNT]", member.guild.memberCount).replace("[SERVER]", member.guild.name);
let leaveEmbed = new Discord.RichEmbed()
.setDescription(leaveMessage)
.setColor(config.color);
if(mlogChannel){
mlogChannel.send(leaveEmbed);
}
Users.remove({guildID: member.guild.id, userID: member.user.id});
let logEmbed = new Discord.RichEmbed()
.setDescription(`${member.user.tag} left the server!`)
.setColor(config.color);
let logChannel = member.guild.channels.find(c => c.id === guild.channels.botLogs);
if(!logChannel){
logChannel = member.guild.channels.find(c => c.name === "blogs");
if(!logChannel) return;
}        
return logChannel.send(logEmbed);
});

};