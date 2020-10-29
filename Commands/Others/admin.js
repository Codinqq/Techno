const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Blacklist = require("../../models/blacklist.js");
const Application = require("../../models/application.js");
const Admin = require("../../models/admin.js");
const Users = require("../../models/users.js");
const emoji = require('../../emojis.js');
const math = require("mathjs");
const figlet = require('figlet');
const hastebin = require("hastebin-gen");

module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {


    function clean(text) {
        if (typeof (text) === "string")
            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        else
            return text;
    }

    Admin.findOne({
        userID: msg.author.id
    }, async (err, admin) => {
        if (err) return console.log(err);

        Dashboard.findOne({
            guildID: msg.guild.id
        }, async (err, dashboard) => {
            if (err) return console.log(err);

            if (!admin) return;

            msg.delete();

            if (!args[0]) {

                function duration(ms) {
                    const sec = Math.floor((ms / 1000) % 60).toString();
                    const min = Math.floor((ms / (1000 * 60)) % 60).toString();
                    const hours = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
                    const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();

                    return `${days.padStart(1, "0")} d, ${hours.padStart(2, "0")} h, ${min.padStart(2, "0")} m, ${sec.padStart(2, "0")} s`;

                }

                let rank;
                if (admin.moderator === true) {
                    rank = "Moderator";
                }
                if (admin.admin === true) {
                    rank = "Administrator";
                }
                if (admin.owner === true) {
                    rank = "Developer";
                }

                let adminEmbed = new Discord.RichEmbed()
                    .setDescription(`**Admin Commands**\nWelcome, ${msg.author.username}!\nRank: ${rank}\n\n> Current Ping: Pinging...\n> Current Latency: Pinging...\n> Uptime: ${duration(client.uptime)}\n\n> To get all the commands: \`${dashboard.prefix}admin help\``)
                    .setColor(config.color);

                return channel.send(adminEmbed).then(m => m.edit(adminEmbed.setDescription(`**Admin Commands**\nWelcome, ${msg.author.username}!\nRank: ${rank}\n\n> Current Ping: ${Math.round(m.createdTimestamp - msg.createdTimestamp)}ms\n> Current Latency: ${Math.round(Math.round(client.ping))}ms\n> Uptime: ${duration(client.uptime)}\n> To get all the commands: \`${dashboard.prefix}admin help\``)));

            }

            let settingArg = args[0].toLowerCase();


            if (settingArg === "promote") {
                if (admin.owner === true) {

                    Admin.findOne({
                        userID: args[1]
                    }, async (err, promoteAdmin) => {
                        if (err) return console.log(err);

                        let promoteUser = client.users.get(args[1]);

                        if (!promoteAdmin) {
                            const newAdmin = new Admin({
                                userID: args[1],
                                moderator: true,
                                admin: false,
                                owner: false,
                            })
                            newAdmin.save().catch(err => console.log(err));


                            let promoteEmbed = new Discord.RichEmbed()
                                .setDescription(`${promoteUser.tag} was promoted to Bot-Moderator.`)
                                .setColor(config.color);

                            let promoteEmbedDm = new Discord.RichEmbed()
                                .setDescription(`You just got promoted to Bot-Moderator by Codinq.`)
                                .setColor(config.color);

                            promoteUser.send(promoteEmbedDm)
                            return msg.channel.send(promoteEmbed).then(m => m.delete(6000));
                        }


                        if (promoteAdmin.moderator === true) {
                            promoteAdmin.admin = true;
                            promoteAdmin.moderator = false;
                            promoteAdmin.save().catch(err => console.log(err));

                            let promoteEmbed = new Discord.RichEmbed()
                                .setDescription(`${promoteUser.tag} was promoted to Admin.`)
                                .setColor(config.color);

                            let promoteEmbedDm = new Discord.RichEmbed()
                                .setDescription(`You just got promoted to Bot-Admin by Codinq.`)
                                .setColor(config.color);

                            promoteUser.send(promoteEmbedDm)
                            return msg.channel.send(promoteEmbed).then(m => m.delete(6000));
                        }



                    });

                } else {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`You do not have access to this command. (Only owners allowed)`)
                        .setColor(config.color);
                    return channel.send(noAccessEmbed).then(m => m.delete(4000));
                }
            }

            if (settingArg === "help") {
                let helpEmbed = new Discord.RichEmbed()
                    .setDescription(`**Admin Commands**\n> \`Promote\` | Promote a user (Only owner)\n> \`Demote\` | Demote a user (Only owner)\n> \`Eval\` | Evaluate some code (Only owner)\n> \`Restart\` | Restart the bot (Only owner)\n> \`Announce\` | Announce a message to all servers (Admins and up)\n> \`Blacklist\` | Blacklist a user/guild from using the bot. (Admins and up)\n> \`Whitelist\` | Whitelist a user/guild so they can use the bot (Admins and up)\n> \`Leave\` | Leave a guild if it is suspicious (Admins and up)\n> \`Checkuser\` | Check an user (Moderators and up) **Currently not working**\n> \`Checkguild\` | Check a guild (Moderators and up)`)
                    .setColor(config.color);
                return msg.author.send(helpEmbed);
            }

            if (settingArg === "demote") {
                if (admin.owner === true) {

                    Admin.findOne({
                        userID: args[1]
                    }, async (err, promoteAdmin) => {
                        if (err) return console.log(err);

                        let promoteUser = client.users.get(args[1]);

                        if (promoteAdmin.moderator === true) {
                            Admin.deleteOne({
                                userID: args[1]
                            }).catch(err => console.log(err));

                            let promoteEmbed = new Discord.RichEmbed()
                                .setDescription(`${promoteUser.tag}s moderator perks got removed`)
                                .setColor(config.color);

                            let promoteEmbedDm = new Discord.RichEmbed()
                                .setDescription(`Your moderator perks got removed.`)
                                .setColor(config.color);

                            promoteUser.send(promoteEmbedDm)
                            return msg.channel.send(promoteEmbed).then(m => m.delete(6000));

                        }

                        if (promoteAdmin.admin === true) {
                            promoteAdmin.moderator = true;
                            promoteAdmin.admin = false;
                            promoteAdmin.save().catch(err => console.log(err));

                            let promoteEmbed = new Discord.RichEmbed()
                                .setDescription(`${promoteUser.tag} was demoted to Moderator.`)
                                .setColor(config.color);

                            let promoteEmbedDm = new Discord.RichEmbed()
                                .setDescription(`You just got demoted to Bot-Moderator by Codinq.`)
                                .setColor(config.color);

                            promoteUser.send(promoteEmbedDm)
                            return msg.channel.send(promoteEmbed).then(m => m.delete(6000));
                        }
                    });

                } else {
                    let noAccessEmbed = new Discord.RichEmbed()
                        .setDescription(`You do not have access to this command. (Only owners allowed)`)
                        .setColor(config.color);
                    return channel.send(noAccessEmbed).then(m => m.delete(4000));
                }
            }

            if (settingArg === "eval") {

                if (admin.owner === true) {

                    try {
                        const code = args.slice(1).join(" ");
                        let evaled = eval(code);

                        if (typeof evaled !== "string")
                            evaled = require("util").inspect(evaled);

                        if (evaled.length < 2000) {
                            let embed1 = new Discord.RichEmbed()
                                .setTitle("Admin Commands - Eval")
                                .setDescription(`\`\`\`${clean(evaled)}\`\`\``)
                                .setColor(config.color);
                            return channel.send(embed1);
                        } else {
                            hastebin(clean(evaled), {
                                extension: "js"
                            }).then(haste => {
                                let embed1 = new Discord.RichEmbed()
                                    .setDescription(`**Admin Commands - Eval**\n> ${haste}`)
                                    .setColor(config.color);
                                return channel.send(embed1);
                            }).catch(error => {
                                console.error(error);
                            });
                        }


                    } catch (err) {
                        let embed1 = new Discord.RichEmbed()
                            .setDescription(`**Admin Commands - Eval**\n> **Error**\n\`\`\`${clean(err)}\`\`\``)
                            .setColor(config.color);
                        return channel.send(embed1);
                    }
                }

            }

            if (settingArg === "announce") {
                if (admin.admin === true) {
                    try {
                        let announcement = args.slice(1).join(" ");
                        client.guilds.forEach(g => {
                            Dashboard.findOne({
                                guildID: g.id
                            }, async (err, guildDB) => {
                                if (err) return console.log(err);

                                let bLogChannel = g.channels.find(c => c.id === guildDB.channels.botLogs);
                                if (!bLogChannel || !guildDB) {
                                    bLogChannel = g.channels.find(c => c.name === "blogs");
                                }
                                if (!bLogChannel) {
                                    return;
                                }

                                let announcementEmbed = new Discord.RichEmbed()
                                    .setDescription(`**Global Announcement**\n> ${announcement}`)
                                    .setColor(config.color)
                                    .setFooter(`Announcement by ${msg.author.tag}`)
                                    .setTimestamp();

                                return bLogChannel.send(announcementEmbed)
                            })
                        })


                    } catch (err) {
                        console.log(err)
                    };
                }
            }

            if (settingArg === "restart") {
                if (admin.owner === true) {

                    async function restart(m) {
                        await client.destroy();

                        await client.login(config.token);
                        await m.edit(embed.setDescription(`**Admin Commands** | **Restarted**\n> Techno has restarted.`));
                        m.delete(5000);
                    }

                    let embed = new Discord.RichEmbed()
                        .setDescription(`**Admin Commands** | **Restarting**\n> Restarting Techno.`)
                        .setColor(config.color);

                    channel.send(embed).then(async m => {
                        restart(m);
                    });
                }
            }
            if (settingArg === "checkuser") {
                let blacklisted;

                async function checkUser(userID) {
                    await Blacklist.findOne({
                        userID: userID
                    }, async (err, blacklistDB) => {
                        if (err) return console.log(err);

                        if (!blacklistDB) {
                            const newBlacklist = new Blacklist({
                                userID: userID,
                                blacklisted: false,
                                reason: "",
                                blacklister: ""
                            });
                            newBlacklist.save().catch(err => console.log(err));
                        } else {
                            if (blacklistDB.blacklisted === true) {
                                blacklisted = `BLACKLISTED - "${blacklistDB.reason}" - ${blacklistDB.blacklister}`;
                            } else {
                                blacklisted = `NOT BLACKLISTED`;
                            }
                            let user = await client.users.find(u => u.id === userID);

                            let presence = "";
                            if (user.presence.status === "dnd") {
                                presence = "Do Not Disturb"
                            }
                            if (user.presence.status === "online") {
                                presence = "Online"
                            }
                            if (user.presence.status === "idle") {
                                presence = "Idle"
                            }
                            if (user.presence.status === "offline") {
                                presence = "Offline / Invisible"
                            }

                            let userEmbed = await new Discord.RichEmbed()
                                .setDescription(`**Admin Commands** | **Check User**\n> Name \`${user.tag}\`\n> ID \`${user.id}\`\n> Currently Playing \`${user.presence.game}\`\n> Status \`${presence}\`\n\n> Blacklisted \`${blacklisted}\``)
                            return await msg.channel.send(userEmbed);

                        }

                    })
                }

                if (admin.moderator === true) {
                    checkUser(args[1]);
                } else if (admin.administrator === true) {
                    checkUser(args[1]);
                } else if (admin.owner === true) {
                    checkUser(args[1]);
                }
            }

            if (settingArg === "checkguild") {

                let blacklisted;

                async function checkGuild(userID) {
                    await Dashboard.findOne({
                        guildID: userID
                    }, async (err, configDB) => {
                        if (err) return console.log(err);

                        if (configDB.blacklisted === true) {
                            blacklisted = `BLACKLISTED - "${configDB.reason}" - ${configDB.blacklister}`;
                        } else {
                            blacklisted = `NOT BLACKLISTED`;
                        }
                        let guilds = await client.guilds.find(g => g.id === userID);
                        let userEmbed = await new Discord.RichEmbed()
                            .setDescription(`**Admin Commands** | **Check Guild**\n> Name \`${guilds}\`\n> ID \`${guilds.id}\`\n> Member-Count \`${guilds.memberCount}\` (Bots: **${guilds.members.filter(member => member.user.bot).size}**)\n\n> Blacklisted \`${blacklisted}\``)
                        return await msg.channel.send(userEmbed);

                    })
                }

                if (admin.moderator === true) {
                    checkGuild(args[1]);
                } else if (admin.administrator === true) {
                    checkGuild(args[1]);
                } else if (admin.owner === true) {
                    checkGuild(args[1]);
                }

            }

            if (settingArg === "blacklist") {
                let type = args[1].toLowerCase();
                if (admin.admin === true) {
                    if (type === "user") {

                        let user = client.users.get(args[2]);
                        if (args.slice(3).join(" ")) {
                            let noReasonEmbed = new Discord.RichEmbed()
                                .setDescription(`You need to add a reason`)
                                .setColor(config.color);
                            return channel.send(noReasonEmbed);
                        }
                        const newBlacklist = new Blacklist({
                            userID: user.id,
                            blacklisted: true,
                            reason: args.slice(3).join(" "),
                            blacklister: msg.author.tag
                        });
                        newBlacklist.save().catch(err => console.log(err));

                        let blacklistEmbed = new Discord.RichEmbed()
                            .setDescription(`**Admin Commands** | **Blacklist**\n> Blacklisted: \`${user.tag}\`\n> ID: \`${user.id}\`\n> Reason: \`${args.slice(3).join(" ")}\``)
                            .setColor(config.color);

                        channel.send(blacklistEmbed);

                    }
                    if (type === "guild") {


                        let guild = client.guilds.get(args[2]);

                        Dashboard.findOne({
                            guildID: args[2]
                        }, async (err, dashboard) => {
                            if (err) return console.log(err);

                            if (args.slice(3).join(" ")) {
                                let noReasonEmbed = new Discord.RichEmbed()
                                    .setDescription(`You need to add a reason`)
                                    .setColor(config.color);
                                return channel.send(noReasonEmbed);
                            }
                            dashboard.blacklisted.blacklisted = true;
                            dashboard.blacklisted.message = args.slice(3).join(" ");
                            dashboard.blacklisted.blacklister = msg.author.tag;

                            dashboard.save().catch(err => console.log(err));

                            let blacklistEmbedGuild = new Discord.RichEmbed()
                                .setDescription(`**Admin Commands** | **Blacklist**\n> This guild has been blacklisted.\n> Reason: \`${args.slice(3).join(" ")}\``)
                                .setColor(config.color);

                            let guildChannel = guild.channels.find(c => c.name === "general");

                            guildChannel.send(blacklistEmbedGuild);

                            await guild.leave();

                            let blacklistEmbed = new Discord.RichEmbed()
                                .setDescription(`**Admin Commands** | **Blacklist**\n> Blacklisted: \`${guild.name}\`\n> ID: \`${guild.id}\`\n> Reason: \`${args.slice(3).join(" ")}\``)
                                .setColor(config.color);

                            channel.send(blacklistEmbed);

                        });
                    }
                }
            }

            if (settingArg === "whitelist") {
                let type = args[1].toLowerCase();
                if (admin.admin === true) {
                    if (type === "user") {

                        let user = client.users.get(args[2]);

                        const newBlacklist = new Blacklist({
                            userID: args[2],
                            blacklisted: false,
                            blacklister: ""
                        });
                        newBlacklist.save().catch(err => console.log(err));
                        if (args.slice(3).join(" ")) {
                            let noReasonEmbed = new Discord.RichEmbed()
                                .setDescription(`You need to add a reason`)
                                .setColor(config.color);
                            return channel.send(noReasonEmbed);
                        }
                        let blacklistEmbed = new Discord.RichEmbed()
                            .setDescription(`**Admin Commands** | **Blacklist**\n> Whitelisted: \`${args[2]}\`\n> Type: User\n> Reason: \`${args.slice(3).join(" ")}\``)
                            .setColor(config.color);

                        channel.send(blacklistEmbed);

                    }
                    if (type === "guild") {


                        let guild = client.guilds.get(args[2]);

                        Dashboard.findOne({
                            guildID: args[2]
                        }, async (err, dashboard) => {

                            dashboard.blacklisted.blacklisted = false;
                            dashboard.blacklisted.message = "";
                            dashboard.blacklisted.blacklister = "";

                            dashboard.save().catch(err => console.log(err));
                            if (args.slice(3).join(" ")) {
                                let noReasonEmbed = new Discord.RichEmbed()
                                    .setDescription(`You need to add a reason`)
                                    .setColor(config.color);
                                return channel.send(noReasonEmbed);
                            }
                            let blacklistEmbed = new Discord.RichEmbed()
                                .setDescription(`**Admin Commands** | **Blacklist**\n> Whitelisted: \`${args[2]}\`\n> Reason: \`${args.slice(3).join(" ")}\``)
                                .setColor(config.color);

                            channel.send(blacklistEmbed);

                        });
                    }
                }
            }

            if (settingArg === "leave") {
                if (admin.admin === true) {
                    let guild = client.guilds.get(args[1]);
                    let leaveEmbedG = new Discord.RichEmbed()
                        .setDescription(`**Leaving Guild**\n> After recent incidents, we have decided that Techno should leave this guild.\n> If you want Techno back into the guild, invite Techno.\n> If you continue to break TOS, then we will blacklist this guild.`).setColor(config.color);
                    let guildChannel = guild.channels.find(c => c.name === "general");

                    guildChannel.send(leaveEmbedG);

                    let leaveEmbed = new Discord.RichEmbed()
                        .setDescription(`**Admin Commands** | **Leave Guilds**\n> Left the guild named: ${guild.name}\n> ID: ${guild.id}`).setColor(config.color);
                    channel.send(leaveEmbed);
                    return guild.leave();
                }

            }

        });
    });

};