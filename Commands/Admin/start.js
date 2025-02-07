const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readDatabase, writeDatabase } = require('../../Utils/databaseUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Démarrer l'Anti Coiffeur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        try {
            const serverId = interaction.guildId;
            if (!serverId) {
                return await interaction.reply({ content: "Impossible de récupérer l'ID du serveur.", ephemeral: true });
            }

            const db = readDatabase("serverConfig");

            if(!db[serverId] || db[serverId].channelID === "") {
                return await interaction.reply({ content: "Veuillez configurer le salon où Anti Coiffeur sera actif.", ephemeral: true });
            }

            const startChannelID = db[serverId].channelID;

            if(!db[serverId].isStarted) {
                const startEmbed = new EmbedBuilder()
                .setTitle("Anti Coiffeur")
                .setDescription("Anti Coiffeur est en fonctionnement.")
                .setColor("#444444");
        
                await interaction.reply({embeds: [startEmbed], ephemeral: true});

                const channel = interaction.guild.channels.cache.find(channel => channel.id === startChannelID);
                channel.send("Ca démarre ou quoi ?");

                db[serverId] = {
                    channelID: startChannelID,
                    isStarted: true,
                };

                writeDatabase("serverConfig", db);
                
            } else {
                const alreadyStartedEmbed = new EmbedBuilder()
                .setTitle("Anti Coiffeur")
                .setDescription("Anti Coiffeur est déjà en fonctionnement.")
                .setColor("#444444");
        
                await interaction.reply({embeds: [alreadyStartedEmbed], ephemeral: true});
            }
            
        } catch (error) {
            console.error(error);
        }
    }
};