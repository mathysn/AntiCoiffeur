const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("start")
        .setDescription("Démarrer l'Anti Coiffeur"),
        // .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        try {
            const startEmbed = new EmbedBuilder()
                .setTitle("Anti Coiffeur")
                .setDescription("Anti Coiffeur est en fonctionnement.")
                .setColor("#444444");
        
            await interaction.reply({embeds: [startEmbed], ephemeral: true});

            const channel = interaction.guild.channels.cache.find(channel => channel.id === "1310284414177120368");
            channel.send("Ca démarre ou quoi ?");
        } catch (error) {
            console.error(error);
        }
    }
};