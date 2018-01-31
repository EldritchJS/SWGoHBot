const {inspect} = require('util');
module.exports = async (client, member) => {
    // This executes when a member joins, so let's welcome them!
    const guild = member.guild;
    const guildSettings = await client.guildSettings.findOne({where: {guildID: guild.id}, attributes: ['adminRole', 'enableWelcome', 'useEmbeds', 'welcomeMessage', 'timezone', 'announceChan', 'welcomeChan']});
    const guildConf = guildSettings.dataValues;

    // Make sure the config option exists. Should not need this, but just in case
    if (!guildConf['welcomeChan']) {
        client.guildSettings.update({welcomeChan: ''}, {where: {guildID: guild.id}});
    }

    // Our welcome message has a bit of a placeholder, let's fix
    if (guildConf.enableWelcome && guildConf.welcomeMessage !== "" && guildConf.welcomeChan !== "") { // If they have it turned on, and it's not empty
        const welcomeMessage = guildConf.welcomeMessage
            .replace(/{{user}}/gi, member.user.username)
            .replace(/{{usermention}}/gi, member.user)
            .replace(/{{server}}/gi, member.guild.name)
            .replace(/{{prefix}}/gi, client.config.prefix);
        try {
            client.announceMsg(guild, welcomeMessage, guildConf.welcomeChan);
        } catch (e) {
            client.log('ERROR', `Error sending welcomeMessage:\n\nGuildConf:\n${inspect(guildConf)}\n\nError:\n${e}`);
        } 
    }
};
