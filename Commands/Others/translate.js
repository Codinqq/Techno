const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
const translate = require('@vitalets/google-translate-api');

module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    msg.delete();

    let msgtoTranslate = args.slice(1).join(" ");
    let language = args[0];

    if(!language) {
        let noAccessEmbed = new Discord.RichEmbed()
        .setDescription(`**Translate**\n- Translate some text to the language you specified.\n\n> To use the command, use \`${guild.prefix}translate <language> <message to be translated>\``)
        .setColor(config.color);
        return channel.send(noAccessEmbed);
    }

    if(!msgtoTranslate) {
        let noAccessEmbed = new Discord.RichEmbed()
        .setDescription(`**Translate** | *Error*\nYou didn't specify a text to translate.\n\n> \`${guild.prefix}translate <language> <text>\``)
        .setColor(config.color);
        return channel.send(noAccessEmbed);
    }

    translate(msgtoTranslate, {
        to: translate.languages.getCode(language)
    }).then(res => {

        let translateEmbed = new Discord.RichEmbed()
        .setColor(config.color)
        .setDescription(`**Translate**\nSuccessfully translated \`${msgtoTranslate}\` to ${language}!\n\n> ${res.text}`);
        return channel.send(translateEmbed);
    });
}