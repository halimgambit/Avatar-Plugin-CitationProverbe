exports.action = function(data, callback){

	let client = setClient(data);
	info("CitationProverbe from:", data.client, "To:", client);
	citation (data, client);
	callback();
}

const cheerio = require('cheerio');

async function citation(data, client) {
    try {
        const response = await fetch('http://www.lapunaise.fr/aleatoires');

        if (response.status !== 200) {
            throw new Error(`La connexion a échoué, code erreur: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const proverbe = $('#content_center > div:nth-child(2) > div > div.post > div.bottom > p > a').text();

        Avatar.speak(proverbe, data.client, () => {
            Avatar.Speech.end(data.client);
        });
    } catch (error) {
        Avatar.speak(`Une erreur inattendue s'est produite: ${error.message}`, data.client, () => {
            Avatar.Speech.end(data.client);
        });
    }
}


function setClient (data) {
	let client = data.client;
    if (data.action.room)
	client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	if (data.action.setRoom)
	client = data.action.setRoom;
	return client;
}
