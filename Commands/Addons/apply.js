const mongoose = require("mongoose");
const Config = require("../../models/dashboard.js");
const Applications = require("../../models/application.js");
const emoji = require('../../emojis.js');
const ms = require("ms");
const titleize = require('titleize');


module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    const filter = m => m.author.id === msg.author.id;

    Applications.find({
        guildID: msg.guild.id
    }, async (err, app) => {

        let questionsRes = "";
        for (var i in app) {

            questionsRes += `\`${titleize(app[i].name)}\` `;

        }
        const appEmbed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Apply**\nWhich application do you want to take?\n> ${questionsRes}`);

        msg.author.send(appEmbed).then(async main => {
            let collector = await new Discord.MessageCollector(main.channel, filter, {
                max: 1
            });

            collector.on("collect", async (collector, element) => {
                var command = collector.content.toLowerCase();
                let name = "";
                for (var i in app) {
                    if (command === app[i].name) {
                        name = app[i].name
                    }
                }
                await Applications.findOne({
                    guildID: msg.guild.id,
                    name: name
                }, async (err, app) => {
                    if (err) return console.log(err);

                    if (!app) {
                        const errappEmbed = new Discord.RichEmbed()
                            .setColor(config.color)
                            .setDescription(`**Apply** | *Error*\n> Couldn't find a application named \`${command}\``);
                        return msg.author.send(errappEmbed);
                    }

                    var question = 0;
                    var questionResp = "";

                    function questions() {
                        if (app.questions[question]) {

                            const appEmbed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`**Apply** | ${titleize(app.name)}
                                > ${app.questions[question]}`);


                            msg.author.send(appEmbed).then(async m => {
                                let collector = await new Discord.MessageCollector(main.channel, filter, {
                                    max: 1
                                });

                                collector.on("collect", async (collector, element) => {
                                    var command = collector.content;

                                    questionResp += `- ${question + 1}. | ${app.questions[question]}\n> » \`${command}\`\n`;

                                    question++;
                                    questions();
                                });
                            })
                        } else {

                            const noappEmbed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`**Apply** | *Error*\n> Couln't find any channels named #applications\n> To fix this problem, create a channel named "applications", or use the setup command.`);

                            let appChannel = msg.guild.channels.find(c => c.name === "applications");

                            if (!appChannel) {
                                return channel.send(noappEmbed);
                            }

                            const appEmbed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`**Application** | ${titleize(app.name)}

                                    ${questionResp}`)
                                .setFooter(`New application by ${msg.author.tag}`);

                            const appsEmbed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`**Apply**\n> The application is now done, and has been sent to the admins`);

                            msg.author.send(appsEmbed);
                            return appChannel.send(appEmbed);
                        }
                    }
                    questions();
                });
            });
        });
    });
}