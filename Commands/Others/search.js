const ddg = require("ddg");
const math = require("mathjs");

module.exports.run = async (client, msg, channel, args, config, guild, Discord) => {
    
 
    msg.delete();
            let searchTerm = args.slice(0).join(" ");
            
            if(!searchTerm) {
                let noEmbed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Search**\n- Search DuckDuckGo for NON-NSFW terms.\n\n> To use the command, use \`${guild.prefix}search <search-term>\``);
                return channel.send(noEmbed);
            }
            
            let swearWords = ["fuck", "nigga", "porn", "niger", "nigger", "bitch", "whore", "penis", "vagina", "asshole", "dick", "cunt", "thot", "twat", "jerkoff", "arse", "a$$", "as$", "a$s"];
            for(var s in swearWords){
                if(msg.content.toLowerCase().includes(swearWords[s])){
                    let embed = new Discord.RichEmbed()
                    .setDescription(`**Search** | *Error*\n> You can't search for this.`)
                    .setColor(config.color);
                    return channel.send(embed);
                }
            }

        ddg.query(searchTerm, async (err, data) => {
            if(err) return console.log(err);
            
            if(data.Type === "A") {
                let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**${data.AbstractSource}** | [${data.Heading}](${data.AbstractURL})
            \`${data.AbstractText}\``);
            
            return channel.send(embed);
            } else if(data.Type === "D"){
                
                if(!data.AbstractText) {
                    data.AbstractSource = "DuckDuckGo";
                    data.AbstractText = data.RelatedTopics[0].Text;
                    data.AbstractURL = data.RelatedTopics[0].FirstURL;
                }
                
               let embed = new Discord.RichEmbed()
            .setColor(config.color)
            .setDescription(`**${data.AbstractSource}** | [${data.Heading}](${data.AbstractURL})\n\`${data.AbstractText}\``);
            
            return channel.send(embed); 
                
            } else if(!data.AbstractURL){
                let embed = new Discord.RichEmbed()
                .setColor(config.color)
                .setDescription(`**Search** | *Error*\n> Couldn't find any searchterms for \`${searchTerm}\``);
                return channel.send(embed);
            }
            
        });


 
    
};