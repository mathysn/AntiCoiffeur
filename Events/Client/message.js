const { readDatabase, writeDatabase } = require('../../Utils/databaseUtils');

module.exports = {
    name: "messageCreate",
    once: false,
    execute(message) {
        const serverId = message.guild.id;
        if (!serverId) {
            return;
        }

        const db = readDatabase("serverConfig");

        if(!db[serverId] || db[serverId].channelID === "") {
            return;
        }

        const channelID = db[serverId].channelID;
        
        const sender = message.author;
        const content = message.content;

        const possibleReplies = [
            "Mais ça va pas ou quoi ?",
            "Non mais sérieux, tu crois que je vais tomber dans ton piège ou quoi ?",
            "On est encore en 2015 ou quoi ?",
            "Tu crois que je suis un pigeon ou quoi ?",
            "Et là tu penses que t'as gagné quoi ?",
            "Tu veux un trophée pour ça ou quoi ?",
            "Bravo t'as réussi à me faire perdre une seconde quoi",
            "Bon, c'était marrant… en 6e, quoi",
            "On peut passer à autre chose ou quoi ?",
            "Et là, tu te sens drôle, quoi ?",
            "T'es sûr qu'on est toujours en 2025 ou quoi ?",
            "Masterclass ou quoi ?"
        ]

        try {
            if(db[serverId].isStarted && sender.id === "577856714347511828" && content.includes("feur")) {
                const channel = message.guild.channels.cache.find(channel => channel.id === channelID);
                setTimeout(() => {
                    channel.send(possibleReplies[Math.floor(Math.random() * possibleReplies.length)]);
                }, 5000);
            }
        } catch (error) {
            console.error(error);
        }
    }
};