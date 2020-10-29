const Discord = require("discord.js");
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");
const db = require("quick.db");
const delay = require("delay");
const math = require("mathjs");

let u = {
    queue: new Map(),
}

module.exports.run = async (client, message, config) => {
    let guild = message.guild;
    let msg = message;
    let channel = message.channel;
    let prefix = "t!";



    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    Users.findOne({
        userID: msg.author.id,
        guildID: msg.guild.id
    }, async (err, user) => {
        if (err) return console.log(err);

        if (!user) {
            const userDB = new Users({
                userID: msg.author.id,
                guildID: msg.guild.id,
                levels: {
                    level: 0,
                    xp: 0,
                    messages: 0,
                },
                punishments: {
                    warns: 0,
                    bans: 0,
                    kicks: 0,
                    autowarn: 0,
                    spam: 0,
                },
                settings: {
                    afk: {
                        enabled: "false",
                        message: "None"
                    }
                }
            });

            return userDB.save().catch(err => console.log(err));
        }
    });

    if (message.channel.type === "dm") {
        return;
    }
    if (message.channel.type === "group") {
        return;
    }
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, dashboard) => {
        if (err) console.log(err);
        if (!dashboard) {
            const newConfig = new Dashboard({
                guildID: msg.guild.id,
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
            return newConfig.save().catch(err => console.log(err));
        }
        if (!dashboard) {
            prefix = "t!";
        } else {
            prefix = dashboard.prefix;
        }


        if (dashboard.addons.automod.noSpam === "true") {

            Users.findOne({
                userID: msg.author.id,
                guildID: msg.guild.id
            }, async (err, user) => {
                if (err) console.log(err);

                db.add(`${msg.guild.id}.${msg.author.id}.nospam`, 1);

                if (db.fetch(`${msg.guild.id}.${msg.author.id}.nospam`) === 5) {
                    db.delete(`${msg.guild.id}.${msg.author.id}.nospam`);
                    message.channel.bulkDelete(5);

                    let logEmbed = new Discord.RichEmbed()
                        .setDescription(`**Anti-Spamming**\n- User \`${message.author.tag}\`\n- Channel ${message.channel}`)
                        .setColor(config.color);
                    let logChannel = message.guild.channels.find(c => c.id === dashboard.channels.botLogs);
                    logChannel.send(logEmbed);

                    let warnEmbed = new Discord.RichEmbed()
                        .setDescription(`**Anti-Spamming**\n- Spamming is not allowed on this server, ${message.author.tag}!`).setColor(config.color);

                    return message.channel.send(warnEmbed).then(m => m.delete(2000));

                }

                setTimeout(() => {
                    db.delete(`${msg.guild.id}.${msg.author.id}.nospam`);
                }, 5000);

            });

        }


        if (dashboard.addons.automod.noLinks === "true") {
            let advertWords = ["https://", "http://", "www.", "discord.gg/", "youtube.com/"];
            for (var a in advertWords) {
                if (message.content.toLowerCase().includes(advertWords[a])) {
                    message.delete();
                    let logEmbed = new Discord.RichEmbed()
                        .setDescription(`**Anti-Advertising**\n- User \`${message.author.tag}\`\n- Channel ${message.channel}\n- Message \`${message.content}\``)
                        .setColor(config.color);
                    let logChannel = message.guild.channels.find(c => c.id === dashboard.channels.botLogs);
                    logChannel.send(logEmbed);

                    let warnEmbed = new Discord.RichEmbed()
                        .setDescription(`**Anti-Advertising**\n- Advertising is not allowed on this server, ${message.author.tag}!`).setColor(config.color);

                    return message.channel.send(warnEmbed).then(m => m.delete(2000));
                }
            }
        }


        if (dashboard.addons.automod.noSwear === "true") {
            let swearWords = ["fuck", "nigga", "porn", "niger", "nigger", "bitch", "whore", "penis", "vagina", "asshole", "dick", "cunt", "thot", "twat", "jerkoff", "arse", "a$$", "as$", "a$s"];
            for (var s in swearWords) {
                if (message.content.toLowerCase().includes(swearWords[s])) {

                    message.delete();
                    let logEmbed = new Discord.RichEmbed()
                        .setDescription(`**Anti-Swearing**\n- User \`${message.author.tag}\`\n- Channel ${message.channel}\n- Message \`${message.content}\``)
                        .setColor(config.color);
                    let logChannel = message.guild.channels.find(c => c.id === dashboard.channels.botLogs);
                    logChannel.send(logEmbed);

                    let warnEmbed = new Discord.RichEmbed()
                        .setDescription(`**Anti-Swearing**\n- Swearing is not allowed on this server, ${message.author.tag}!`).setColor(config.color);

                    message.channel.send(warnEmbed).then(m => m.delete(2000));

                }
            }
        }

        if (dashboard.addons.levels.enabled === "true") {
            Users.findOne({
                userID: message.author.id,
                guildID: message.guild.id
            }, (err, user) => {

                if (err) console.log(err);

                if (user) {
                    let levelUpXP = math.evaluate(35 * (user.levels.level + 1));
                    user.levels.xp = user.levels.xp + 1;

                    if (user.levels.xp === levelUpXP) {
                        user.levels.level = user.levels.level + 1;
                        let lvlUpMessage = dashboard.addons.levels.levelupMessage;
                        if (lvlUpMessage === "Not Defined") {
                            lvlUpMessage = "[USER] just leveled up to [LEVEL]!";
                        }
                        lvlUpMessage = lvlUpMessage.replace("[USER]", message.author.tag).replace("[XP]", user.levels.xp).replace("[LEVEL]", user.levels.level).replace("[USER]", message.author.tag).replace("[XP]", user.levels.xp).replace("[LEVEL]", user.levels.level);
                        let embed = new Discord.RichEmbed()
                            .setDescription(lvlUpMessage)
                            .setColor(config.color);
                        message.channel.send(embed);
                    }
                    user.save().catch(err => console.log(err));
                }
            });

        }

        await Users.findOne({
            userID: msg.author.id,
            guildID: msg.guild.id
        }, async (err, user) => {

            if (user) {

                if (err) console.log(err);

                if (user.settings.afk.enabled === "true") {

                    user.settings.afk.enabled = "false";
                    user.settings.afk.message = "";
                    user.save().catch(err => console.log(err));

                    let afkEmbed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**AFK**\n> ${msg.author.tag} is no longer afk`);
                    return msg.channel.send(afkEmbed);

                }
            }
        });


        let userMember = await msg.guild.member(msg.mentions.users.first());

        if (userMember) {
            if (!userMember.user.bot) {
                await Users.findOne({
                    userID: userMember.id,
                    guildID: msg.guild.id
                }, async (err, user) => {

                    if (user) {

                        if (err) console.log(err);
                        if (user.settings.afk.enabled === "true") {

                            let afkMessage = "> Reason `" + user.settings.afk.message + "`";
                            if (!user.settings.afk.message) {
                                afkMessage = "";
                            }

                            let afkEmbed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`**AFK**\n> ${userMember} is afk\n\n\`${afkMessage}\``);
                            return msg.channel.send(afkEmbed);
                        }
                    }
                });
            }
        }
        const args = message.content.slice(prefix.length).trim().split(" ");
        const cmd = args.shift().toLowerCase();

        if (message.content === "<@569068361686974465>") {
            let embed = new Discord.RichEmbed()
                .setDescription(`**Techno**\n> This guilds prefix is \`${dashboard.prefix}\`\n> To get the commands, use \`${dashboard.prefix}help\``)
                .setColor(config.color);
            return msg.channel.send(embed);
        }

        const noPreArgs = message.content.trim().split(" ");
        const noPreCmd = noPreArgs.shift().toLowerCase();

        CustomCmds.findOne({
            guildID: msg.guild.id,
            cmdName: noPreCmd,
            prefix: false
        }, async (err, guild) => {
            if (err) console.log(err);

            if (guild) {
                let response = guild.cmdResponse;

                if (response.includes("[ARGS]")) {

                    if (response.includes("[USER]")) {
                        if (!args.slice(1).join(" ")) {
                            let embed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`You didn't spesify a message.`);
                            return channel.send(embed);
                        }
                        response = response.replace("[ARGS]", noPreArgs.slice(1).join(" ")).replace("[ARGS]", noPreArgs.slice(1).join(" "));
                    } else {
                        if (!args.slice(0).join(" ")) {
                            let embed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`You didn't spesify a message.`);
                            return channel.send(embed);
                        }
                        response = response.replace("[ARGS]", noPreArgs.slice(0).join(" ")).replace("[ARGS]", noPreArgs.slice(0).join(" "));
                    }
                }

                if (response.includes("[USER]")) {
                    if (!userMember) {
                        let embed = new Discord.RichEmbed()
                            .setColor(config.color)
                            .setDescription(`You didn't spesify a user.`);
                        return channel.send(embed);
                    }
                    response = response.replace("[USER]", userMember.user.tag).replace("[USER]", userMember.user.tag);
                }
                if (response.includes("[MEMBER]")) {
                    response = response.replace("[MEMBER]", message.author.tag).replace("[MEMBER]", message.author.tag);
                }

                let embed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(response);
                return channel.send(embed);
            }

        });


        if (!msg.content.startsWith(prefix)) return;

        CustomCmds.findOne({
            guildID: msg.guild.id,
            cmdName: cmd,
            prefix: true
        }, async (err, guild) => {
            if (err) console.log(err);

            if (guild) {
                let response = guild.cmdResponse;

                if (response.includes("[ARGS]")) {

                    if (response.includes("[USER]")) {
                        if (!args.slice(1).join(" ")) {
                            let embed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`You didn't spesify a message.`);
                            return channel.send(embed);
                        }
                        response = response.replace("[ARGS]", args.slice(1).join(" ")).replace("[ARGS]", args.slice(1).join(" "));
                    } else {
                        if (!args.slice(0).join(" ")) {
                            let embed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`You didn't spesify a message.`);
                            return channel.send(embed);
                        }
                        response = response.replace("[ARGS]", args.slice(0).join(" ")).replace("[ARGS]", args.slice(0).join(" "));
                    }
                }

                if (response.includes("[USER]")) {
                    if (!userMember) {
                        let embed = new Discord.RichEmbed()
                            .setColor(config.color)
                            .setDescription(`You didn't spesify a user.`);
                        return channel.send(embed);
                    }
                    response = response.replace("[USER]", userMember.user.tag).replace("[USER]", userMember.user.tag);
                }
                if (response.includes("[MEMBER]")) {
                    response = response.replace("[MEMBER]", message.author.tag).replace("[MEMBER]", message.author.tag);
                }

                let embed = new Discord.RichEmbed()
                    .setColor(config.color)
                    .setDescription(response);
                return channel.send(embed);
            }
        });
        let addons = ["rank", "leaderboard", "customcmd", "ticket", "commands", "apply", "application", "deny", "accept"];
        for (var c in addons) {
            if (cmd === addons[c]) {
                try {
                    delete require.cache[require.resolve(`../Commands/Addons/${cmd}.js`)];
                    let commandFile = require(`../Commands/Addons/${cmd}.js`);
                    commandFile.run(client, msg, channel, args, config, guild, Discord);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        }

        let StaffCommands = ["ban", "kick", "mute", "tempban", "tempmute", "warn", "clear", "softban"];
        for (var c in StaffCommands) {
            if (cmd === StaffCommands[c]) {
                try {
                    delete require.cache[require.resolve(`../Commands/StaffCommands/${cmd}.js`)];
                    let commandFile = require(`../Commands/StaffCommands/${cmd}.js`);
                    commandFile.run(client, msg, channel, args, config, guild, Discord);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        }

        let others = ["search", "translate", "admin", "calculate", "testbackup", "testrbackup"];
        for (var c in others) {
            if (cmd === others[c]) {
                try {
                    delete require.cache[require.resolve(`../Commands/Others/${cmd}.js`)];
                    let commandFile = require(`../Commands/Others/${cmd}.js`);
                    commandFile.run(client, msg, channel, args, config, guild, Discord);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        }

        let utilties = ["poll", "announce", "dashboard", "rules", "help", "user", "guild", "afk", "bot", "setup", "echo", "nick", "promote", "demote", "backup"];
        for (var c in utilties) {
            if (cmd === utilties[c]) {
                try {
                    delete require.cache[require.resolve(`../Commands/Utilities/${cmd}.js`)];
                    let commandFile = require(`../Commands/Utilities/${cmd}.js`);
                    commandFile.run(client, msg, channel, args, config, guild, Discord);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        }
        let music = ["play", "pause", "skip", "volume", "queue", "np", "resume", "stop"];
        for (var c in music) {
            if (cmd === music[c]) {
                try {
                    delete require.cache[require.resolve(`../Commands/Music/${cmd}.js`)];
                    let commandFile = require(`../Commands/Music/${cmd}.js`);
                    commandFile.run(client, msg, channel, args, config, guild, Discord, u);
                } catch (e) {
                    console.log(e.stack);
                }
            }
        }
    });


};