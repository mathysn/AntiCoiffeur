const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Arrêter l'Anti Coiffeur")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        try {
            const stopEmbed = new EmbedBuilder()
                .setTitle("Anti Coiffeur")
                .setDescription("Anti Coiffeur n'est plus en fonctionnement.")
                .setColor("#444444");
        
            await interaction.reply({embeds: [stopEmbed], ephemeral: true});
        } catch (error) {
            console.error(error);
        }
    }
};