const figlet = require('figlet');
const Users = require("../models/users.js");
const CustomCmds = require("../models/customcmds.js");
const Dashboard = require("../models/dashboard.js");

module.exports.run = async (client, config) => {
    figlet('Techno 2.0', async (err, data) => {
        if(err) console.log(err.stack);
        console.log(data);
        console.log(`[Techno] Currently ready!`);
        console.log(`[Techno] Guilds: ${client.guilds.size}`);
        console.log(`[Techno] Users: ${client.users.size}`);
    });
    
    Users.find({}, async (err, user) => {
        
        if(err) return console.log(err.stack);
        
        for(var i in user) {
            user[i].applicationEdit = false;
            user[i].save().catch(err => console.log(err.stack));
        }
        
    });


}