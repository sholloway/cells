/**
 * Runs Conway's Game in a Web Worker.
 */


onmessage = function(event) {
	let msgData = event.data;
	console.log('A message was received by the Conway Broker Worker. It was:');
	console.log(msgData);
	postMessage('Hi');
}
