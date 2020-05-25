const Layers = require('./AppLayers.js');

/**
 * Processes a message received from the grid web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message to be processed.
 */
function handleMessageFromGridWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.GRID, envelope.data);
	}
}

/**
 * Process a message received from the drawing system web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message sent.
 */
function handleMsgFromDrawingWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.DRAWING, envelope.data);
	}
}

/**
 * Process a message received from the life system web worker.
 * This is ran in the context of the AppStateManager.
 * @param {*} envelope - The message sent.
 */
function handleMessageFromLifeWorker(envelope) {
	if (envelope && envelope.data) {
		envelope.data.promisedResponse
			? this.workerSystem.attemptToProcessPendingWork(envelope.data)
			: this.processCycleMessage(Layers.SIM, envelope.data);
	}
}

function setThreadFlagToClean(message) {
	if (message.origin && message.origin == Layers.DRAWING) {
		this.workerSystem.setWorkerDirtyFlag(message.origin, false);
	}
}

module.exports = {
	handleMessageFromGridWorker,
	handleMsgFromDrawingWorker,
	handleMessageFromLifeWorker,
	setThreadFlagToClean,
};
