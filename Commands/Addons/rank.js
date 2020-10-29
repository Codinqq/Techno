const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const math = require("mathjs");

const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();

    
    Dashboard.findOne({guildID: msg.guild.id}, async (err, guild) => {
                if(err) return console.log(err);

        if(guild.addons.levels.enabled === "false"){
            return;
        }

    let embedRes = "";
    let lvlLB = "";
    let userMember = msg.guild.member(msg.mentions.users.first()) || msg.guild.members.find(m => m.id === args[0]);
    

    let userTag;
    if(!userMember) {
        userMember = msg.author;
        userTag = msg.author;
        userUser = msg.user;
        userM = msg.member;
        userCreated = msg.member.user.createdAt;
    } else {
        userTag = userMember.user;
        userUser = userMember.user;
        userM = userMember;
        userCreated = userMember.user.createdAt;
    }
    
    if(userTag.bot) return;

        await Users.find({
            guildID: msg.guild.id
        }).sort([
            ["xp", "descending"]
        ]).exec((err, res) => {
            if(err) console.log(err);
                for(i = 0; i < res.length; i++) {
                    if(res[i].userID === userTag.id) {
                    lvlLB += `> ${userTag.username} is currently on the ${i+1}. place on the leaderboard.`;
        }
    };
    });

    await Users.findOne({guildID: msg.guild.id, userID: userTag.id}, (err, user) => {

        let levelUpXP = math.evaluate(35*(user.levels.level+1));

        let requiredxp = Math.abs(levelUpXP - user.levels.xp);
        let levelEmbed = new Discord.RichEmbed()
        .setDescription(`**Rank**\nUser | \`${userTag.tag}\`\nLevel | \`${user.levels.level}\`\nXP | \`${user.levels.xp}\`\n${lvlLB}`)
        .setColor(config.color)
        .setFooter(`Required XP to level up: ${requiredxp}`);
        return channel.send(levelEmbed);
    })
    })
}
