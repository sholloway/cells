function establishWorkerContext() {
	return 'undefined' !== typeof WorkerGlobalScope ? self : this;
}

module.exports = { establishWorkerContext };
