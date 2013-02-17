/*
 * NodeJS Gadu-Gadu echo bot.
 *
 * Michał Papierski <michal@papierski.net>
 */
var Gadu = require('gadu')
  , GG = Gadu.Gadu
  , Connection = Gadu.Connection;

// Create new connection instance
var client = new Connection({
	uin: process.env.UIN,
	password: process.env.PASSWORD
})

// Just in case of errors.
client.on('error', function() {
	console.log('Received some error.');	
})

/**
 * Print message as lines, prepending a tag.
 */
var displayMessage = function(tag, input) {
	input.split('\n').forEach(function(str) {
		// Strip white spaces at the end
		var line = str.replace(/^\s+$/g, '')
		console.log(tag, line);
	})
}

// Make a connection
client.connect(function() {
	// Callback is called after we are connected.
	console.log('Success!')
	client.on('message', function(e) {
		var ts = new Date(e.time * 1000)
		console.log('Rx << Received message from', e.sender, 'at', ts);
		displayMessage('Rx <<', e.message)
		// Send message back
		console.log('Tx >> Sending message back to', e.sender);
		client.send(e.sender, e.message, function(result) {
			// Message is sent
			displayMessage('Tx >>', e.message);
			switch (result.status) {
			case GG.GG_ACK_DELIVERED:
				console.log('Tx >> Message is delivered.');
				break;
			case GG.GG_ACK_NOT_DELIVERED:
				console.log('Tx >> Message is not delivered.');
				break;
			default:
				console.log('Tx >> Message is not delivered properly.');
				break;
			}
		})
	})
})

