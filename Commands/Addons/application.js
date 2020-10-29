const mongoose = require("mongoose");
const Config = require("../../models/dashboard.js");
const Application = require("../../models/application.js");
const User = require("../../models/users.js");
const emoji = require('../../emojis.js');
const ms = require("ms");
const titleize = require('titleize');


module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    User.findOne({
        guildID: msg.guild.id,
        userID: msg.author.id
    }, async (err, user) => {
        if (err) return console.log(err);

        if (!msg.member.hasPermission("ADMINISTRATOR")) {
            let noAccessEmbed = new Discord.RichEmbed()
                .setDescription(`**Applications** | *Permission Denied*\n- You do not have access to this command.\n- Required perms » \`ADMINISTRATOR\``)
                .setColor(config.color);
            return channel.send(noAccessEmbed);
        }

        user.applicationEdit = true;
        user.save().catch(err => console.log(err));

        const filter = m => m.author.id === msg.author.id;

        let appEmbed = new Discord.RichEmbed()
            .setDescription(`**Applications**\nYou started the Application-Wizard.\n\n*Available Settings*\n\`Application\` » This will take you through the application-wizard.\n\`Question\` » This will take you through the question-wizard.\n\n> To continue, please write one of the available settings.\n> To cancel, please write \`cancel\`
    `)
            .setColor(config.color);

        channel.send(appEmbed).then(async main => {




            let collector = await new Discord.MessageCollector(channel, filter, {
                max: 1
            });

            collector.on("collect", async (collector, element) => {
                let options = collector.content.toLowerCase();
                collector.delete();
                if (options === "cancel") {
                    user.applicationEdit = false;
                    user.save().catch(err => console.log(err))
                    return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                }
                if (options === "application") {

                    main.edit(appEmbed.setDescription(`**Applications**\nYou chose "Application"\n\n*Available Settings*\n\`Add\` » This will take you through the creation-process.\n\`Remove\` » This will take you through the removal-process.\n\`Edit\` » This will take you through the edit-process.\n\n> To continue, please write one of the available settings.\n> To cancel, please write \`cancel\``)).then(async m => {
                        let collector = await new Discord.MessageCollector(channel, filter, {
                            max: 1
                        });

                        collector.on("collect", async (collector, element) => {
                            let options = collector.content.toLowerCase();
                            collector.delete();

                            if (options === "cancel") {
                                user.applicationEdit = false;
                                user.save().catch(err => console.log(err));
                                return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`));
                            }

                            if (options === "add") {
                                main.edit(appEmbed.setDescription(`**Applications**\nYou chose to create an application.\n\n> What do you want to name the application?\n\n> To continue, please write the name of the application\n> To cancel, please write \`cancel\``)).then(async a => {

                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                        max: 1
                                    });

                                    collector.on("collect", async (collector, element) => {
                                        let name = collector.content;
                                        collector.delete();

                                        if (name.toLowerCase() === "cancel") {
                                            user.applicationEdit = false;
                                            user.save().catch(err => console.log(err));
                                            return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))

                                        }

                                        main.edit(appEmbed.setDescription(`**Applications**\nYou're editing ${name}.\n\n> How many questions do you want to add?\n\n> To continue, please write the amount of questions you want to add.\n> To cancel, please write \`cancel\``)).then(async a => {

                                            let collector = await new Discord.MessageCollector(channel, filter, {
                                                max: 1
                                            });

                                            collector.on("collect", async (collector, element) => {
                                                let amount = parseInt(collector.content);
                                                collector.delete();

                                                if (collector.content === "cancel") {
                                                    user.applicationEdit = false;
                                                    user.save().catch(err => console.log(err));
                                                    return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                }
                                                let number = 0;

                                                let questionArray = [];

                                                async function addQuestions() {

                                                    if (number === amount || number > amount) {
                                                        main.edit(appEmbed.setDescription(`**Applications**\n> Successfully added the ${name} application.`));

                                                        user.applicationEdit = false;
                                                        user.save().catch(err => console.log(err))
                                                        let newApp = new Application({
                                                            guildID: msg.guild.id,
                                                            name: name.toLowerCase(),
                                                            questions: questionArray
                                                        })

                                                        return newApp.save().catch(err => console.log(err));
                                                    }

                                                    if (number < amount && number > 0) {

                                                        main.edit(appEmbed.setDescription(`**Applications**\nWhat do you want the next question to be?\n\n> ${number}/${amount} questions`)).then(async b => {
                                                            let collector = await new Discord.MessageCollector(channel, filter, {
                                                                max: 1
                                                            });

                                                            collector.on("collect", async (collector, element) => {
                                                                let question = collector.content;
                                                                if (question.toLowerCase() === "cancel") {
                                                                    user.applicationEdit = false;
                                                                    user.save().catch(err => console.log(err));
                                                                    return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                                }
                                                                collector.delete();
                                                                questionArray.push(question);
                                                                number++
                                                                addQuestions();
                                                            })

                                                        });

                                                    } else {
                                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                                            max: 1
                                                        });
                                                        collector.on("collect", async (collector, element) => {
                                                            let question = collector.content;

                                                            if (question.toLowerCase() === "cancel") {
                                                                user.applicationEdit = false;
                                                                user.save().catch(err => console.log(err));
                                                                return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                            }

                                                            collector.delete();
                                                            questionArray.push(question);
                                                            number++
                                                            addQuestions();
                                                        })
                                                    }


                                                }

                                                main.edit(appEmbed.setDescription(`**Applications**\nYou chose to create ${amount} questions.\n\n> What is your first question?\n\n> To continue, please write the first question.\n> To cancel, please write \`cancel\``))

                                                addQuestions();
                                            });

                                        });

                                    });

                                });
                            }
                            if (options === "remove") {

                                Application.find({
                                    guildID: msg.guild.id
                                }, async (err, apps) => {
                                    if (err) return console.log(err);

                                    let questionsRes = "";
                                    for (var i in apps) {

                                        questionsRes += `\`${titleize(apps[i].name)}\` `;

                                    };

                                    if (questionsRes === "" || !questionsRes) {
                                        user.applicationEdit = false;
                                        user.save().catch(err => console.log(err));
                                        return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications.`))
                                    }
                                    main.edit(appEmbed.setDescription(`**Applications**\nWhich application do you want to remove?\n\n${questionsRes}\n\n> To continue, please write one of the applications.\n> To cancel, please write \`cancel\``)).then(async m => {
                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                            max: 1
                                        });

                                        collector.on("collect", async (collector, element) => {
                                            let name = collector.content.toLowerCase();

                                            collector.delete();
                                            if (name === "cancel") {
                                                user.applicationEdit = false;
                                                user.save().catch(err => console.log(err))
                                                return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                            }
                                            Application.findOneAndDelete({
                                                guildID: msg.guild.id,
                                                name: name
                                            }, async (err, apps) => {

                                                if (!apps) {
                                                    user.applicationEdit = false;
                                                    user.save().catch(err => console.log(err));
                                                    return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications named ${name}`));
                                                } else {
                                                    return main.edit(appEmbed.setDescription(`**Applications**\n> Successfully removed ${name}`));
                                                }

                                            });

                                        });
                                    });

                                });
                            }
                            if (options === "edit") {

                                let questionsRes = "";
                                Application.find({
                                    guildID: msg.guild.id
                                }, async (err, apps) => {
                                    if (err) return console.log(err);

                                    for (var i in apps) {

                                        questionsRes += `\`${titleize(apps[i].name)}\` `;

                                    };
                                });

                                if (questionsRes === "" || !questionsRes) {
                                    user.applicationEdit = false;
                                    user.save().catch(err => console.log(err))
                                    return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications.`))
                                }

                                main.edit(appEmbed.setDescription(`**Applications**\nWhich application do you want to edit?\n\n${questionsRes}\n\n> To continue, write one of the applications.\n> To cancel, please write \`cancel\``)).then(async m => {
                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                        max: 1
                                    });

                                    collector.on("collect", async (collector, element) => {
                                        let command = collector.content.toLowerCase();
                                        collector.delete();
                                        if (command === "cancel") {
                                            user.applicationEdit = false;
                                            user.save().catch(err => console.log(err))
                                            return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                        }

                                        Application.findOne({
                                            guildID: msg.guild.id,
                                            name: command
                                        }, async (err, apps) => {
                                            if (err) return console.log(err);


                                            if (!apps) {
                                                user.applicationEdit = false;
                                                user.save().catch(err => console.log(err))
                                                main.edit(appEmbed.setDescription(`**Applications**\nCouldn't find any application named \`${command}\``))
                                            }

                                            main.edit(appEmbed.setDescription(`**Applications**\nWhat do you want to edit the application-name to?\n\n> To continue, write the new name.\n> To cancel, please write \`cancel\``)).then(async m => {
                                                let collector = await new Discord.MessageCollector(channel, filter, {
                                                    max: 1
                                                });

                                                collector.on("collect", async (collector, element) => {
                                                    let name = collector.content.toLowerCase();
                                                    if (name === "cancel") {
                                                        user.applicationEdit = false;
                                                        user.save().catch(err => console.log(err))
                                                        return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                    }
                                                    collector.delete();

                                                    main.edit(appEmbed.setDescription(`**Applications**\nThe name of the application was changed to ${name}`));

                                                    apps.name = name;

                                                    user.applicationEdit = false;
                                                    user.save().catch(err => console.log(err))
                                                    apps.save().catch(err => console.log(err));


                                                });

                                            });

                                        });

                                    });
                                })

                            }

                        })
                    })
                }

                if (options === "question") {
                    main.edit(appEmbed.setDescription(`**Applications**\nYou chose "Question"\n\n*Available Settings*\n\`Add\` » This will take you through the creation-process.\n\`Remove\` » This will take you through the removal-process.\n\`Edit\` » This will take you through the edit-process.\n\n> To continue, please write one of the available settings.\n> To cancel, please write \`cancel\``)).then(async m => {
                        let collector = await new Discord.MessageCollector(channel, filter, {
                            max: 1
                        });

                        collector.on("collect", async (collector, element) => {
                            let options = collector.content.toLowerCase();
                            collector.delete();

                            if (options === "add") {
                                let questionRes = "";
                                Application.find({
                                    guildID: msg.guild.id
                                }, async (err, apps) => {
                                    if (err) return console.log(err);

                                    for (var i in apps) {

                                        let questionsRes = +`\`${titleize(apps[i].name)}\` `;

                                    };
                                    if (!apps) {
                                        user.applicationEdit = false;
                                        user.save().catch(err => console.log(err))
                                        return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications.`))
                                    }
                                });

                                main.edit(appEmbed.setDescription(`**Applications**\nYou chose to add a question\n\n> Which application do you want to add the question to?\n\n${questionRes}\n\n> To continue, please write the name of the application\n> To cancel, please write \`cancel\``)).then(async a => {

                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                        max: 1
                                    });

                                    collector.on("collect", async (collector, element) => {
                                        let name = collector.content;
                                        collector.delete();

                                        if (name.toLowerCase() === "cancel") {
                                            user.applicationEdit = false;
                                            user.save().catch(err => console.log(err))
                                            return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                        }

                                        Application.findOne({
                                            guildID: msg.guild.id,
                                            name: name.toLowerCase()
                                        }, async (err, app) => {

                                            if (!app) {
                                                user.applicationEdit = false;
                                                user.save().catch(err => console.log(err))
                                                return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications named ${name}`));
                                            }


                                            main.edit(appEmbed.setDescription(`**Applications**\nYou're adding a question to ${name}.\n\n> What is the question.\n\n> To continue, please write the new question\n> To cancel, please write \`cancel\``)).then(async a => {

                                                let collector = await new Discord.MessageCollector(channel, filter, {
                                                    max: 1
                                                });

                                                collector.on("collect", async (collector, element) => {
                                                    let amount = collector.content;
                                                    collector.delete();

                                                    if (amount.toLowerCase() === "cancel") {
                                                        user.applicationEdit = false;
                                                        user.save().catch(err => console.log(err))
                                                        return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                    }

                                                    main.edit(appEmbed.setDescription(`**Applications**\n> Successfully added \`${amount}\` to ${app.name}.`));

                                                    user.applicationEdit = false;
                                                    user.save().catch(err => console.log(err))
                                                    app.questions.push(amount);
                                                    app.save().catch(err => console.log(err));
                                                });
                                            });

                                        });

                                    });

                                });
                            }
                            if (options === "remove") {

                                Application.find({
                                    guildID: msg.guild.id
                                }, async (err, apps) => {

                                    let questionsRes = "";
                                    for (var i in apps) {

                                        questionsRes += `\`${titleize(apps[i].name)}\` `;

                                        if (!apps) {
                                            user.applicationEdit = false;
                                            user.save().catch(err => console.log(err))
                                            return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications.`))
                                        }

                                    };
                                    main.edit(appEmbed.setDescription(`**Applications**\nFrom which application do you want to remove a question?\n\n${questionsRes}\n\n> To continue, please write one of the applications.\n> To cancel, please write \`cancel\``)).then(async m => {
                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                            max: 1
                                        });

                                        collector.on("collect", async (collector, element) => {
                                            let name = collector.content.toLowerCase();
                                            collector.delete();
                                            if (name === "cancel") {
                                                user.applicationEdit = false;
                                                user.save().catch(err => console.log(err))
                                                return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                            }
                                            Application.findOne({
                                                guildID: msg.guild.id,
                                                name: name
                                            }, async (err, apps) => {

                                                questionsRes = "";

                                                for (var i in apps.questions) {

                                                    questionsRes += `${i}. \`${titleize(apps.questions[i])}\`\n`;
                                                }

                                                if (questionsRes === "" || !questionsRes) {
                                                    user.applicationEdit = false;
                                                    user.save().catch(err => console.log(err))
                                                    return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any questions from this application.`))
                                                }

                                                main.edit(appEmbed.setDescription(`**Applications**\nWhich question do you want to delete?\n\n${questionsRes}\n\n> To continue, please write the number of the question.\n> To cancel, please write \`cancel\``)).then(async idk => {
                                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                                        max: 1
                                                    });

                                                    collector.on("collect", async (collector, element) => {

                                                        let name = collector.content;
                                                        if (name.toLowerCase() === "cancel") {
                                                            user.applicationEdit = false;
                                                            user.save().catch(err => console.log(err))
                                                            return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                        }
                                                        collector.delete();

                                                        if (isNaN(name)) {
                                                            user.applicationEdit = false;
                                                            user.save().catch(err => console.log(err))
                                                            return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> You need to use a number.`));
                                                        }

                                                        let array = [];
                                                        for (var i in apps.questions) {

                                                            if (i != name) {
                                                                array.push(apps.questions[i]);
                                                            }

                                                        }

                                                        apps.questions = array;

                                                        main.edit(appEmbed.setDescription(`**Applications**\n> Successfully removed the question.`));

                                                        user.applicationEdit = false;
                                                        user.save().catch(err => console.log(err))
                                                        apps.save().catch(err => console.log(err));
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                            if (options === "edit") {
                                let questionsRes = "";

                                await Application.find({
                                    guildID: msg.guild.id
                                }, async (err, apps) => {

                                    for (var i in apps) {

                                        questionsRes += `\`${titleize(apps[i].name)}\` `;

                                    };

                                    if (!apps) {
                                        user.applicationEdit = false;
                                        user.save().catch(err => console.log(err))
                                        return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any applications.`))
                                    }
                                });

                                main.edit(appEmbed.setDescription(`**Applications**\nWhich application do you want to edit?\n\n${questionsRes}\n\n> To continue, write one of the applications.\n> To cancel, please write \`cancel\``)).then(async m => {
                                    let collector = await new Discord.MessageCollector(channel, filter, {
                                        max: 1
                                    });

                                    collector.on("collect", async (collector, element) => {
                                        let command = collector.content.toLowerCase();
                                        collector.delete();
                                        if (command === "cancel") {
                                            user.applicationEdit = false;
                                            user.save().catch(err => console.log(err))
                                            return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                        }
                                        Application.findOne({
                                            guildID: msg.guild.id,
                                            name: command
                                        }, async (err, apps) => {


                                            if (!apps) {
                                                user.applicationEdit = false;
                                                user.save().catch(err => console.log(err))
                                                main.edit(appEmbed.setDescription(`**Applications**\n> Couldn't find any command named \`${command}\``))
                                            }

                                            questionsRes = "";

                                            for (var i in apps.questions) {

                                                questionsRes += `${i}. \`${titleize(apps.questions[i])}\`\n`;

                                            };

                                            if (questionsRes === "" || !questionsRes) {
                                                user.applicationEdit = false;
                                                user.save().catch(err => console.log(err))
                                                return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> Couldn't find any questions from this application.`))
                                            }

                                            main.edit(appEmbed.setDescription(`**Applications**\nWhich question do you want to edit?\n\n${questionsRes}\n\n> To continue, write the number of the question.\n> To cancel, please write \`cancel\``)).then(async m => {
                                                let collector = await new Discord.MessageCollector(channel, filter, {
                                                    max: 1
                                                });

                                                collector.on("collect", async (collector, element) => {


                                                    let question = collector.content;
                                                    collector.delete();
                                                    if (question.toLowerCase() === "cancel") {
                                                        user.applicationEdit = false;
                                                        user.save().catch(err => console.log(err))
                                                        return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                    }
                                                    if (isNaN(question)) {
                                                        user.applicationEdit = false;
                                                        user.save().catch(err => console.log(err))
                                                        return main.edit(appEmbed.setDescription(`**Applications** | *Error*\n> You need to use a number.`));
                                                    }

                                                    main.edit(appEmbed.setDescription(`**Applications**\nWhat do you want to edit ${apps.questions[question]} to?\n\n> To continue, write the new message.\n> To cancel, please write \`cancel\``)).then(async m => {
                                                        let collector = await new Discord.MessageCollector(channel, filter, {
                                                            max: 1
                                                        });

                                                        collector.on("collect", async (collector, element) => {
                                                            collector.delete();

                                                            if (collector.content.toLowerCase() === "cancel") {
                                                                user.applicationEdit = false;
                                                                user.save().catch(err => console.log(err))
                                                                return main.edit(appEmbed.setDescription(`**Applications**\n> Cancelled the wizard.`))
                                                            }
                                                            let array = [];
                                                            for (var i in apps.questions) {
                                                                array.push(apps.questions[i]);
                                                            }

                                                            array[question] = collector.content;
                                                            apps.questions = array;

                                                            await main.edit(appEmbed.setDescription(`**Applications**\n> Successfully edited the question to \`${collector.content}\``));
                                                            apps.save().catch(err => console.log(err));
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    })
                                })
                            }

                        })
                    });
                };
            })
        })
    })
};