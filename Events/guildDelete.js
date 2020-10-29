const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
module.exports.run = async (client, guild, config) => {
    Dashboard.findOne({guildID: guild.id}, async (err, guildDB) => {        if(err) return console.log(err);


        if(err) console.log(err);
    
        if(guildDB.blacklisted.blacklisted === true) {
            return;  
        } else {
            
        let botOwner = client.users.get("165144718731116544");
    
    
        let logEmbed = new Discord.RichEmbed()
        .setDescription(`-------------------------------------------------------------------------------\n**Left a server!**\nGuild **${guild.name}** | ID **${guild.id}**\nMembers **${guild.memberCount}** (Bots: **${guild.members.filter(member => member.user.bot).size}**)\nGuild Count **${client.guilds.size}** | User Count **${client.users.size}**\n-------------------------------------------------------------------------------`)
        .setColor(config.color);
    
        botOwner.send(logEmbed);
        }
    });
}