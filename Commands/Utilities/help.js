const mongoose = require("mongoose");
const Dashboard = require("../../models/dashboard.js");
const Users = require("../../models/users.js");
const delay = require("delay");
module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    Dashboard.findOne({
        guildID: msg.guild.id
    }, async (err, guild) => {
        if (err) return console.log(err);

        let array = [`**Help** | ***Utilities***\n\nAvailable settings:\n> **-c** | \`Send the message in the current channel\`\n> **-l** | \`Send an announcement in the current channel with @here.\`\n> **-e** | \`Send the message in an embed.\`\n\n> **Afk** | \`Send a message when you're going away.\`\n- \`${guild.prefix}afk [message]\`\n> **Announce** | \`Announce an important message.\` \n- \`${guild.prefix}announce <message> [-c | -l | -b]\`\n> **Bot** | \`Get some information about the bot.\`\n- \`${guild.prefix}bot\`\n> **Echo** | \`Make the bot send a message you define\`\n- \`${guild.prefix}echo <message> [-e]\`\n> **Guild** | \`Get information about the guild.\`\n- \`${guild.prefix}guild\`\n> **Poll** | \`Create a poll, either in the current channel or in #polls\`\n- \`${guild.prefix}poll <message> [-c]\`\n> **Rules** | \`Make an embed with the rules.\`\n- \`${guild.prefix}rules <message> [-c]\`\n> **Setup** | \`Setup Techno for the server\`\n- \`${guild.prefix}setup\`\n> **User** | \`Get some information about a user\`\n- \`${guild.prefix}user [usermention]\`\n> **Ticket** | \`Create or close a ticket.\`\n- \`${guild.prefix}ticket\`\n> **Application** | \`Open up the application-wizard.\`\n- \`${guild.prefix}application\`\n> **Apply** | \`Apply for something using one of the applications.\`\n- \`${guild.prefix}apply\`\n> **Accept** | \`Accept an application\`\n- \`${guild.prefix}accept <user> <reason>\`\n> **Deny** | \`Deny an application\`\n- \`${guild.prefix}deny <user> <reason>\``, `**Help** | ***Staff-Commands***\n\nAvailable settings:\n> **-s** | \`Run the command silently. (Still logs into the bot-logging channel)\`\n\n> **Ban** | \`Ban a spesific user.\`\n- \`${guild.prefix}ban <user> [reason] [-s]\`\n> **Kick** | \`Kick a spesific user.\`\n- \`${guild.prefix}kick <user> [reason] [-s]\`\n> **Mute** | \`Mute a spesific user.\`\n- \`${guild.prefix}mute <user> [reason] [-s]\`\n> **TempBan** | \`Temporarily ban a spesific user.\`\n- \`${guild.prefix}tempban <user> <time> [reason] [-s]\`\n> **TempMute** | \`Temporarily mute a spesific user.\`\n- \`${guild.prefix}tempmute <user> <time> [reason] [-s]\`\n> **Warn** | \`Warn a user when the user breaks a rule.\`\n- \`${guild.prefix}warn <user> <reason> [-s]\`\n> **Clear** | \`Clear messages from the chat.\`\n- \`${guild.prefix}clear <amount> [reason] [-s]\`\n> **Dashboard** | \`Configure the bot.\`\n- \`${guild.prefix}dashboard\``, `**Help** | ***Music***\n\n> **Play** | \`Play a song by searching for it.\`\n- \`${guild.prefix}play <searchterm>\`\n> **Pause** | \`Pause the music\`\n- \`${guild.prefix}pause\`\n> **Resume** | \`Resume the music\`\n- \`${guild.prefix}resume\`\n > **Queue** | \`Check which songs are going to be played.\`\n- \`${guild.prefix}queue\`\n> **NP** | \`Check which song is playing.\`\n- \`${guild.prefix}np\`\n> **Stop** | \`Stop the muusic\`\n- \`${guild.prefix}stop\`\n> **Volume** | \`Change the volume of the music.\`\n- \`${guild.prefix}volume <1-100>\``, `**Help** | ***Miscellaneous***\n\n> **Translate** | \`Translate sentences from one language to a another.\`\n- \`${guild.prefix}translate <to language> <message>\`\n> **Assistant** | \`Search for something or calculate a calculation\`\n- \`${guild.prefix}assistant <searchterm | calculation>\`\n> **Commands** | \`Get the different customcommands.\`\n- \`${guild.prefix}commands\`\n> **CustomCmds** | \`Create, edit or remove customcommands.\`\n- \`${guild.prefix}customcmds\``, `**Help** | ***Levels***\n\n> **Leaderboard** | \`Check who's on the leaderboard.\`\n- \`${guild.prefix}leaderboard\`\n> **Rank** | \`Check your rank.\`\n- \`${guild.prefix}rank [user / user-id]\``];

        let page = 0;

        msg.delete();

        const embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setFooter(`Page ${page+1} of ${array.length}`)
            .setDescription(`${array[page]}`);

        msg.channel.send(embed).then(async m => {

            await m.react("◀️");
            await m.react("▶️");

            const backFilter = (reaction, user) => reaction.emoji.name === "◀️" && user.id === msg.author.id;
            const forwardFilter = (reaction, user) => reaction.emoji.name === "▶️" && user.id === msg.author.id;

            const backwards = m.createReactionCollector(backFilter, {
                time: 60000
            });
            const forwards = m.createReactionCollector(forwardFilter, {
                time: 60000
            });

            backwards.on("collect", async (r) => {
                if (page === 0) return;
                page--;
                embed.setDescription(array[page]);
                embed.setFooter(`Page ${page+1} of ${array.length}`);
                m.edit(embed);
            });

            forwards.on("collect", async (r) => {
                if (page === 4) return;
                page++;
                embed.setDescription(array[page]);
                embed.setFooter(`Page ${page+1} of ${array.length}`);
                m.edit(embed);
            });

        });


    });
};