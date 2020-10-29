const mongoose = require("mongoose");
const Config = require("../../models/dashboard.js");
const CustomCmds = require("../../models/customcmds.js");
const emoji = require('../../emojis.js');
const ms = require("ms");


module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();
    let addEmbed = new Discord.RichEmbed().setColor(config.color);

    const filter = m => m.author.id === msg.author.id;

    channel.send(addEmbed.setDescription(`**Ticket**\nYou started the ticket-wizard.\n\n**Available options**\n> \`Create a ticket\` | This will create a ticket.\n> \`Close a ticket\` | This will close the ticket.\n\n> To continue, please choose one of the options.\n> To cancel, please write \`cancel\``)).then(async main => {


        let collector = await new Discord.MessageCollector(channel, filter, {max: 1});

        collector.on("collect", async (collector, element) => {
                let todo = collector.content.toLowerCase();
                collector.delete();

                if(todo === "cancel") {
                    return main.edit(addEmbed.setDescription(`**Ticket**\n> Successfully cancelled the ticket-wizard.`));
                }

                if(todo === "create a ticket") {
                    msg.author.send(addEmbed.setDescription(`**Ticket**\n> You chose to create a ticket.\n> What do you want to send?\n\n> To continue, please write a message.\n> To cancel, please write \`cancel\``)).then(async a => {
                        let collector = await new Discord.MessageCollector(a.channel, filter, {max: 1});

                    collector.on("collect", async (collector, element) => {
                            let message = collector.content;

                            if(message.toLowerCase() === "cancel") {
                                return a.edit(addEmbed.setDescription(`**Ticket**\n> Successfully cancelled the ticket-wizard.`));
                            }

                            let ticketCategory = msg.guild.channels.find(c => c.name === "Techno | Tickets");

                            await msg.guild.createChannel(`ticket-${msg.author.discriminator}`, {type: "text"}).then(async channel => {

                                channel.setTopic(`Techno | ${msg.author.tag}'s ticket`);

                                let role1 = msg.guild.roles.find(c => c.name === "Staff");
                                let role2 = msg.guild.defaultRole;

                                channel.overwritePermissions(msg.author ,{
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true
                                 });
                                 channel.overwritePermissions(role1 ,{
                                    SEND_MESSAGES: true,
                                    VIEW_CHANNEL: true
                                 });
                                 channel.overwritePermissions(role2, {
                                    SEND_MESSAGES: false,
                                    READ_MESSAGES: false,
                                    READ_MESSAGE_HISTORY: false
                                });

                                if(!ticketCategory){
                                    msg.guild.createChannel("Techno | Tickets", {type: "category"}).then(async category => {
                                        channel.setParent(category);
                                    })
                                } else {
                                    channel.setParent(ticketCategory);
                                }

                                let ticketEmbed = new Discord.RichEmbed()
                                .setColor(config.color)
                                .setDescription(`**Ticket**\n> Author \`${msg.author.tag}\`\n> Message \`${message}\``);

                                channel.send(ticketEmbed).then(m => {
                                    m.pin();
                                });

                                a.edit(addEmbed.setDescription(`**Ticket**\n> Successfully created the ticket.\n> Go to ${channel} in ${msg.guild.name}`));

                            });

                        });
                    });
                }

                if(todo === "close a ticket") {

                    if(!msg.member.hasPermission("ADMINISTRATOR")) {
                        if(msg.channel.name === `ticket-${msg.author.discriminator}`){
                            main.edit(addEmbed.setDescription(`**Ticket**\n> The ticket has been closed.`));

                            msg.channel.delete("Techno | Ticket has been closed by the sender.");
                        }
                    } else {
                        main.edit(addEmbed.setDescription(`**Ticket**\n> The ticket has been closed.`));
                            msg.channel.delete("Techno | Ticket has been closed by a moderator.");
                    }
                    
                    
                }

                



        });
});
}