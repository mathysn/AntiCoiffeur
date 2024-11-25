module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        const sender = message.author;
        const content = message.content;

        try {
            if(sender.id === "577856714347511828" && content.includes("feur")) {
                const channel = message.guild.channels.cache.find(channel => channel.id === "1310284414177120368");
                setTimeout(() => {
                    channel.send("Mais ça va pas ou quoi ?");
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        }
    }
};