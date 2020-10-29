const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {

    await msg.delete();
    Dashboard.findOne({guildID: msg.guild.id}, async (err, guild) => {
        if(err) return console.log(err);

        if(guild.addons.levels.enabled === "false"){
            return;
        }

    let embedRes = "";
    let leaderboardRes = "";
    Users.find({
        guildID: msg.guild.id
    }).sort([
        ["levels.xp", "descending"]
    ]).exec((err, res) => {
        if(err) console.log(err);



        if(res.length === 0) {
            leaderEmbed.setDescription(`We didn't find any users with experience.`);
        } else if(res.length < 10) {
            for(i = 0; i < res.length; i++) {
                let member = msg.guild.members.get(res[i].userID) || "User Left";
                if(res[i].userID === msg.author.id) {
                leaderboardRes += `> \`${msg.author.tag}\` is currently on the **${i+1}. place** on the leaderboard.\n`
                leaderboardRes += `> \`${msg.author.tag}\` currently has \`${res[i].levels.xp}\` exp and \`${res[i].levels.level}\` levels.`
                }
                if(member === "User Left") {
                    embedRes += `**#${i + 1}** | ${member} | **Exp** \`${res[i].levels.xp}\` **Level** \`${res[i].levels.level}\`\n`;
                } else {
                    embedRes += `**#${i + 1}** | ${member.user.tag} | **Exp** \`${res[i].levels.xp}\` **Level** \`${res[i].levels.level}\`\n`;
                }
            }
        } else {
            for (i = 0; i < 10; i++) {
                let member = msg.guild.members.get(res[i].userID) || "User Left";
                if(member === "User Left") {
                    embedRes += `**#${i + 1}** | ${member} | **Exp** \`${res[i].levels.xp}\` **Level** \`${res[i].levels.level}\`\n`;
                } else {
                    embedRes += `**#${i + 1}** | ${member.user.tag} | **Exp** \`${res[i].levels.xp}\` **Level** \`${res[i].levels.level}\`\n`;
                }
            }
            for(i = 0; i < res.length; i++) {
                let member = msg.guild.members.get(res[i].userID) || "User Left";
                if(res[i].userID === msg.author.id) {
                    leaderboardRes += `> \`${msg.author.tag}\` is currently on the **${i+1}. place** on the leaderboard.\n`
                    leaderboardRes += `> \`${msg.author.tag}\` currently has \`${res[i].levels.xp}\` exp and \`${res[i].levels.level}\` levels.`
            }
        }
    }
        let leaderEmbed = new Discord.RichEmbed()
        .setDescription(`**Leaderboards** | **${msg.guild.name}**\n\n${embedRes}\n\n${leaderboardRes}`)
        .setColor(config.color);

        return channel.send(leaderEmbed);

    });

    
    });
};