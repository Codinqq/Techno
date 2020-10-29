const ytdl = require("ytdl-core");
const search = require("yt-search");
const convert = require("convert-seconds");
const Dashboard = require("../../models/dashboard.js");

module.exports.run = async (
  client,
  msg,
  channel,
  args,
  config,
  guild,
  Discord,
  u
) => {
  Dashboard.findOne({
    guildID: msg.guild.id
  }, async (err, guild) => {

    msg.delete();

    let searchTerm = args[0];

    let embed = new Discord.RichEmbed().setColor(config.color);

    if (!searchTerm)
      return channel.send(
        embed.setDescription(`**Music**\n- Play some tunes, so you can listen with your friends\n\n> To use the command, use \`${guild.prefix}play <search-term>\``)
      );

    let validate = ytdl.validateURL(searchTerm);
    let data = u.queue.get(msg.guild.id) || {};

    if (!data.connection) data.connection = await msg.member.voiceChannel.join();
    if (!data.queue) data.queue = [];

    async function play() {
      let info4 = await ytdl.getInfo(data.queue[0].url);

      let SECONDS = info4.length_seconds;
      let hours = convert(SECONDS).hours;
      let minutes = convert(SECONDS).minutes;
      let seconds = convert(SECONDS).seconds;
      let formatted;

      if (!hours) {
        formatted = minutes + " minutes " + seconds + " seconds.";
      } else {
        formatted =
          hours + " hours " + minutes + " minutes " + seconds + " seconds.";
      }

      client.channels.get(data.queue[0].announcechannel).send(
        embed.setDescription(`**Music**\n> Now playing [${data.queue[0].songTitle}](${info4.video_url}) \n> Requested by \`${data.queue[0].requester}\`\n> Duration \`${formatted}\``)
      );

      data.dispatcher = await data.connection.playStream(
        ytdl(data.queue[0].url, {
          filter: "audioonly"
        })
      );

      await data.dispatcher.once("end", function () {
        end(client, u, data, this);
      });
    }

    async function end(client, u, dispatcher, data, queue) {
      let fetched = u.queue.get(msg.guild.id);
      fetched.queue.shift();

      if (fetched.queue.length > 0) {
        u.queue.set(dispatcher.guildID, fetched);
        play(client, u, fetched);
      } else {
        u.queue.delete(msg.guild.id);

        msg.guild.me.voiceChannel.leave();

        return channel
          .send(embed.setDescription("**Music**\nThe queue is now finished."))
          .then(msg => msg.delete(2000));
      }
    }

    if (!validate) {
      search(args.slice(0).join(" "), async function (err, res) {
        if (err)
          channel.send(
            embed.setDescription(
              "**Music** | *Error*\n> Something went wrong. Try again."
            )
          );
        let video = res.videos.slice(0, 1);
        let url = video[0].url.replace("/", "");
        let info = await ytdl.getInfo(url || data.queue.url);
        data.queue.push({
          songTitle: info.title,
          requester: msg.author.tag,
          url: url,
          announcechannel: msg.channel.id
        });

        u.queue.set(msg.guild.id, data);

        if (!data.queue[1]) {
          play(client, u, data, this);
        } else {
          channel.send(
            embed.setDescription(`**Music**\n> Added [${info.title}](https://www.youtube.com/${url}) to the queue.`)
          );
        }
      });
    }
  });
};