const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const emoji = require('../../emojis.js');
const Discord = require("discord.js");
module.exports.run = async (client, msg, channel, args, config, guild) => {
    msg.delete();

    if (!msg.member.hasPermission("ADMINISTRATOR") || msg.author.id != "165144718731116544") {
        let noAccessEmbed = new Discord.RichEmbed()
            .setDescription(`**Dashboard** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
            .setColor(config.color);
        return channel.send(noAccessEmbed);
    }
    Dashboard.findOne({
        guildID: msg.guild.id
    }, (err, settings) => {
        if (err) return console.log(err);

        let botLogs = settings.channels.botLogs;
        if (botLogs === false) {
            botLogs = "Not Defined";
        }

        let bLogsChannel = msg.guild.channels.find(c => c.id === botLogs);
        if (!bLogsChannel) {
            if (!msg.guild.channels.find(c => c.name === "blogs")) {
                botLogs = "\`Not Defined\`";
            } else {
                botLogs = msg.guild.channels.find(c => c.name === "blogs");
            }
        } else {
            botLogs = bLogsChannel;
        }

        let messageEdit = settings.addons.advancedLogs.messageEdited;
        if (messageEdit === true) {
            messageEdit = "Activated";
        } else {
            messageEdit = "Deactivated";
        }

        let messageDelete = settings.addons.advancedLogs.messageRemove;
        if (messageDelete === true) {
            messageDelete = "Activated";
        } else {
            messageDelete = "Deactivated";
        }

        let noSwear = settings.addons.automod.noSwear;
        if (noSwear === true) {
            noSwear = "Activated";
        } else {
            noSwear = "Deactivated";
        }

        let noSpam = settings.addons.automod.noSpam;
        if (noSpam === true) {
            noSpam = "Activated";
        } else {
            noSpam = "Deactivated";
        }

        let noLinks = settings.addons.automod.noLinks;
        if (noLinks === true) {
            noLinks = "Activated";
        } else {
            noLinks = "Deactivated";
        }

        let levels = settings.addons.levels.enabled;
        if (levels === true) {
            levels = "Activated";
        } else {
            levels = "Deactivated";
        }

        let memberlogs = settings.addons.memberLogs.enabled;
        if (memberlogs === true) {
            memberlogs = "Activated";
        } else {
            memberlogs = "Deactivated";
        }

        let emojiUpdate = settings.addons.advancedLogs.emojiEdited;
        if (emojiUpdate === true) {
            emojiUpdate = "Activated";
        } else {
            emojiUpdate = "Deactivated";
        }

        let banAdd = settings.addons.advancedLogs.banAdd;
        if (banAdd === true) {
            banAdd = "Activated";
        } else {
            banAdd = "Deactivated";
        }

        let memberUpdate = settings.addons.advancedLogs.memberUpdate;
        if (memberUpdate === true) {
            memberUpdate = "Activated";
        } else {
            memberUpdate = "Deactivated";
        }
        let guildUpdate = settings.addons.advancedLogs.guildUpdate;
        if (guildUpdate === true) {
            guildUpdate = "Activated";
        } else {
            guildUpdate = "Deactivated";
        }
        let roleUpdate = settings.addons.advancedLogs.roleUpdate;
        if (roleUpdate === true) {
            roleUpdate = "Activated";
        } else {
            roleUpdate = "Deactivated";
        }

        let channelUpdate = settings.addons.advancedLogs.channelUpdate;
        if (channelUpdate === true) {
            channelUpdate = "Activated";
        } else {
            channelUpdate = "Deactivated";
        }

        let joinRole = settings.addons.memberLogs.joinRole;
        if (joinRole === "Not Defined") {
            joinRole = "`None`";
        } else {
            joinRole = msg.guild.roles.find(r => r.id === joinRole);
        }

        let memberLogsChannel = settings.addons.memberLogs.channel;
        if (memberLogsChannel === false) {
            memberLogsChannel = "Not Defined";
        }

        let mLogsChannel = msg.guild.channels.find(c => c.id === memberLogsChannel);
        if (!mLogsChannel) {
            memberLogsChannel = `\`Not Defined\``;
        } else {
            memberLogsChannel = mLogsChannel;
        }

        let prefix = settings.prefix;

        if (!args[0]) {
            let dashboardEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Dashboard**\n**Bot-Settings**\n> Prefix \`${settings.prefix}\` | **${settings.prefix}Dashboard Prefix <New Prefix>**\n> Bot-Logs ${botLogs} | **${settings.prefix}Dashboard BotLogs <Channel Name>**\n\n**Add-ons**\n- Advanced Logs | **${settings.prefix}Dashboard AdvancedLogs**\n> Do \`${settings.prefix}Dashboard AdvancedLogs\` to check out the different modules.\n- Automatic Moderation | **${settings.prefix}Dashboard AutoMod**\n> No Swear \`${noSwear}\`\n> No Spam \`${noSpam}\`\n> No Links \`${noLinks}\`\n- Levels \`${levels}\` | **${settings.prefix}Dashboard Levels**\n> Level-Up Message \`${settings.addons.levels.levelupMessage}\`\n- Member-Logs | **${settings.prefix}Dashboard MemberLogs**\n> Join-Role ${joinRole}\n> Join-Message \`${settings.addons.memberLogs.messages.join}\`\n> Leave-Message \`${settings.addons.memberLogs.messages.join}\`\n> Member-Logs Channel ${memberLogsChannel}`);
            return channel.send(dashboardEmbed);
        }

        if (args[0].toLowerCase() === "prefix") {
            if (!args[1]) {
                let prefixEmbed = new Discord.RichEmbed().setColor(config.color)
                    .setDescription(`**Prefix**\n- Current setting \`${settings.prefix}\`\n\nChange the prefix\n> \`${settings.prefix}Config Prefix <New Prefix>\``);
                return channel.send(prefixEmbed);
            } else {
                Dashboard.findOne({
                    guildID: msg.guild.id
                }, (err, db) => {
                    if (err) return console.log(err);

                    let prefixEmbed = new Discord.RichEmbed().setColor(config.color)
                        .setDescription(`**Prefix**\n- Updated the setting to \`${args[1]}\`\n\nTechno will now only respond to \`${args[1]}\` in this guild.\n\nTo change this do\n> \`${settings.prefix}Dashboard Prefix <New Prefix>\``);
                    db.prefix = args[1];
                    db.save().catch(err => console.log(err));
                    return channel.send(prefixEmbed);
                })
            }
        }

        if (args[0].toLowerCase() === "botlogs") {
            if (!args[1]) {
                if (settings.channels.botLogs === "Not Defined" || !settings.channels.botLogs) {
                    botLogs = "`Not Defined`";
                } else {
                    botLogs = msg.guild.channels.find(c => c.id === settings.channels.botLogs);
                }
                let bLogsEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Bot-Logs**\n- Current Setting ${botLogs}\nThis is the current channel where Techno will send logs from different staff-commands, AdvancedLogs and Automod-Logging.\n\nChange the bot-logging channel\n> \`${prefix}Dashboard botLogs <Channel Name>\``);
                return channel.send(bLogsEmbed);
            } else {
                let botLogsChannel = msg.guild.channels.find(c => c.name === args[1]);
                if (!botLogsChannel) {
                    let errorEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Error**\n- You just stumbled over an error!\n\n> Error \`You didn't define a valid channel-name!\``);
                    return channel.send(errorEmbed);
                }
                settings.channels.botLogs = botLogsChannel.id;
                settings.save().catch(err => console.log(err));
                let bLogsEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Bot-Logs**\n- Current Setting ${botLogsChannel}\n\nThis will now be the channel where Techno will log the staff-commands, advancedLogs, Automod punishments/logs and other logging.\n\nTo change the bot-logging channel\n> \`${settings.prefix}Dashboard botLogs <Channel Name>\``)
                return channel.send(bLogsEmbed);
            }
        }

        if (args[0].toLowerCase() === "advancedlogs") {

            if (!args[1]) {
                let aLogsEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Advanced Logs**\nThis module will log whenever something happends in the guild.\n\n**Message-Edit** \`${messageEdit}\` | **${prefix}Dashboard AdvancedLogs Message-Edit**\n**Message-Delete** \`${messageDelete}\`| **${prefix}Dashboard AdvancedLogs Message-Delete**\n**Emoji-Update** \`${emojiUpdate}\` | **${prefix}Dashboard AdvancedLogs Emoji-Update**\n**Bans** \`${banAdd}\` | **${prefix}Dashboard AdvancedLogs Bans**\n**Member-Update** \`${memberUpdate}\` | **${prefix}Dashboard AdvancedLogs Member-Update**\n**Guild-Update** \`${guildUpdate}\` | **${prefix}Dashboard AdvancedLogs Guild-Update**\n**Role-Update** \`${roleUpdate}\` | **${prefix}Dashboard AdvancedLogs Role-Update**\n\n**Toggle-all** | **${prefix}Dashboard AdvancedLogs All**`);
                return channel.send(aLogsEmbed);
            } else if (args[1].toLowerCase() === "all") {

                if (messageEdit === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- **Enabled** all of the AdvancedLogs-modules!\n\nTo Disable all of the modules, use the command under.\n\n> \`${prefix}Dashboard advancedLogs All\``);
                    settings.addons.advancedLogs.messageEdited = true;
                    settings.addons.advancedLogs.messageRemove = true;
                    settings.addons.advancedLogs.emojiEdited = true;
                    settings.addons.advancedLogs.banAdd = true;
                    settings.addons.advancedLogs.memberUpdate = true;
                    settings.addons.advancedLogs.guildUpdate = true;
                    settings.addons.advancedLogs.roleUpdate = true;
                    settings.addons.advancedLogs.channelUpdate = true;
                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- **Deactivated** all of the AdvancedLogs-modules!\n\nTo Disable the module, use the command under.\n\n> \`${prefix}Dashboard advancedLogs All\``);
                    settings.addons.advancedLogs.messageEdited = false;
                    settings.addons.advancedLogs.messageRemove = false;
                    settings.addons.advancedLogs.emojiEdited = false;
                    settings.addons.advancedLogs.banAdd = false;
                    settings.addons.advancedLogs.memberUpdate = false;
                    settings.addons.advancedLogs.guildUpdate = false;
                    settings.addons.advancedLogs.roleUpdate = false;
                    settings.addons.advancedLogs.channelUpdate = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }

            } else if (args[1].toLowerCase() === "message-edit") {

                if (messageEdit === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Message-Edit\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Message-Edit\``);
                    settings.addons.advancedLogs.messageEdited = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Message-Edit\` module has now been **Deactivated**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Message-Edit\``);
                    settings.addons.advancedLogs.messageEdited = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }


            } else if (args[1].toLowerCase() === "message-delete") {


                if (messageDelete === "Deactivated") {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Message-Delete\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Message-Delete\``);
                    settings.addons.advancedLogs.messageRemove = true;
                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Message-Delete\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Message-Delete\``);
                    settings.addons.advancedLogs.messageRemove = false;
                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }


            } else if (args[1].toLowerCase() === "emoji-update") {


                if (emojiUpdate === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Emoji-Update\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Emoji-Update\``);
                    settings.addons.advancedLogs.emojiEdited = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Emoji-Update\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Emoji-Update\``);
                    settings.addons.advancedLogs.emojiEdited = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }


            } else if (args[1].toLowerCase() === "bans") {


                if (banAdd === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Bans\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Bans\``);
                    settings.addons.advancedLogs.banAdd = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Bans\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Bans\``);
                    settings.addons.advancedLogs.banAdd = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }

            } else if (args[1].toLowerCase() === "member-update") {


                if (memberUpdate === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Member-Update\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Member-Update\``);
                    settings.addons.advancedLogs.memberUpdate = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Member-Update\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Member-Update\``);
                    settings.addons.advancedLogs.memberUpdate = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }


            } else if (args[1].toLowerCase() === "guild-update") {


                if (guildUpdate === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Guild-Update\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Guild-Update\``);
                    settings.addons.advancedLogs.guildUpdate = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Guild-Update\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Guild-Update\``);
                    settings.addons.advancedLogs.guildUpdate = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }

            } else if (args[1].toLowerCase() === "role-update") {


                if (roleUpdate === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Role-Update\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Role-Update\``);
                    settings.addons.advancedLogs.roleUpdate = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Role-Update\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Role-Update\``);
                    settings.addons.advancedLogs.roleUpdate = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }

            } else if (args[1].toLowerCase() === "channel-update") {


                if (channelUpdate === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Channel-Update\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Channel-Update\``);
                    settings.addons.advancedLogs.channelUpdate = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Advanced Logs**\n- The \`Channel-Update\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard advancedLogs Channel-Update\``);
                    settings.addons.advancedLogs.channelUpdate = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }
            }

        }

        if (args[0].toLowerCase() === "automod") {

            if (!args[1]) {
                let aLogsEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**AutoMod**\nThis module will prevent Swearing, Spamming and people Advertising.\n\n**No-Swear** \`${noSwear}\` | **${prefix}Dashboard AutoMod No-Swear**\n**No-Spam** \`${noSpam}\`| **${prefix}Dashboard AutoMod No-Spam**\n**No-Links** \`${noLinks}\`| **${prefix}Dashboard AutoMod No-Links**`);
                return channel.send(aLogsEmbed);
            } else if (args[1].toLowerCase() === "no-swear") {


                if (noSwear === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AutoMod**\n- The \`No-Swear\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard AutoMod No-Swear\``);
                    settings.addons.automod.noSwear = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AutoMod**\n- The \`No-Swear\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard AutoMod No-Swear\``);
                    settings.addons.automod.noSwear = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }


            } else if (args[1].toLowerCase() === "no-spam") {


                if (noSpam === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AutoMod**\n- The \`No-Spam\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard AutoMod No-Spam\``);
                    settings.addons.automod.noSpam = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AutoMod**\n- The \`No-Spam\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard AutoMod No-Spam\``);
                    settings.addons.automod.noSpam = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }

            } else if (args[1].toLowerCase() === "no-links") {


                if (noLinks === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AutoMod**\n- The \`No-Links\` module has now been **Enabled**!\n\nTo Disable the module, use the command under.\n> \`${prefix}Dashboard AutoMod No-Links\``);
                    settings.addons.automod.noLinks = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AutoMod**\n- The \`No-Links\` module has now been **Deactivated**!\n\nTo Enable the module, use the command under.\n> \`${prefix}Dashboard AutoMod No-Links\``);
                    settings.addons.automod.noLinks = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }


            }


        }

        if (args[0].toLowerCase() === "levels") {

            if (!args[1]) {

                let levelsEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Levels**\nThis Add-on will make users able to level up, with custom level-up messages.\n\n> Enabled \`${levels}\` | **${prefix}Dashboard Levels Toggle**\n> Level-Up Message \`${settings.addons.levels.levelupMessage}\` | **${prefix}Dashboard Levels Message <Message>**\n\n> \`[USER]\` to get the users tag.\n> \`[XP]\` to get the users XP.\n> \`[LEVEL]\` to get the users level.`);
                return channel.send(levelsEmbed);
            }
            if (args[1].toLowerCase() === "message") {

                let lvlupMessage = args.slice(2).join(" ");

                if (!lvlupMessage) {
                    let errorEmbed = new Discord.RichEmbed()
                        .setDescription(`**Error**\n- You got an error!\n> Error \`You need to define a level-up message!\``)
                        .setColor(config.color);
                    return channel.send(errorEmbed);
                }

                let lvlupMsgEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Levels**\nThe level up message has been changed to \`${lvlupMessage}\`\n\nTo change the level-up message:\n> \`${prefix}Dashboard Levels message <new message>\`\n\n> **[USER]** to get the user | **[XP]** to get the XP | **[LEVEL]** to get the users level`)

                settings.addons.levels.levelupMessage = lvlupMessage;

                settings.save().catch(err => console.log(err));
                return channel.send(lvlupMsgEmbed);
            }

            if (args[1].toLowerCase() === "toggle") {

                if (levels === "Deactivated") {

                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Levels**\n- The \`Levels\` addon has now been **Enabled**!\n\nTo Disable the addon, use the command under.\n\n> \`${prefix}Dashboard Levels Toggle\``);
                    settings.addons.levels.enabled = true;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);

                } else {
                    let setEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Levels**\n- The \`Levels\` addon has now been **Deactivated**!\n\nTo Enable the addon, use the command under.\n\n> \`${prefix}Dashboard Levels Toggle\``);
                    settings.addons.levels.enabled = false;

                    settings.save().catch(err => console.log(err));
                    return channel.send(setEmbed);
                }

            }

        }

        if (args[0].toLowerCase() === "memberlogs") {

            if (!args[1]) {
                let memberLogEmbed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(`**Member Logs**\nThis addon will log in a channel chosen by you, when an user joins or leaves the guild. It will also give the user a role, if you have specified a role.\n> Join-Role ${joinRole} | **${prefix}Dashboard memberLogs joinRole <role name>**\n> Join Message \`${settings.addons.memberLogs.messages.join}\` | **${prefix}Dashboard memberLogs joinMessage <Message>**\n> Leave Message \`${settings.addons.memberLogs.messages.leave}\` | **${prefix}Dashboard memberLogs leaveMessage <Message>**\n> Logging-Channel ${memberLogsChannel} | **${prefix}Dashboard memberLogs channel <channel name>**\n\n> Use \`[USER]\` for the user's tag.\n> Use \`[COUNT]\` for how many users there are in the server.\n> Use \`[SERVER]\` for the servers name.`);

                return channel.send(memberLogEmbed);
            }

            if (args[1].toLowerCase() === "joinrole") {
                const role = msg.mentions.roles.first() || msg.guild.roles.get(args[2]) || msg.guild.roles.find(r => r.name == args.slice(2).join(" "));


                if (!role) {
                    let errorEmbed = new Discord.RichEmbed()
                        .setDescription(`**Error**\n- You got an error!\n> Error \`You need to define the right role-name (CaSe-SenSitIvE)\``)
                        .setColor(config.color);
                    return channel.send(errorEmbed);
                }

                if (!args[2]) {
                    let errorEmbed = new Discord.RichEmbed()
                        .setDescription(`**Error**\n- You got an error!\n> Error \`You need to define a Join Role!\``)
                        .setColor(config.color);
                    return channel.send(errorEmbed);
                }

                let joinRoleEmbed = new Discord.RichEmbed()
                    .setDescription(`**Member Logs**\n- Changed the joinRole to ${role} with the id: ${role.id}\n\n> \`${prefix}Dashboard memberlogs joinRole <role-name / role-id>\``)
                    .setColor(config.color);
                channel.send(joinRoleEmbed);
                settings.addons.memberLogs.joinRole = role.id;
                return settings.save().catch(err => console.log(err));
            };

            if (args[1].toLowerCase() === "joinmessage") {
                let message = args.slice(2).join(" ");

                if (!message) {
                    let errorEmbed = new Discord.RichEmbed()
                        .setDescription(`**Error**\n- You got an error!\n> Error \`You need to define a Welcome Message!\``)
                        .setColor(config.color);
                    return channel.send(errorEmbed);
                }

                let joinMessageEmbed = new Discord.RichEmbed()
                    .setDescription(`**Member Logs**\nChanged the welcome message to \n> \`${message}\``)
                    .setColor(config.color);
                settings.addons.memberLogs.messages.join = message;
                settings.save().catch(err => console.log(err));
                return channel.send(joinMessageEmbed);
            }

            if (args[1].toLowerCase() === "leavemessage") {
                let message = args.slice(2).join(" ");

                if (!message) {
                    let errorEmbed = new Discord.RichEmbed()
                        .setDescription(`**Error**\n- You got an error!\n> Error \`You need to define a Leave Message!\``)
                        .setColor(config.color);
                    return channel.send(errorEmbed);
                }

                let joinMessageEmbed = new Discord.RichEmbed()
                    .setDescription(`**Member Logs**\nChanged the Leave message to\n> \`${message}\``)
                    .setColor(config.color);
                settings.addons.memberLogs.messages.leave = message;
                settings.save().catch(err => console.log(err));
                return channel.send(joinMessageEmbed);
            }
            if (args[1].toLowerCase() === "channel") {
                if (!args[2]) {
                    if (settings.addons.memberLogs.channel === "Not Defined" || !settings.addons.memberLogs.channel) {
                        joinChannel = "`Not Defined`";
                    } else {
                        joinChannel = msg.guild.channels.find(c => c.id === settings.addons.memberLogs.channel);
                    }
                    let bLogsEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Member Logs**\n- Current Setting ${joinChannel} | **${prefix}Dashboard memberlogs channel <Channel Name>**\n\nThis is the current channel where Techno logs when a member joins or leaves.`)
                    return channel.send(bLogsEmbed);
                } else {
                    let joinChannel = msg.guild.channels.find(c => c.name === args[2]);
                    if (!joinChannel) {
                        let errorEmbed = new Discord.RichEmbed()
                            .setColor(config.color)
                            .setDescription(`**Error**\n- You got an error!\n\n> Error \`You didn't define a valid channel-name!\``);
                        return channel.send(errorEmbed);
                    }
                    settings.addons.memberLogs.channel = joinChannel.id;
                    settings.save().catch(err => console.log(err));
                    let bLogsEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Member Logs**\n - Set the logging channel to ${joinChannel}\n\nThis will now be the channel where Techno logs when a member joins or leaves.\n\nTo change this do\n\n> \`${settings.prefix}Dashboard memberlogs channel <Channel Name>\``)
                    return channel.send(bLogsEmbed);
                }
            }
        }
    });
};