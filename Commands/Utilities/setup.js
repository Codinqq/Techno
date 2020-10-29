const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, settings) => {
        if (err) return console.log(err);

        msg.delete();
        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Setup** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        let settingupEmbed = new Discord.RichEmbed()
            .setDescription(`**Setup**\n> Setting up the server for Techno.`)
            .setColor(config.color);

        channel.send(settingupEmbed).then(async m => {


            let staffRole = await msg.guild.roles.find(r => r.name === "Staff");

            if (!staffRole) {
                guild.createRole({
                    name: "Staff",
                    color: config.color
                }).then(s => {
                    staffRole = guild.roles.find(r => r.id === s.id);
                });
            }
            let everyoneRole = guild.defaultRole;


            // Creating the Events Channel.
            msg.guild.createChannel("Techno | Events", {
                type: "category"
            }).then(async eventCategory => {
                await msg.guild.createChannel("blogs", {
                    type: "text"
                }).then(async logChannel => {
                    await logChannel.setParent(eventCategory);
                    await logChannel.setTopic("Techno | Logging Channel");
                    settings.channels.botLogs = logChannel.id;
                    await logChannel.overwritePermissions(staffRole, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    await logChannel.overwritePermissions(everyoneRole, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });
                });
                msg.guild.createChannel("applications", {
                    type: "text"
                }).then(async applicationChannel => {
                    await applicationChannel.setTopic("Techno | Logging Channel");
                    await applicationChannel.setParent(eventCategory);
                    await applicationChannel.overwritePermissions(staffRole, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    await applicationChannel.overwritePermissions(everyoneRole, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    });
                });
            });
            // Information Category
            msg.guild.createChannel("Techno | Information", {
                type: "category"
            }).then(async infoCategory => {
                infoCategory.setPosition("0");

                await msg.guild.createChannel("rules", {
                    type: "text"
                }).then(async rulesChannel => {
                    await rulesChannel.setTopic("Techno | Rules");
                    await rulesChannel.setParent(infoCategory);
                    await rulesChannel.overwritePermissions(staffRole, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    await rulesChannel.overwritePermissions(everyoneRole, {
                        SEND_MESSAGES: false,
                    });
                });
                await msg.guild.createChannel("announcements", {
                    type: "text"
                }).then(async announcementChannel => {
                    await announcementChannel.setTopic("Techno | Announcements");
                    await announcementChannel.setParent(infoCategory);
                    await announcementChannel.overwritePermissions(staffRole, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    await announcementChannel.overwritePermissions(everyoneRole, {
                        SEND_MESSAGES: false,
                    });
                });
                await msg.guild.createChannel("polls", {
                    type: "text"
                }).then(async pollChannel => {
                    await pollChannel.setTopic("Techno | Polls");
                    await pollChannel.setParent(infoCategory);

                    await pollChannel.overwritePermissions(staffRole, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    await pollChannel.overwritePermissions(everyoneRole, {
                        SEND_MESSAGES: false,
                    });
                });
                await msg.guild.createChannel("member-logs", {
                    type: "text"
                }).then(async mLogChannel => {
                    await mLogChannel.setTopic("Techno | Member-Logs");
                    await mLogChannel.setParent(infoCategory);
                    settings.addons.memberLogs.channel = mLogChannel.id;
                    await mLogChannel.overwritePermissions(staffRole, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    });
                    await mLogChannel.overwritePermissions(everyoneRole, {
                        SEND_MESSAGES: false,
                    });
                    m.edit(settingupEmbed.setDescription(`> The server has been set up for Techno.`))

                });

            });
            settings.save().catch(err => console.log(err));

        });

    });
};