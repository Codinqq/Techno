const math = require("mathjs");

module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {

    msg.delete();
    let searchTerm = args.slice(0).join(" ");

    if (!searchTerm) {
        let noEmbed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**Calculate**\n- Calculate a problem, or get the numbers from a number to a another number\n\n> To use the command, use \`${guild.prefix}calculate <calculation>\``);
        return channel.send(noEmbed);
    }
    let embed = new Discord.RichEmbed()
        .setColor(config.color)
        .setDescription(`**Calculation** | \`${searchTerm}\`\n\`${math.eval(searchTerm)}\``);

    return channel.send(embed);

};