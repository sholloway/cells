/**
 * An animation system for orchestrating multiple web workers.
 * Requests the updated scene from all registered workers on a timer.
 * 
 * @module system/worker
 */

const { BrowserSystem } = require('./System.js');

const WorkerCommand = {
  SEND_SCENE: 'SEND_SCENE',
}

/**
 * Challenges
 * Need to associate multiple web workers that have already been intialized.
 * Each worker should be pinged during the update cycle. 
 * Need to notify each renderer that the relevant threads have new stuff to render.
 *   This isn't a given though. 
 * 
 * register worker
 * register renderer function? On receiving a message from a worker, this could execute the correct renderer.
 * 
 * Worker System -> Workers: SEND_SCENE
 */
class WorkerSystem extends BrowserSystem {
  constructor(window, config) {
    super(window, config);
    this.workers = new Map(); //Pattern: name|worker instance
  }

  /**
	 * Register a worker. All registered workers will be sent a SEND_SCENE message per tick.
	 * @param {string} name - The worker name.
	 * @param {WebWorker} worker - the worker to ping for update.
	 */
  registerWorker(name, worker) {
    this.workers.set(name, worker);
  }

  /**
	 * Override parent
   * Sends a notifican to each registered web worker.
	 * @private
	 */
  update(frame) {
    this.workers.forEach((worker, name) => {
      worker.postMessage({
        command: WorkerCommand.SEND_SCENE
      });
    });
  }

  /**
	 * Perform post system update logic (e.g. rendering changes).
	 */
	afterUpdates(){
		//TBD: Not sure yet if this makes sense in the worker world.
	}

}

module.exports = WorkerSystem;