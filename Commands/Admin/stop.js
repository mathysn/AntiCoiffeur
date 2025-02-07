const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readDatabase, writeDatabase } = require('../../Utils/databaseUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Arrêter l'Anti Coiffeur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        try {
            const serverId = interaction.guildId;
            const db = readDatabase("serverConfig");

            if(db[serverId].isStarted) {
                const stopEmbed = new EmbedBuilder()
                .setTitle("Anti Coiffeur")
                .setDescription("Anti Coiffeur a été arrêté.")
                .setColor("#444444");
        
                await interaction.reply({embeds: [stopEmbed], ephemeral: true});

                db[serverId] = {
                    channelID: db[serverId].channelID,
                    isStarted: false,
                };

                writeDatabase("serverConfig", db);
                
            } else {
                const alreadyStoppedEmbed = new EmbedBuilder()
                .setTitle("Anti Coiffeur")
                .setDescription("Anti Coiffeur est déjà arrêté.")
                .setColor("#444444");
        
                await interaction.reply({embeds: [alreadyStoppedEmbed], ephemeral: true});
            }
        } catch (error) {
            console.error(error);
        }
    }
};