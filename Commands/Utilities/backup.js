const mongoose = require("mongoose");
const Backup = require("../../models/backup.js");
const Dashboard = require("../../models/dashboard.js");

const moment = require("moment");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {

        if (msg.author.id != "165144718731116544") return;
        msg.delete();
        Dashboard.findOne({
                guildID: msg.guild.id
        }, async (err, guild) => {
                Backup.findOne({
                        guildID: msg.guild.id
                }, async (err, backup) => {
                        let date = "";

                        if (!backup) {
                                date = "Never"
                        } else {
                                date = backup.date + " UTC"
                        }

                        let embed = new Discord.RichEmbed()
                                .setDescription(`**Backups**
            > Last backup - **${date}**
            \n> Create an backup
            - \`${guild.prefix}backup create\`
            > Rollback to last backup.
            - \`${guild.prefix}backup rollback\``)
                                .setColor(config.color);

                        if (!args[0]) {
                                return msg.channel.send(embed);
                        }

                        if (args[0].toLowerCase() === "rollback") {

                                msg.channel.send("rollback starting");

                                for (var i in backup.channels) {

                                        var server = client.guilds.get(msg.guild.id);
                                        for (var i = 0; i < server.channels.array().length; i++) {
                                                server.channels.array()[i].delete();
                                        }

                                        if (backup.channels[i].type === "text") {

                                                msg.guild.createChannel(backup.channels[i].name, {
                                                        type: "text",
                                                        position: backup.channels[i].position,
                                                        topic: backup.channels[i].topic
                                                }).then(channel => {
                                                        if (backup.channels[i].parent != "") {

                                                                for (var c in backup.channels) {

                                                                        if (backup.channels[c].name === backup.channels[i].parent) {

                                                                                msg.guild.createChannel(backup.channels[c].name, {
                                                                                        type: "category",
                                                                                        position: backup.channels[c].position
                                                                                }).then(c => {
                                                                                        channel.setParent(c.id);
                                                                                });

                                                                        }

                                                                }

                                                        }
                                                });



                                        }

                                }

                        }

                        if (args[0].toLowerCase() === "create") {


                                let messageCollection = new Discord.Collection();
                                let bansCollection = new Discord.Collection();
                                let channelCollection = new Discord.Collection();
                                let memberCollection = new Discord.Collection();
                                let rolesCollection = new Discord.Collection();

                                let messageArray = [];
                                let channelArray = [];
                                let rolesArray = [];
                                let bansArray = [];
                                let memberArray = [];

                                let channelMsgs = await msg.channel.fetchMessages({
                                        limit: 10
                                }).catch(err => console.log(err));

                                messageCollection = messageCollection.concat(channelMsgs);

                                while (channelMsgs.size === 10) {
                                        let lastMsgId = channelMsgs.lastKey();
                                        channelMsgs = await msg.channel.fetchMessages({
                                                limit: 10,
                                                before: lastMsgId
                                        }).catch(err => console.log(err));
                                        if (channelMsgs) messageCollection = messageCollection.concat(channelMsgs);
                                }

                                let msgs = messageCollection.array();
                                let i = 0;
                                msgs.forEach(msg => {

                                        if (i === 10) {
                                                return;
                                        } else {

                                                if (!msg.content || msg.content === "") {
                                                        return;
                                                } else {
                                                        i++;
                                                        let json = {
                                                                author: msg.author.tag,
                                                                content: msg.content,
                                                                channelName: msg.channel.name
                                                        }
                                                        messageArray.push(json);
                                                }

                                        }

                                });

                                let guildBans = await msg.guild.fetchBans().catch(err => console.log(err));
                                bansCollection = bansCollection.concat(guildBans);


                                let bans = bansCollection.array();
                                i = 0;
                                bans.forEach(ban => {

                                        let json = [ban.id];

                                        bansArray.push(ban.id);

                                });


                                msg.guild.channels.forEach(channel => {

                                        if (channel.topic === "category") {
                                                let json = {
                                                        name: channel.name,
                                                        topic: channel.topic,
                                                        type: channel.type,
                                                        position: channel.position
                                                }
                                                channelArray.push(json);

                                        } else {
                                                if (!channel.parent) {
                                                        let json = {
                                                                name: channel.name,
                                                                topic: channel.topic,
                                                                type: channel.type,
                                                                position: channel.position,
                                                                nsfw: channel.nsfw
                                                        }
                                                        channelArray.push(json);
                                                } else {
                                                        let json = {
                                                                name: channel.name,
                                                                topic: channel.topic,
                                                                type: channel.type,
                                                                parent: channel.parent.name,
                                                                position: channel.position,
                                                                nsfw: channel.nsfw
                                                        }
                                                        channelArray.push(json);
                                                }

                                        }

                                });

                                msg.guild.roles.forEach(role => {

                                        if (role.name === "@everyone") return;

                                        let json = {
                                                name: role.name,
                                                color: role.color,
                                                position: role.position,
                                                perms: role.permissions,
                                                mentionable: role.mentionable,
                                        };

                                        rolesArray.push(json);

                                });

                                msg.guild.members.forEach(member => {


                                        let rolesColArray = [];

                                        member.roles.forEach(roles => {

                                                if (roles.name === "@everyone") return;
                                                rolesColArray.push(roles.name);

                                        })

                                        let json = {
                                                id: member.user.id,
                                                roles: rolesColArray
                                        }

                                        memberArray.push(json);

                                });

                                if (!backup) {
                                        const backUp = new Backup({
                                                guildID: msg.guild.id,
                                                date: moment.utc(new Date()).format("MMMM Do YYYY, HH:mm"),
                                                guild: msg.guild.name,
                                                chats: messageArray,
                                                bans: bansArray,
                                                channels: channelArray,
                                                roles: rolesArray,
                                                members: memberArray

                                        })
                                        let embed = new Discord.RichEmbed()
                                                .setColor(config.color)
                                                .setDescription(`**Backups**
            > A new backup has been made.`)

                                        msg.channel.send(embed).then(m => m.delete(3000));
                                        return backUp.save().catch(err => console.log(err));
                                } else {
                                        backup.date = moment.utc(new Date()).format("MMMM Do YYYY, HH:mm");
                                        backup.chats = messageArray;
                                        backup.bans = bansArray;
                                        backup.channels = channelArray;
                                        backup.roles = rolesArray;
                                        backup.members = memberArray;

                                        backup.save().catch(err => console.log(err));

                                        let embed = new Discord.RichEmbed()
                                                .setColor(config.color)
                                                .setDescription(`**Backups**
            > A new backup has been made.`);

                                        return msg.channel.send(embed).then(m => m.delete(3000));

                                }


                        }


                })
        })





};