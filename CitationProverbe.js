exports.action = function(data, callback){

	let client = setClient(data);

	info("CitationProverbe from:", data.client, "To:", client);

	proverbe (data, client);

	callback();
}

function proverbe (data, client) {
	var tts = Config.modules.CitationProverbe.tts[client];
	var url = 'http://www.lapunaise.fr/aleatoires';
	http_request(url)
	.then(body => scraper(body))
	.then(function(citation) {
	Avatar.speak(tts,data.client,function(){
	Avatar.speak(citation, data.client, function(){ 
	Avatar.Speech.end(data.client);
	});
	});
	})
	.catch(function(err) {
	Avatar.speak(err, data.client, function(){ 
	Avatar.Speech.end(data.client);
	});
	});

function scraper(body) {
	return new Promise(function (resolve, reject) {
	var $ = require('cheerio').load(body, { xmlMode: false, normalizeWhitespace: false, ignoreWhitespace: true, lowerCaseTags: true });
	var citation = $('#content_center > div:nth-child(4) > div > div.post > div.bottom > p').text();
    if (!citation) {
	return reject('Désolé je n\'ai pas trouvé de citation');
}
    resolve (citation);
	});
}

function http_request (url) {
	return new Promise(function (resolve, reject) {
	var request = require('request');
	request({ 'uri' : url, 'encoding': 'binary' }, function (err, response, body) {
	if (err || response.statusCode != 200) {
	return reject ('Désolé je n\'ai pas trouvé de citation');
}
    resolve(body);
	});
	});
}
}

function setClient (data) {
    var client = data.client;
    if (data.action.room)
    client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
    if (data.action.setRoom)
    client = data.action.setRoom;
    return client;
}