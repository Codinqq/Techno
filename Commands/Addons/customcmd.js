const mongoose = require("mongoose");
const Config = require("../../models/dashboard.js");
const CustomCmds = require("../../models/customcmds.js");
const emoji = require('../../emojis.js');
const ms = require("ms");


module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();

    if (!msg.member.hasPermission("ADMINISTRATOR")) {
        let noAccessEmbed = new Discord.RichEmbed()
            .setDescription(`**Custom Commands** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
            .setColor(config.color);
        return channel.send(noAccessEmbed);
    }

    let addEmbed = new Discord.RichEmbed().setColor(config.color);

    const filter = m => m.author.id === msg.author.id;

    channel.send(addEmbed.setDescription(`**Custom Commands**\nYou started the Custom Command-Wizard.\n\n*Available Settings*\n\n\`Add a command\` » Will take you thru the setup-prosess.\n\`Remove a command\` » Will take you thru the remove-prosess.\n\`Edit a command\` » Will take you thru the edit-prosess.\n\n> To continue, please write one of the available settings.\n> To cancel, please write \`cancel\``)).then(async main => {


        let collector = await new Discord.MessageCollector(channel, filter, {
            max: 1
        });

        collector.on("collect", async (collector, element) => {
            let todo = collector.content;
            collector.delete();

            if (todo.toLowerCase() === "add a command") {
                main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nYou started the Setup-Wizard.\n\n *Available Settings*\n\`With Prefix\` » Will respond if the command has the prefix before the command.\n\`Without Prefix\` » Will respond if the command hasn't the prefix before the command.\n\n> To continue, please write one of the available settings.\n> To cancel, please write \`cancel\``)).then(async a => {

                    let collector = await new Discord.MessageCollector(channel, filter, {
                        max: 1
                    });

                    collector.on("collect", async (collector, element) => {
                        let setting = collector.content;
                        collector.delete();
                        if (setting.toLowerCase() === "cancel") {
                            return main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\n> Successfully cancelled the setup-wizard.`));
                        }

                        if (setting.toLowerCase() === "with prefix") {

                            main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nYou set the type of the command to "With Prefix"\n\n> To continue, please write what the command is going to be.\n> To cancel, please write \`cancel\``)).then(async b => {

                                let collector = await new Discord.MessageCollector(channel, filter, {
                                    max: 1
                                });

                                collector.on("collect", async (collector, element) => {
                                    let command = collector.content;
                                    collector.delete();

                                    if (command.toLowerCase() === "cancel") {
                                        return main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\n> Successfully cancelled the setup-wizard.`));
                                    }

                                    main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nYou set the command to \`${command}\`\n\nAvailable settings\n> \`[MEMBER]\` » This will show the user who activated the message. \n> \`[USER]\` » This will a user who the sender specified.\n> \`[ARGS]\` » This will show a message.\n\n> To continue, please write what the response is going to be.\n> To cancel, please write \`cancel\``)).then(async d => {

                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                            max: 1
                                        });

                                        collector.on("collect", async (collector, element) => {
                                            let response = collector.content;
                                            collector.delete();

                                            if (response.toLowerCase() === "cancel") {
                                                return main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\n> Successfully cancelled the setup-wizard.`));
                                            }


                                            main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nThe response has been set to \`${response}\`\n\n> To continue, please write the command info.\n> To cancel, please write \`cancel\``)).then(async e => {
                                                let collector = await new Discord.MessageCollector(channel, filter, {
                                                    max: 1
                                                });
                                                collector.on("collect", async (collector, element) => {
                                                    let info = collector.content;
                                                    collector.delete();


                                                    main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nThe custom command is now finished.\n> Command \`${command}\`\n> Response \`${response}\`\n> Type \`${setting}\`\n> Info \`${info}\``));

                                                    const newCommand = new CustomCmds({
                                                        guildID: msg.guild.id,
                                                        cmdName: command.toLowerCase(),
                                                        cmdInfo: info,
                                                        cmdResponse: response,
                                                        prefix: true
                                                    });
                                                    return newCommand.save().catch(err => console.log(err));

                                                });

                                            });
                                        });
                                    });
                                });
                            });

                        }

                        if (setting.toLowerCase() === "without prefix") {

                            main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nYou set the type of the command to "Without Prefix"\n\n> To continue, please write what the command is going to be.\n> To cancel, please write \`cancel\``)).then(async b => {

                                let collector = await new Discord.MessageCollector(channel, filter, {
                                    max: 1
                                });

                                collector.on("collect", async (collector, element) => {
                                    let command = collector.content;
                                    collector.delete();

                                    if (command.toLowerCase() === "cancel") {
                                        return main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\n> Successfully cancelled the setup-wizard.`));
                                    }

                                    main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nYou set the command to \`${command}\`\n\nAvailable settings\n> \`[MEMBER]\` » This will show the user who activated the message.\n> \`[USER]\` » This will a user who the sender specified.\n> \`[ARGS]\` » This will show a message.\n\n> To continue, please write what the response is going to be.\n> To cancel, please write \`cancel\``)).then(async d => {

                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                            max: 1
                                        });

                                        collector.on("collect", async (collector, element) => {
                                            let response = collector.content;
                                            collector.delete();

                                            if (response.toLowerCase() === "cancel") {
                                                return main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\n> Successfully cancelled the setup-wizard.`));
                                            }


                                            main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nThe response has been set to \`${response}\`\n> To continue, please write the command info.\n> To cancel, please write \`cancel\``)).then(async e => {
                                                let collector = await new Discord.MessageCollector(channel, filter, {
                                                    max: 1
                                                });
                                                collector.on("collect", async (collector, element) => {
                                                    let info = collector.content;
                                                    collector.delete();


                                                    main.edit(addEmbed.setDescription(`**Custom Commands** | Add Command\nThe custom command is now finished.\n> Command \`${command}\`\n> Response \`${response}\`\n> Type \`${setting}\`\n> Info \`${info}\``));

                                                    const newCommand = new CustomCmds({
                                                        guildID: msg.guild.id,
                                                        cmdName: command.toLowerCase(),
                                                        cmdInfo: info,
                                                        cmdResponse: response,
                                                        prefix: false
                                                    });
                                                    return newCommand.save().catch(err => console.log(err));
                                                });

                                            });
                                        });
                                    });
                                });
                            });


                        }

                    });

                });
            }
            if (todo.toLowerCase() === "remove a command") {
                let CMDres = "";

                CustomCmds.find({
                    guildID: msg.guild.id
                }, async (err, guild) => {
                    if (err) return console.log(err);

                    for (var i in guild) {
                        let type = "";
                        if (guild[i].prefix) {
                            type = `With Prefix`
                        } else {
                            type = "Without prefix"
                        }
                        CMDres += `> ${guild[i].cmdName} | ${guild[i].cmdResponse} | ${type} | ${guild[i].cmdInfo}\n`;

                    }

                    let embed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Custom Commands** | Remove Command\nWhich one do you want to remove?\n\n${CMDres}\n\n> To select one, please write the name of the command.\n> To cancel this remover, write \`cancel\``);
                    main.edit(embed).then(async a => {
                        let collector = await new Discord.MessageCollector(channel, filter, {
                            max: 1
                        });

                        collector.on("collect", async (collector, element) => {
                            var command = collector.content;
                            collector.delete();
                            if (command.toLowerCase() === "cancel") {
                                return main.edit(addEmbed.setDescription(`**Custom Commands** | Remove Command\n> Successfully cancelled the removal of a command.`));
                            }
                            CustomCmds.findOneAndDelete({
                                guildID: msg.guild.id,
                                cmdName: command.toLowerCase()
                            }, async (err, cmd) => {
                                if (err) {
                                    console.log(err);
                                }

                                if (!cmd) {
                                    main.edit(embed.setDescription(`**Custom Commands** | Remove Command\n> Couldn't find any command called ${command}`));
                                } else {
                                    main.edit(embed.setDescription(`**Custom Commands** | Remove Command\n> Successfully removed ${command}.`))
                                }


                            });

                        });
                    });

                })
            }
            if (todo.toLowerCase() === "edit a command") {
                let CMDres = "";

                CustomCmds.find({
                    guildID: msg.guild.id
                }, async (err, guild) => {
                    if (err) return console.log(err);

                    for (var i in guild) {
                        let type = "";
                        if (guild[i].prefix) {
                            type = `With Prefix`
                        } else {
                            type = "Without prefix"
                        }
                        CMDres += `> ${guild[i].cmdName} | ${guild[i].cmdResponse} | ${type} | ${guild[i].cmdInfo}\n`;

                    }

                    let embed = new Discord.RichEmbed()
                        .setColor(config.color)
                        .setDescription(`**Custom Commands** | Edit Command\nWhich one do you want to edit?\n\n${CMDres}\n\n> To select one, please write the name of the command.\n> To cancel this editor, you write \`cancel\``);
                    main.edit(embed).then(async a => {
                        let collector = await new Discord.MessageCollector(channel, filter, {
                            max: 1
                        });

                        collector.on("collect", async (collector, element) => {
                            var command = collector.content;
                            collector.delete();
                            if (command.toLowerCase() === "cancel") {
                                return main.edit(addEmbed.setDescription(`**Custom Commands** | Edit Command\n> Successfully cancelled the setup-wizard.`));
                            }

                            CustomCmds.findOne({
                                guildID: msg.guild.id,
                                cmdName: command
                            }, async (err, command) => {
                                if (err) return console.log(err);

                                if (command.cmdName) {
                                    main.edit(embed.setDescription(`**Custom Commands** | Edit Command\nYou're currently editing the command called ${command.cmdName}\nAvailable Options\n> \`Response\`\n> \`Type\`\n> \`Command Info\`\n> \`Command Name\`\n> To continue, pick one of the options.\n> To cancel, write \`cancel\``)).then(async b => {
                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                            max: 1
                                        });

                                        collector.on("collect", async (collector, element) => {
                                            var option = collector.content;
                                            collector.delete();
                                            if (option.toLowerCase() === "cancel") {
                                                return main.edit(addEmbed.setDescription(`**Custom Commands** | Edit Command\n> Successfully cancelled the setup-wizard.`));
                                            }
                                            if (option.toLowerCase() === "response") {
                                                main.edit(embed.setDescription(`**Custom Commands** | Edit Command\nYou're currently editing the command called ${command.cmdName}.\nYou picked the option \`Response\`\n\n> To continue, write the new response.\n> To cancel, write \`cancel\``)).then(async c => {
                                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                                        max: 1
                                                    });

                                                    collector.on("collect", async (collector, element) => {
                                                        var resp = collector.content;
                                                        collector.delete();
                                                        if (resp.toLowerCase() === "cancel") {
                                                            return main.edit(addEmbed.setDescription(`**Custom Commands** | Edit Command\n> Successfully cancelled the setup-wizard.`));
                                                        }

                                                        main.edit(embed.setDescription(`**Custom Commands** | Edit Command\n> Successfully changed the response of ${command.cmdName} to ${resp}`));

                                                        command.cmdResponse = resp;
                                                        command.save().catch(err => console.log(err));

                                                    });
                                                });
                                            };

                                            if (option.toLowerCase() === "command name") {
                                                main.edit(embed.setDescription(`**Custom Commands** | Edit Command\nYou're currently editing the command called ${command.cmdName}.\nYou picked the option \`Command Name\`\n\n> To continue, write the new name.\n> To cancel, write \`cancel\``)).then(async c => {
                                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                                        max: 1
                                                    });

                                                    collector.on("collect", async (collector, element) => {
                                                        var resp = collector.content;
                                                        collector.delete();
                                                        if (resp.toLowerCase() === "cancel") {
                                                            return main.edit(addEmbed.setDescription(`**Custom Commands** | Edit Command\n> Successfully cancelled the setup-wizard.`));
                                                        }

                                                        main.edit(embed.setDescription(`**Custom Commands** | Edit Command\n> Successfully changed the Command Info of ${command.cmdName} to ${resp}`));

                                                        command.cmdName = resp.toLowerCase();
                                                        command.save().catch(err => console.log(err));

                                                    });
                                                });
                                            };

                                            if (option.toLowerCase() === "command info") {
                                                main.edit(embed.setDescription(`**Custom Commands** | Edit Command\nYou're currently editing the command called ${command.cmdName}.\nYou picked the option \`Command Info\`\n\n> To continue, write the new information.\n> To cancel, write \`cancel\``)).then(async c => {
                                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                                        max: 1
                                                    });

                                                    collector.on("collect", async (collector, element) => {
                                                        var resp = collector.content;
                                                        collector.delete();
                                                        if (resp.toLowerCase() === "cancel") {
                                                            return main.edit(addEmbed.setDescription(`**Custom Commands** | Edit Command\n> Successfully cancelled the setup-wizard.`));
                                                        }

                                                        main.edit(embed.setDescription(`**Custom Commands** | Edit Command\n> Successfully changed the Command Info of ${command.cmdName} to ${resp}`));

                                                        command.cmdInfo = resp;
                                                        command.save().catch(err => console.log(err));

                                                    });
                                                });
                                            };

                                            if (option.toLowerCase() === "type") {
                                                main.edit(embed.setDescription(`**Custom Commands** | Edit Command\nYou're currently editing the command called ${command.cmdName}.\nYou picked the option \`Type\`\n\nAvailable Options\n> \`With Prefix\`\n> \`Without Prefix\`\n> To continue, pick one of the options.\n> To cancel, write \`cancel\``)).then(async c => {
                                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                                        max: 1
                                                    });

                                                    collector.on("collect", async (collector, element) => {
                                                        var resp = collector.content;
                                                        collector.delete();
                                                        if (resp.toLowerCase() === "cancel") {
                                                            return main.edit(addEmbed.setDescription(`**Custom Commands** | Edit Command\n> Successfully cancelled the setup-wizard.`));
                                                        }

                                                        if (resp.toLowerCase() === "with prefix") {
                                                            main.edit(embed.setDescription(`**Custom Commands** | Edit Command\n> Successfully changed the type of ${command.cmdName} to "With Prefix"`));
                                                            command.prefix = true;
                                                        }

                                                        if (resp.toLowerCase() === "without prefix") {
                                                            main.edit(embed.setDescription(`**Custom Commands** | Edit Command\n> Successfully changed the type of ${command.cmdName} to "Without Prefix"`));
                                                            command.prefix = false;
                                                        }

                                                        command.save().catch(err => console.log(err));

                                                    });
                                                });
                                            };


                                        });
                                    });

                                }



                            });
                        });
                    });


                })
            }

        });

    });
}