const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { readDatabase, writeDatabase } = require('../../Utils/databaseUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configurer Anti Coiffeur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(channelConfig => 
            channelConfig
                .setName("channel")
                .setDescription("Configurer le salon où Anti Coiffeur sera actif")
                .addChannelOption(channelOption =>
                    channelOption
                        .setName("channel-id")
                        .setDescription("Salon où Anti Coiffeur sera actif")
                        .setRequired(true)
                )
        ),
    async execute(interaction) {
        try {
            const channelOption = interaction.options.getChannel('channel-id');
            if (!channelOption) {
                return await interaction.reply({ content: "Le salon spécifié est invalide.", ephemeral: true });
            }

            const serverId = interaction.guildId;
            if (!serverId) {
                return await interaction.reply({ content: "Impossible de récupérer l'ID du serveur.", ephemeral: true });
            }

            const db = readDatabase("serverConfig");

            db[serverId] = {
                channelID: channelOption.id,
                isStarted: false
            };

            writeDatabase("serverConfig", db);

            const embed = new EmbedBuilder()
                .setColor("#00FF00")
                .setDescription(`Le salon ${channelOption} a été configuré pour l'Anti Coiffeur.`);

            await interaction.reply({ embeds: [embed], ephemeral: true });
            
        } catch (error) {
            console.error(error);
            return await interaction.reply({ content: "Erreur lors de la configuration du salon", ephemeral: true });
        }
    }
};