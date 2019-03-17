!function(e){function t(e){Object.defineProperty(this,e,{enumerable:!0,get:function(){return this[v][e]}})}function r(e){if("undefined"!=typeof System&&System.isModule?System.isModule(e):"[object Module]"===Object.prototype.toString.call(e))return e;var t={default:e,__useDefault:e};if(e&&e.__esModule)for(var r in e)Object.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return new o(t)}function o(e){Object.defineProperty(this,v,{value:e}),Object.keys(e).forEach(t,this)}function n(e){return"@node/"===e.substr(0,6)?c(e,r(m(e.substr(6))),{}):p[e]}function u(e){var t=n(e);if(!t)throw new Error('Module "'+e+'" expected, but not contained in build.');if(t.module)return t.module;var r=t.linkRecord;return i(t,r),a(t,r,[]),t.module}function i(e,t){if(!t.depLoads){t.declare&&d(e,t),t.depLoads=[];for(var r=0;r<t.deps.length;r++){var o=n(t.deps[r]);t.depLoads.push(o),o.linkRecord&&i(o,o.linkRecord);var u=t.setters&&t.setters[r];u&&(u(o.module||o.linkRecord.moduleObj),o.importerSetters.push(u))}return e}}function d(t,r){var o=r.moduleObj,n=t.importerSetters,u=!1,i=r.declare.call(e,function(e,t){if(!u){if("object"==typeof e)for(var r in e)"__useDefault"!==r&&(o[r]=e[r]);else o[e]=t;u=!0;for(var i=0;i<n.length;i++)n[i](o);return u=!1,t}},{id:t.key});"function"!=typeof i?(r.setters=i.setters,r.execute=i.execute):(r.setters=[],r.execute=i)}function l(e,t,r){return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:r,setters:void 0,execute:void 0,moduleObj:{}}}}function f(e,t,r,o){var n={};return p[e]={key:e,module:void 0,importerSetters:[],linkRecord:{deps:t,depLoads:void 0,declare:void 0,execute:o,executingRequire:r,moduleObj:{default:n,__useDefault:n},setters:void 0}}}function s(e,t,r){return function(o){for(var n=0;n<e.length;n++)if(e[n]===o){var u,i=t[n],d=i.linkRecord;return u=d?-1===r.indexOf(i)?a(i,d,r):d.moduleObj:i.module,"__useDefault"in u?u.__useDefault:u}}}function a(t,r,n){if(n.push(t),t.module)return t.module;var u;if(r.setters){for(var i=0;i<r.deps.length;i++){var d=r.depLoads[i],l=d.linkRecord;l&&-1===n.indexOf(d)&&(u=a(d,l,l.setters?n:[]))}r.execute.call(y)}else{var f={id:t.key},c=r.moduleObj;Object.defineProperty(f,"exports",{configurable:!0,set:function(e){c.default=c.__useDefault=e},get:function(){return c.__useDefault}});var p=s(r.deps,r.depLoads,n);if(!r.executingRequire)for(var i=0;i<r.deps.length;i++)p(r.deps[i]);var v=r.execute.call(e,p,c.__useDefault,f);void 0!==v?c.default=c.__useDefault=v:f.exports!==c.__useDefault&&(c.default=c.__useDefault=f.exports);var m=c.__useDefault;if(m&&m.__esModule)for(var b in m)Object.hasOwnProperty.call(m,b)&&(c[b]=m[b])}var f=t.module=new o(r.moduleObj);if(!r.setters)for(var i=0;i<t.importerSetters.length;i++)t.importerSetters[i](f);return f}function c(e,t){return p[e]={key:e,module:t,importerSetters:[],linkRecord:void 0}}var p={},v="undefined"!=typeof Symbol?Symbol():"@@baseObject";o.prototype=Object.create(null),"undefined"!=typeof Symbol&&Symbol.toStringTag&&(o.prototype[Symbol.toStringTag]="Module");var m="undefined"!=typeof System&&System._nodeRequire||"undefined"!=typeof require&&"undefined"!=typeof require.resolve&&"undefined"!=typeof process&&process.platform&&require,y={};return Object.freeze&&Object.freeze(y),function(e,t,n,i){return function(d){d(function(d){var s={_nodeRequire:m,register:l,registerDynamic:f,registry:{get:function(e){return p[e].module},set:c},newModule:function(e){return new o(e)}};c("@empty",new o({}));for(var a=0;a<t.length;a++)c(t[a],r(arguments[a],{}));i(s);var v=u(e[0]);if(e.length>1)for(var a=1;a<e.length;a++)u(e[a]);return n?v.__useDefault:(v instanceof o&&Object.defineProperty(v,"__esModule",{value:!0}),v)})}}}("undefined"!=typeof self?self:"undefined"!=typeof global?global:this)

(["a"], [], true, function($__System) {
var require = this.require, exports = this.exports, module = this.module;
$__System.registerDynamic('b', ['c'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	const { CellStates } = $__require('c');

	/**
  * Enforces the simulation (game) rules.
  */
	class CellEvaluator {
		/**
   * Creates a new evaluator.
   * @param {number[]} birthRules - The required alive neighbors for a cell to be born.
   * @param {number[]} survivalRules - The required alive neighbors for a cell to stay alive.
   */
		constructor(birthRules = [3], survivalRules = [2, 3]) {
			this.birthRules = birthRules;
			this.survivalRules = survivalRules;
		}

		/**
   * Evaluates a cell's next state.
   * @param {number} neighborsCount - The number of a live cells the current cell has.
   * @param {CellState} currentCellState - the current state of cell.
   * @returns {CellState} The state the cell should be set to.
   */
		evaluate(neighborsCount, currentCellState) {
			let nextCellState;
			switch (currentCellState) {
				case CellStates.DEAD:
					nextCellState = this.birthRules.includes(neighborsCount) ? CellStates.ALIVE : CellStates.DEAD;
					break;
				case CellStates.ALIVE:
					nextCellState = this.survivalRules.includes(neighborsCount) ? CellStates.ALIVE : CellStates.DEAD;
					break;
				default:
					throw new Error(`Cannot evaluate cell. Unknown cell state: ${currentCellState}`);
			}
			return nextCellState;
		}
	}

	module.exports = CellEvaluator;
});
$__System.registerDynamic('d', ['e', 'b', 'f', 'c', '10'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	const { Cell, QuadTree, findAliveNeighbors, cloneCells } = $__require('e');
	const CellEvaluator = $__require('b');
	const { Box, ColorByAgeTrait, CircleTrait, ScaleTransformer, GridCellToRenderingEntity,
		ProcessBoxAsRect, ColorByContents, RectOutlineTrait, GridEntity,
		DarkThinLines, GridPattern } = $__require('f');

	const { CellStates } = $__require('c');
	const { SeederFactory, SeederModels } = $__require('10');

	/**
  * Create the default cell evaluator.
  * @private
  * @returns {CellEvaluator}
  */
	function defaultCellEvaluator() {
		return new CellEvaluator();
	}

	/**
  * Create the default simulation seeder.
  * @private
  * @returns {Seeder}
  */
	function defaultSeeder() {
		return SeederFactory.build(SeederModels.RANDOM);
	}

	/**
  * Configure Cells to be render-able.
  * @private
  * @param {object} config - The simulation's configuration object.
  * @param {Cell[]} cells - The list of cells to configure.
  */
	function registerCellTraits(config, cells) {
		cells.forEach(cell => {
			cell.register(new GridCellToRenderingEntity()).register(new ScaleTransformer(config.zoom)).register(new ColorByAgeTrait()).register(new CircleTrait());
		});
	}

	/**
  * Recursively traverses a quad tree and adds the partition boxes to the provided array.
  * @private
  * @param {QTNode} currentNode - The current node to process.
  * @param {Box[]} boxes - The array to add the partition boxes to.
  */
	function collectBoxes(currentNode, boxes) {
		let containsAliveCell = currentNode.index != null;
		boxes.push(new Box(currentNode.rect.x, currentNode.rect.y, currentNode.rect.xx, currentNode.rect.yy, containsAliveCell));
		if (currentNode.subdivided) {
			currentNode.children().forEach(child => {
				collectBoxes(child, boxes);
			});
		}
	}

	/**
  * Configure boxes to be render-able.
  * @private
  * @param {object} config - The simulation's configuration object.
  * @param {Box[]} boxes - The list of boxes to configure.
  */
	function registerBoxTraits(config, boxes) {
		boxes.forEach(box => {
			box.register(new ProcessBoxAsRect()).register(new ScaleTransformer(config.zoom)).register(new ColorByContents()).register(new RectOutlineTrait());
		});
	}

	/**
  * Orchestrates Conway's Game of Life.
  */
	class GameManager {
		/**
   * Create a new GameManager instance.
   * @param {object} config - The simulation's configuration object.
   */
		constructor(config) {
			this.config = config;
			this.currentTree = QuadTree.empty();
			this.nextTree = QuadTree.empty();
		}

		/**
   * The number of cells currently alive in the simulation.
   * @returns {number}
  */
		aliveCellsCount() {
			return this.currentTree.aliveCellsCount();
		}

		/**
   * Creates a deep copy of the cells in the drawing.
   * @returns {Cell[]} The copy of the cells.
   */
		getCells() {
			return cloneCells(this.currentTree.leaves);
		}

		/**
   * Populates the current tree.
   */
		seedWorld(seeder = defaultSeeder()) {
			let aliveCells = seeder.seed(this.config.landscape.width, this.config.landscape.height);
			this.currentTree.index(aliveCells);
			this.nextTree.index();
		}

		/**
   * Traverse the current grid, applying the rules defined by the evaluator and
   * populate the next grid accordingly. No changes are made to the current grid.
   *
   * @param {SceneManager} scene - The active list of things that need to be rendered.
   * @param {CellEvaluator} evaluator - Responsible for evaluating a single cell.
  */
		evaluateCells(scene, evaluator = defaultCellEvaluator()) {
			//1. Traverse every possible cell on the landscape, building up a list of new alive cells.
			let aliveNeighbors, nextCellState, foundCell;
			let nextAliveCells = [];
			for (let row = 0; row < this.config.landscape.width; row++) {
				for (let col = 0; col < this.config.landscape.height; col++) {
					/*
     TODO: There is an opportunity to combine findAliveNeighbors with findCellIfAlive.
     Then, only one traversal would be needed. findAliveNeighbors could be renamed and return
     something like { aliveNeighbors:..., aliveCenter: ... }
     	At the moment there are two tree traversals for every single cell in the grid.
     By combining the two, we might be able to cut the time spent in traversal in half.
     */
					aliveNeighbors = findAliveNeighbors(this.currentTree, row, col);
					foundCell = this.currentTree.findCellIfAlive(row, col); //Returns DeadCell if not alive.
					nextCellState = evaluator.evaluate(aliveNeighbors, foundCell.getState());
					if (nextCellState == CellStates.ALIVE) {
						nextAliveCells.push(new Cell(row, col, foundCell.age + 1));
					}
				}
			}

			//2. Create a new quad tree from the list of alive cells.
			this.nextTree.clear();
			this.nextTree.index(nextAliveCells);

			//3. Feed the cells to the scene manager.
			registerCellTraits(this.config, nextAliveCells);
			scene.push(nextAliveCells);
		}

		evaluateCellsFaster(scene, evaluator = defaultCellEvaluator()) {
			//1. Traverse every possible cell on the landscape, building up a list of new alive cells.
			let aliveNeighborsCount, nextCellState, foundCell, x, y, xx, yy, aliveCells, currentCellState;
			let nextAliveCells = [];
			for (let row = 0; row < this.config.landscape.width; row++) {
				for (let col = 0; col < this.config.landscape.height; col++) {
					// aliveNeighbors = findAliveNeighbors(this.currentTree, row, col)
					// foundCell = this.currentTree.findCellIfAlive(row,col) //Returns DeadCell if not alive.
					x = row - 1, y = col - 1, xx = row + 1, yy = col + 1;

					//Note: This should never be greater than 9 cells.
					aliveCells = this.currentTree.findAliveInArea(x, y, xx, yy);

					//Assume the cell is dead.
					currentCellState = CellStates.DEAD;

					//Count neighbors (O(n)) n max of 9
					aliveNeighborsCount = aliveCells.reduce((count, cell) => {
						if (!(cell.location.row == row && cell.location.col == col)) {
							count++;
						} else {
							//If we stumble upon the current cell, then it is alive.
							currentCellState = CellStates.ALIVE;
						}
						return count;
					}, 0);

					nextCellState = evaluator.evaluate(aliveNeighborsCount, currentCellState);
					if (nextCellState == CellStates.ALIVE) {
						//Find current cell if it was included in the searched range.
						let foundCell = aliveCells.find(cell => {
							return cell.location.row == row && cell.location.col == col;
						});
						let currentAge = foundCell ? foundCell.age : 0;
						nextAliveCells.push(new Cell(row, col, currentAge + 1));
					}
				}
			}

			//2. Create a new quad tree from the list of alive cells.
			this.nextTree.clear();
			this.nextTree.index(nextAliveCells);

			//3. Feed the cells to the scene manager.
			registerCellTraits(this.config, nextAliveCells);
			scene.push(nextAliveCells);
		}

		/**
   * Replace the current tree with the next state tree and re-initializes the next tree to be empty.
   */
		activateNext() {
			this.currentTree = QuadTree.clone(this.nextTree);
			this.nextTree.clear().index();
		}

		/**
   * Traverse the next state data structure and adds it to the scene to be rendered.
   * @param {SceneManager} scene - The active list of things that need to be rendered.
   */
		stageStorage(scene, display) {
			if (!display) {
				return;
			}
			let boxes = [];
			collectBoxes(this.nextTree.root, boxes);
			registerBoxTraits(this.config, boxes);
			scene.push(boxes);
		}

		/**
   * Purges the game manager of all alive cells.
   */
		clear() {
			this.currentTree.clear().index();
			this.nextTree.clear().index();
		}
	}

	module.exports = GameManager;
});
$__System.registerDynamic('11', ['12', '13', 'd'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	const { CanvasBasedSystem } = $__require('12');
	const DefaultConfig = $__require('13');
	const GameManager = $__require('d');

	/**
  * A Quad tree based Conway's Game of Life simulation.
  * @extends CanvasBasedSystem
  */
	class AltLifeSystem extends CanvasBasedSystem {
		/**
   * Creates a new AltLifeSystem.
   * @param {Window} window - The DOM's window object.
   * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
   * @param {object} config - A configuration object.
   */
		constructor(window, htmlCanvasContext, config = DefaultConfig) {
			super(window, htmlCanvasContext, config);
			this.stateManager = new GameManager(this.config);
			this.seeder = null;
		}

		/**
   * Override parent
   * @private
   */
		getStateManager() {
			return this.stateManager;
		}

		/**
   * Override parent
   * @private
   */
		update(frame) {
			this.getStateManager().evaluateCellsFaster(this.scene, this.evaluator);
			this.getStateManager().stageStorage(this.scene, this.displayStorageStructure);
			this.getStateManager().activateNext();
		}

		/**
   * Getter for the number of currently alive cells.
   * @returns {number} The count of alive cells.
   */
		aliveCellsCount() {
			return this.getStateManager().aliveCellsCount();
		}

		/**
   * Sets the simulation seeder to be used.
   * @param {Seeder} seeder - An implementation of the Seeder abstract class.
   */
		setSeeder(seeder) {
			this.seeder = seeder;
		}

		/**
   * Seeds the world when the simulation starts.
   * Overrides parent.
   */
		initializeSimulation() {
			this.getStateManager().seedWorld(this.seeder);
		}
	}

	module.exports = AltLifeSystem;
});
$__System.registerDynamic('14', [], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * A system that draws a uniform grid.
  */
	class GridSystem {
		constructor(htmlCanvasContext, cellSize) {
			this.htmlCanvasContext = htmlCanvasContext;
			this.cellSize = cellSize;
		}

		/**
   * Set the uniform cell size.
   * @param {number} size - The width and height of a cell.
   */
		setCellSize(size) {
			this.cellSize = size;
		}

		/**
   * Renders a grid on a HTML Canvas.
   * @param {number} width - The total width of the grid.
   * @param {*} height - The total height of the grid.
   */
		drawGrid(width, height) {
			this.htmlCanvasContext.strokeStyle = '#757575';
			this.htmlCanvasContext.lineWidth = 0.5;
			for (let x = 0; x < width; x += this.cellSize) {
				this.htmlCanvasContext.beginPath();
				this.htmlCanvasContext.moveTo(x, 0);
				this.htmlCanvasContext.lineTo(x, height);
				this.htmlCanvasContext.stroke();
			}

			for (let y = 0; y < height; y += this.cellSize) {
				this.htmlCanvasContext.beginPath;
				this.htmlCanvasContext.moveTo(0, y);
				this.htmlCanvasContext.lineTo(width, y);
				this.htmlCanvasContext.stroke();
			}
		}

		/**
   * Clears a region of the HTML canvas.
   * @param {number} x - The left most coordinate of the area to clear.
   * @param {number} y - The upper most coordinate of the area to clear.
   * @param {number} width - The width of the area to clear.
   * @param {number} height - The height of the area to clear.
   */
		clear(x, y, width, height) {
			this.htmlCanvasContext.clearRect(x, y, width, height);
		}
	}

	module.exports = GridSystem;
});
$__System.registerDynamic("15", [], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * @private
  */
	function clearCanvas(htmlCanvasContext, config) {
		htmlCanvasContext.clearRect(0, 0, config.canvas.width, config.canvas.height);
	}

	/**
  * Responsible rendering a scene.
  */
	class HTMLCanvasRenderer {
		/**
   * Initializes a new HTMLRenderer
   * @param {HTMLCanvasContext} htmlCanvasContext
   * @param {object} config - The simulation's configuration object.
   */
		constructor(htmlCanvasContext, config) {
			this.htmlCanvasContext = htmlCanvasContext;
			this.config = config;
		}

		/**
   * Renders one frame of the scene.
   * @param {SceneManager} scene - The scene to render.
   */
		render(scene) {
			this.clear();
			while (!scene.fullyRendered()) {
				let entity = scene.nextEntity();
				entity.render(this.htmlCanvasContext);
			}
		}

		/**
   * Erases the entire canvas.
   */
		clear() {
			clearCanvas(this.htmlCanvasContext, this.config);
		}
	}

	module.exports = HTMLCanvasRenderer;
});
$__System.registerDynamic("16", [], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * Data structure for storing the entities ready to render.
  */
	class SceneManager {
		/**
   * Create a new SceneManager
   */
		constructor() {
			this.stack = [];
		}

		/**
   * Add a a single entity or an array of entities to the scene to be rendered.
   * @param {Entity | Entity[]} entity
   * @return {SceneManager} Returns the instance of the SceneManager.
   */
		push(entity) {
			if (Array.isArray(entity)) {
				this.stack = this.stack.concat(entity);
			} else {
				this.stack.push(entity);
			}
			return this;
		}

		/**
   * Pop the next entity off the scene's stack.
   * @returns {Entity} The next entity to render.
   */
		nextEntity() {
			return this.stack.shift();
		}

		/**
   * Determine if the stack is empty or not.
   * @returns {boolean}
   */
		fullyRendered() {
			return !(this.stack.length > 0);
		}

		/**
   * Removes all entities from the stack.
   */
		purge() {
			this.stack = [];
		}
	}

	module.exports = SceneManager;
});
$__System.registerDynamic('12', ['15', '16'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * An animation system for drawing to an HTML Canvas.
  * @module system/canvas
  */

	const HTMLCanvasRenderer = $__require('15');
	const SceneManager = $__require('16');

	/**
  * The possible states the drawing system can be in.
  * @private
  */
	const SystemState = {
		STOPPED: 1,
		PAUSED: 2,
		RUNNING: 3

		/**
   * The supported events the system notifies on.
   */
	};const SystemEvents = {
		TICKED: 'ticked'

		/**
   * Runs the simulation for the required number of ticks.
   * @private
   * @param {number} numTicks - The number of times to update the simulation.
   */
	};function queueUpdates(numTicks) {
		for (var i = 0; i < numTicks; i++) {
			this.lastTick = this.lastTick + this.config.game.tickLength;
			this.simIterationCounter++;
			this.update(this.lastTick);
			notify.bind(this)(SystemEvents.TICKED);
		}
	}

	/**
  * The internal method for notifying all System event subscribers.
  * @private
  */
	function notify(eventName) {
		if (!this.observers.has(eventName)) {
			return;
		}
		this.observers.get(eventName).forEach(observer => observer(this));
	}

	/**
  * Abstract class.
  */
	class BrowserSystem {
		/**
   * Creates a playable system in the context of a browser.
   * @param {Window} window - The DOM's window object.
   */
		constructor(window) {
			this.window = window;
			this.state = SystemState.STOPPED;
			this.simIterationCounter = 0;
			this.observers = new Map();
		}

		/**
   * Provides the current simulation tick.
   * @returns {number}
   */
		numberOfSimulationIterations() {
			return this.simIterationCounter;
		}

		/**
   * An optional initialization method that is invoked when start() is called.
   * @abstract
   */
		initializeSimulation() {}
		//optional. Override if desired.


		/**
   * Begins the simulation
   */
		start() {
			if (this.state == SystemState.STOPPED) {
				this.initializeSimulation();
				this.lastTick = this.window.performance.now();
				// Pretend the first draw was on first update.
				this.lastRender = this.lastTick;
				this.state = SystemState.RUNNING;
				this.simIterationCounter = 0;
			}
		}

		/**
   * Stops the system. Not intended to be restarted.
   */
		stop() {
			if (this.state == SystemState.RUNNING) {
				this.state = SystemState.STOPPED;
			}
		}

		/**
   * Pauses the system. Can be restarted.
   */
		pause() {
			if (this.state == SystemState.RUNNING) {
				this.lastTick = this.window.performance.now();
				this.state = SystemState.PAUSED;
			}
		}

		/**
   * Continue the system.
   */
		resume() {
			if (this.state == SystemState.STOPPED || this.state == SystemState.PAUSED) {
				this.state = SystemState.RUNNING;
				this.lastTick = this.window.performance.now();
			}
		}

		/**
   * The main loop of the simulation.
   * @param {number} tFrame - The current frame.
   */
		main(tFrame) {
			// Looping via callback. Will pass the current time.
			// Can use window.cancelAnimationFrame() to stop if needed.
			this.stopMain = this.window.requestAnimationFrame(this.main.bind(this));
			if (this.state == SystemState.RUNNING) {
				var nextTick = this.lastTick + this.config.game.tickLength;
				var numTicks = 0;

				// If tFrame < nextTick then 0 ticks need to be updated (0 is default for numTicks).
				// If tFrame = nextTick then 1 tick needs to be updated (and so forth).
				// Note: As we mention in summary, you should keep track of how large numTicks is.
				// If it is large, then either your game was asleep, or the machine cannot keep up.
				if (tFrame > nextTick) {
					var timeSinceTick = tFrame - this.lastTick;
					numTicks = Math.floor(timeSinceTick / this.config.game.tickLength);
				}

				queueUpdates.bind(this)(numTicks);
				this.afterUpdates();
				this.lastRender = tFrame;
			}
		}

		/**
  * Progresses the simulation forward by one tick.
  * @abstract
  * @param {number} frame - Reserved. Not currently used.
  */
		update(frame) {
			throw new Error('Children of BrowserSystem must implement an update() method');
		}

		/**
   * Perform post system update logic (e.g. rendering changes).
   * @abstract
   */
		afterUpdates() {
			throw new Error('Children of BrowserSystem must implement afterUpdates().');
		}

		/**
   * Implementation of the observer pattern. Provides the ability
   * to register an event lister.
   * @param {string} eventName - The event to subscribe to.
   * @param {function} observer - The function to be invoked when the event occurs.
   */
		subscribe(eventName, observer) {
			if (!this.observers.has(eventName)) {
				this.observers.set(eventName, []);
			}
			this.observers.get(eventName).push(observer);
		}
	}

	/**
  * Abstract class. Runs an animation on an HTML Canvas.
  * @extends BrowserSystem
  */
	class CanvasBasedSystem extends BrowserSystem {
		/**
   *
   * @param {Window} window - The DOM's window object.
   * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
   * @param {object} config - A configuration object.
   */
		constructor(window, htmlCanvasContext, config) {
			super(window);
			this.config = config;
			this.htmlCanvasContext = htmlCanvasContext;
			this.scene = new SceneManager();
			this.renderer = new HTMLCanvasRenderer(this.htmlCanvasContext, this.config);
			this.displayStorageStructure = false;
		}

		/**
   * Returns the state manager.
   * @abstract
   */
		getStateManager() {
			throw new Error('Children of CanvasBasedSystem must implement getStateManager()');
		}

		afterUpdates() {
			if (!this.scene.fullyRendered()) {
				this.renderer.render(this.scene);
			}
		}

		/**
   * Provides a deep copy of the currently alive cells.
   * @returns {Cell[]}
   */
		getCells() {
			return this.getStateManager().getCells();
		}

		/**
   * Set's the cell size to use.
   * @param {number} size
   */
		setCellSize(size) {
			this.config.zoom = size;
		}

		/**
   * Sets whether to draw the quad tree.
   * @param {boolean} display
   */
		displayStorage(display) {
			this.displayStorageStructure = display;
		}

		/**
   * Clears the simulation.
   */
		reset() {
			this.scene.purge();
			this.getStateManager().clear();
			this.renderer.clear();
		}
	}

	module.exports = {
		BrowserSystem,
		CanvasBasedSystem,
		SystemEvents,
		SystemState
	};
});
$__System.registerDynamic("13", [], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/*
 TODO:
 I want to separate the concept of the HTML canvas size and the grid landscape.
 The landscape should be huge. The canvas should pan across the landscape.
 Rather than a cell width/height should have projection amount to scale by. Like a zoom %.
 */
	let DefaultConfig = {
		canvas: {
			width: 600,
			height: 400
		},
		cell: { //TODO: Remove this.
			width: 20,
			height: 20
		},
		game: {
			interval: 125, //# of milliseconds to loop on.
			tickLength: 125 // Sets the simulation to run at 20Hz (Every 50ms)
		},
		//New stuff below.
		landscape: { //used by quad tree implementation.
			width: 30,
			height: 20
		},
		zoom: 20 //The projection amount to convert a 1x1 grid cell to something that is viewable on the HTML Canvas.
	};

	module.exports = DefaultConfig;
});
$__System.registerDynamic('17', ['e', 'f'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	const { Cell, QuadTree, cloneCells } = $__require('e');

	const { Box, ScaleTransformer, GridCellToRenderingEntity,
		ProcessBoxAsRect, ColorByContents, RectOutlineTrait, FilledRectTrait, StrokeStyle,
		FillStyle } = $__require('f');

	/**
  * Specify what traits to render the cells with.
  * @private
  * @param {object} config - The simulation configuration object.
  * @param {Cell[]} cells - The cells to configure with traits.
  */
	function registerCellTraits(config, cells) {
		cells.forEach(cell => {
			cell.register(new GridCellToRenderingEntity()).register(new ScaleTransformer(config.zoom)).register(new StrokeStyle('#ffeb3b')).register(new FillStyle('#263238')).register(new FilledRectTrait()).register(new RectOutlineTrait());
		});
	}

	/**
  * Recursively traverses a quad tree and adds the partition boxes to the provided array.
  * @private
  * @param {QTNode} currentNode - The current node to process.
  * @param {Box[]} boxes - The array to add the partition boxes to.
  */
	function collectBoxes(currentNode, boxes) {
		let containsAliveCell = currentNode.index != null;
		boxes.push(new Box(currentNode.rect.x, currentNode.rect.y, currentNode.rect.xx, currentNode.rect.yy, containsAliveCell));
		if (currentNode.subdivided) {
			currentNode.children().forEach(child => {
				collectBoxes(child, boxes);
			});
		}
	}

	/**
  * Specify what traits to render the quad tree boxes with.
  * @private
  * @param {object} config - The simulation configuration object.
  * @param {Box[]} boxes - An array of boxes to add traits to.
  */
	function registerBoxTraits(config, boxes) {
		boxes.forEach(box => {
			box.register(new ProcessBoxAsRect()).register(new ScaleTransformer(config.zoom)).register(new ColorByContents()).register(new RectOutlineTrait());
		});
	}

	/**
  * Orchestrates drawing.
  */
	class DrawingStateManager {
		/**
   * Create a new DrawingStateManager.
   * @param {object} config - The simulation configuration object.
   */
		constructor(config) {
			this.config = config;
			this.cells = [];
			this.currentTree = QuadTree.empty();
			this.nextTree = QuadTree.empty();
			this.currentTree.index(this.cells);
		}

		/**
   * Set's what cells should be in the initial drawing.
   * @param {Cell[]} cells - An array of alive cells.
   */
		setCells(cells) {
			this.clear();
			this.cells = cells;
			this.currentTree.index(this.cells);
		}

		/**
   * Creates a deep copy of the cells in the drawing.
   * @returns {Cell[]} The copy of the cells.
   */
		getCells() {
			return cloneCells(this.cells);
		}

		/**
   * Draws a cell or removes it.
   * @param {number} x - The X coordinate on the simulation's grid.
   * @param {number} y - The Y coordinate on the simulation's grid.
   */
		toggleCell(x, y) {
			let node = this.currentTree.search(new Cell(x, y));
			if (node == null) {
				//Doesn't exist. Add it.
				this.cells.push(new Cell(x, y, 1));
				this.nextTree.clear();
				this.nextTree.index(this.cells);
			} else {
				//remove it.
				this.cells.splice(node.index, 1);
				this.nextTree.clear();
				this.nextTree.index(this.cells);
			}
			this.activateNext();
		}

		/**
   * Prepares the alive cells to be drawn.
   * @param {SceneManager} scene - The scene to add the cells to.
   */
		processCells(scene) {
			let clones = cloneCells(this.cells);
			registerCellTraits(this.config, clones);
			scene.push(clones);
		}

		/**
   * Replaces the current tree with the next state tree and re-initializes the next
   * tree to be empty.
   */
		activateNext() {
			this.currentTree = QuadTree.clone(this.nextTree);
			this.nextTree.clear().index();
		}

		/**
   * Empties the drawing simulation.
   */
		clear() {
			this.currentTree.clear().index();
			this.nextTree.clear().index();
			this.cells = [];
		}

		/**
   * Traverses the next state data structure and adds it to the scene to be rendered.
   * @param {SceneManager} scene - The active list of things that need to be rendered.
   */
		stageStorage(scene, display) {
			if (!display) {
				return;
			}
			let boxes = [];
			collectBoxes(this.currentTree.root, boxes);
			registerBoxTraits(this.config, boxes);
			scene.push(boxes);
		}
	}

	module.exports = DrawingStateManager;
});
$__System.registerDynamic('18', ['12', '13', '17'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	const { CanvasBasedSystem } = $__require('12');
	const DefaultConfig = $__require('13');
	const DrawingStateManager = $__require('17');

	/**
  * A system for drawing on a grid.
  * @extends CanvasBasedSystem
  */
	class DrawingSystem extends CanvasBasedSystem {
		/**
   * Creates a new drawing system.
   * @param {Window} window - The DOM's window object.
   * @param {HTMLCanvasContext} htmlCanvasContext - An HTML5 Canvas 2D context.
   * @param {object} config - A configuration object.
   */
		constructor(window, htmlCanvasContext, config = DefaultConfig) {
			super(window, htmlCanvasContext, config);
			this.stateManager = new DrawingStateManager(this.config);
		}

		/**
   * Override parent
   * @private
   */
		getStateManager() {
			return this.stateManager;
		}

		/**
   * Override parent
   * @private
   */
		update(frame) {
			this.getStateManager().stageStorage(this.scene, this.displayStorageStructure);
			this.getStateManager().processCells(this.scene);
		}

		/**
   * Used to preload the drawing system with alive cells.
   * @param {Cell[]} cells - An array of alive cells.
   */
		setCells(cells) {
			this.getStateManager().setCells(cells);
		}

		/**
   * Flips a grid cell to alive or dead.
   * @param {number} x - The X coordinate of the cell.
   * @param {number} y - The Y coordinate of the cell.
   */
		toggleCell(x, y) {
			this.getStateManager().toggleCell(x, y);
		}
	}

	module.exports = DrawingSystem;
});
$__System.registerDynamic("c", [], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  /**
   * Defines the possible states a Cell can have.
   */
  module.exports.CellStates = {
    DEAD: 0,
    ALIVE: 1
  };
});
$__System.registerDynamic('f', [], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * A module for defining render-able entities with traits.
  * @module entity_system
  */

	/**
  * Abstract class. Defines a render-able trait that can be processed.
  */
	class Trait {
		/**
   * Creates a new trait.
   */
		constructor() {}
		/**
   * Function that controls what the trait does.
   * @abstract
   * @param {object} context - The render context.
   */
		process(context) {
			throw new Error('Traits must implement a process method.');
		}
	}

	/**
  * A render-able entity. The entity is defined by registering traits.
  */
	class Entity {
		/**
   * Create a new Entity.
   */
		constructor() {
			this.traits = [];
		}

		/**
   * Process all register traits.
   * @param {HTMLCanvasContext} rendererContext
   */
		render(rendererContext) {
			let context = {
				rendererContext: rendererContext,
				entity: this
			};
			this.traits.forEach(trait => {
				trait.process(context);
			});
		}

		/**
   * Expands the definition of the entity by registering traits.
   * @param {Trait} trait - An implementation of the Trait abstract class.
   */
		register(trait) {
			this.traits.push(trait);
			return this;
		}
	}

	/**
  * Selects a color based on the provided age.
  * @param {number} age
  * @returns {string} color
 */
	function fillStyle(age) {
		if (typeof age !== 'number') {
			throw new Error('The trait ageBasedColor requires a property "age" be set to a number.');
		}

		let color = null;
		switch (true) {
			case age <= 1:
				color = '#e3f2fd';
				break;
			case age == 2:
				color = '#bbdefb';
				break;
			case age == 3:
				color = '#90caf9';
				break;
			case age > 3 && age <= 5:
				color = '#64b5f6';
				break;
			case age > 5 && age <= 8:
				color = '#42a5f5';
				break;
			case age > 8 && age <= 13:
				color = '#2196f3';
				break;
			case age > 13 && age <= 21:
				color = '#1e88e5';
				break;
			case age > 21 && age <= 34:
				color = '#1976d2';
				break;
			case age > 34 && age <= 55:
				color = '#1565c0';
				break;
			case age > 55 && age <= 89:
				color = '#0d47a1';
				break;
			case age > 89 && age <= 144:
				color = '#263238'; //Dark Blue Grey
				break;
			case age > 144 && age <= 233:
				color = '#870000'; //Dark Orange
				break;
			case age > 233 && age <= 377:
				color = '#bf360c';
				break;
			case age > 377:
				color = '#ffeb3b'; //Bright Yellow
				break;
			default:
				throw new Error(`Unexpected Age: ${age}`);
		}
		return color;
	}

	/**
  * Sets the fill and stroke style by the entity's age.
  */
	class ColorByAgeTrait extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.fillStyle = fillStyle(context.entity.age);
			context.strokeStyle = 'rgb(0, 0, 0)';
		}
	}

	/**
  * Creates a new render-able entity in the rendering context.
  */
	class GridCellToRenderingEntity extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.rendering = context.rendering || {};
			context.rendering.entity = {};

			//Define Upper Left Corner (X,Y)
			context.rendering.entity.x = context.entity.location.row;
			context.rendering.entity.y = context.entity.location.col;

			//Define width & height
			context.rendering.entity.width = context.entity.width;
			context.rendering.entity.height = context.entity.height;
		}
	}

	/**
  * Scales a rendering entity by a constant scaling factor.
  */
	class ScaleTransformer extends Trait {
		/**
   * Create a new scale transformer.
   * @param {number} scalingFactor
   */
		constructor(scalingFactor) {
			super();
			this.scalingFactor = scalingFactor;
		}

		process(context) {
			if (typeof context.rendering === 'undefined' || typeof context.rendering.entity === 'undefined') {
				throw new Error('ScaleTransformer attempted to process an entity that did not have context.rendering or context.rendering.entity defined.');
			}
			context.rendering.entity.x = context.rendering.entity.x * this.scalingFactor;
			context.rendering.entity.y = context.rendering.entity.y * this.scalingFactor;
			context.rendering.entity.width = context.rendering.entity.width * this.scalingFactor;
			context.rendering.entity.height = context.rendering.entity.height * this.scalingFactor;
		}
	}

	const TWO_PI = Math.PI * 2;
	const DEFAULT_CIRCLE_FILL_STYLE = 'rgb(44, 193, 59)';
	const DEFAULT_CIRCLE_STROKE_STYLE = 'rgb(0, 0, 0)';

	/**
  * Draws a filled in circle with a stroke.
  */
	class CircleTrait extends Trait {
		constructor() {
			super();
		}

		process(context) {
			//find center
			//this.x, this.y, this.width, this.height
			let cx = context.rendering.entity.x + context.rendering.entity.width / 2;
			let cy = context.rendering.entity.y + context.rendering.entity.height / 2;
			let radius = context.rendering.entity.width / 2;

			context.rendererContext.fillStyle = context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
			context.rendererContext.strokeStyle = context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
			context.rendererContext.beginPath();
			context.rendererContext.arc(cx, cy, radius, 0, TWO_PI, true);
			context.rendererContext.fill();
			context.rendererContext.stroke();
		}
	}

	/**
  * Creates a new render-able entity.
  */
	class ProcessBoxAsRect extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.rendering = context.rendering || {};
			context.rendering.entity = {};
			context.rendering.entity.x = context.entity.x;
			context.rendering.entity.y = context.entity.y;
			context.rendering.entity.width = context.entity.xx - context.entity.x;
			context.rendering.entity.height = context.entity.yy - context.entity.y;
		}
	}

	/**
  * Defines the stroke style based on if an entity is alive.
  */
	class ColorByContents extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.lineWidth = 2;
			context.strokeStyle = context.entity.alive ? '#c41c00' : '#0d47a1';
		}
	}

	/**
  * Defines a dark fill and stroke style.
  */
	class DarkFillTrait extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.fillStyle = '#263238';
			context.strokeStyle = '#263238';
		}
	}

	/**
  * Stroke style pass through.
  */
	class StrokeStyle extends Trait {
		constructor(strokeStyle) {
			super();
			this.strokeStyle = strokeStyle;
		}

		process(context) {
			context.strokeStyle = this.strokeStyle;
		}
	}

	/**
  * Fill Style pass through.
  */
	class FillStyle extends Trait {
		constructor(fillStyle) {
			super();
			this.fillStyle = fillStyle;
		}

		process(context) {
			context.fillStyle = this.fillStyle;
		}
	}

	/** Draws a rectangle. */
	class RectOutlineTrait extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.rendererContext.strokeStyle = context.strokeStyle || DEFAULT_CIRCLE_STROKE_STYLE;
			context.rendererContext.strokeRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height);
		}
	}

	/**
  * Fills a rectangle.
  */
	class FilledRectTrait extends Trait {
		constructor() {
			super();
		}

		process(context) {
			context.rendererContext.fillStyle = context.fillStyle || DEFAULT_CIRCLE_FILL_STYLE;
			context.rendererContext.fillRect(context.rendering.entity.x, context.rendering.entity.y, context.rendering.entity.width, context.rendering.entity.height);
		}
	}

	/**
  * Sets the stroke style to a thin, dark line.
  */
	class DarkThinLines extends Trait {
		constructor() {
			super();
		}

		process(context) {
			//TODO Make Background #f5f5f. Background is it's own enity.
			context.rendererContext.strokeStyle = '#757575';
			context.rendererContext.lineWidth = 0.5;
		}
	}

	/**
  * Draws a grid.
  */
	class GridPattern extends Trait {
		constructor() {
			super();
		}

		process(context) {
			//Draw vertical lines
			for (let x = 0; x < context.entity.width; x += context.entity.cell.width) {
				context.rendererContext.beginPath();
				context.rendererContext.moveTo(x, 0);
				context.rendererContext.lineTo(x, context.entity.height);
				context.rendererContext.stroke();
			}

			for (let y = 0; y < context.entity.height; y += context.entity.cell.height) {
				context.rendererContext.beginPath();
				context.rendererContext.moveTo(0, y);
				context.rendererContext.lineTo(context.entity.width, y);
				context.rendererContext.stroke();
			}
		}
	}

	/**
  * A grid.
  */
	class GridEntity extends Entity {
		/**
   * Creates a new grid entity
   * @param {number} width - The total width of the grid.
   * @param {number} height - The total height of the grid.
   * @param {number} cWidth - The width of a grid cell.
   * @param {number} cHeight - The height of a grid cell.
   */
		constructor(width, height, cWidth, cHeight) {
			super();
			this.width = width;
			this.height = height;
			this.cell = { width: cWidth, height: cHeight };
		}
	}

	/**
  * Represents a box that can be processed via Traits.
  */
	class Box extends Entity {
		/**
   * Creates a new Box.
   * @param {number} x - Left most X coordinate.
   * @param {number} y - Upper most Y coordinate.
   * @param {number} xx - Right most X coordinate.
   * @param {number} yy - Lower most Y coordinate.
   * @param {boolean} alive - If the cell is alive or not.
   */
		constructor(x, y, xx, yy, alive) {
			super();
			this.x = x;
			this.y = y;
			this.xx = xx;
			this.yy = yy;
			this.alive = alive;
		}
	}

	module.exports = {
		Box,
		CircleTrait,
		ColorByAgeTrait,
		ColorByContents,
		DarkFillTrait,
		DarkThinLines,
		Entity,
		FilledRectTrait,
		FillStyle,
		GridCellToRenderingEntity,
		GridEntity,
		GridPattern,
		ProcessBoxAsRect,
		RectOutlineTrait,
		ScaleTransformer,
		StrokeStyle,
		Trait
	};
});
$__System.registerDynamic('e', ['c', 'f'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * A module for working with a 2D quadtree.
  * @module quadtree
  */

	const { CellStates } = $__require('c');
	const { Entity } = $__require('f');

	/**
  * Represents a single unit on an abstract 2D grid.
  *
  * The width and height of the cell are the equal.
  * The grid is uniform.
  * @extends Entity
  */
	class Cell extends Entity {
		/**
   * Create a new cell.
   * @param {number} row - The horizontal location of the cell on a grid.
   * @param {number} col - The vertical location of the cell on a grid.
   * @param {number} age - The number of simulation iterations the cell has been alive.
   * @param {CellState} state - The state of the cell.
   */
		constructor(row, col, age = 0, state = CellStates.ALIVE) {
			super();
			this.location = { row: row, col: col };
			this.age = age;
			this.width = 1;
			this.height = 1;
			this.state = state;
		}

		/**
   * Intersection Test. Is the cell inside of a provided rectangle.
   * @param {number} x
   * @param {number} y
   * @param {number} xx
   * @param {number} yy
   * @returns {boolean}
   */
		isInsideRect(x, y, xx, yy) {
			return x <= this.location.row && this.location.row <= xx && y <= this.location.col && this.location.col <= yy;
		}

		/**
   * Getter for the cell's state.
   */
		getState() {
			return this.state;
		}

		/**
   * Create a deep copy of the cell.
   * @returns {Cell}
   */
		clone() {
			return new Cell(this.location.row, this.location.col, this.age, this.state);
		}
	}

	/**
  * Singleton instance of a dead cell.
  * */
	const DeadCell = new Cell(Infinity, Infinity, 0, CellStates.DEAD);
	Object.freeze(DeadCell);

	let idCount = 0;
	/**
  * Generate a unique ID for a node in the quad tree. Used for debugging.
  * @private
  */
	function generateId() {
		return idCount++;
	}

	/**
  * A node in the pointer based quad tree.
  */
	class QTNode {
		/**
   * Initialize a new QTNode.
   * @param {number} id - The unique identifier of the node.
   * @param {number} x
   * @param {number} y
   * @param {number} xx
   * @param {number} yy
   */
		constructor(id, x, y, xx, yy) {
			this.id = id;
			this.rect = {
				x: x,
				y: y,
				xx: xx,
				yy: yy
			};
			this.area = this.area();
			this.subdivided = false; //Flag indicating this node has been subdivided.

			//The potential children of this node.
			this.upperLeft = null;
			this.upperRight = null;
			this.lowerLeft = null;
			this.lowerRight = null;

			//The index is a reference to the data in the array containing all the live cells.
			//It should be the number index, not a pointer to the data itself.
			//If it is null, then this node is empty or not a leaf.
			this.index = null;
		}

		/**
   * Returns true if the region doesn't contain a point yet.
   * @returns {boolean}
   */
		empty() {
			return this.index === null;
		}

		/**
   * Sets all class members to null.
   */
		destroy() {
			this.id = null;
			this.rect = null;
			this.area = null;
			this.upperLeft = null;
			this.upperRight = null;
			this.lowerLeft = null;
			this.lowerRight = null;
			this.index = null;
		}

		/**
   * Returns the all the children as an array. Returns an empty array if the children have not been initialized yet.
   * @return {QTNode[]}
   */
		children() {
			let kids = null;
			if (this.subdivided) {
				kids = [this.upperLeft, this.upperRight, this.lowerLeft, this.lowerRight];
			} else {
				kids = [];
			}
			return kids;
		}

		/**
   * Rectangle/Point intersection test
   * @param {number} x - Left most boundary of the rectangle
   * @param {number} y - Upper most boundary of the rectangle
   * @returns {boolean}
   */
		containsPoint(x, y) {
			return this.rect.x <= x && x <= this.rect.xx && this.rect.y <= y && y <= this.rect.yy;
		}

		/**
   * Tests if a given cell is fully contained by the QTNode's bounding box.
   * This is defined by all 4 points of the cell being inside (or on edge)
   * of the bounding box.
   *
   * @param {Cell} cell
   * @returns {boolean}
   */
		containsRect(cell) {
			if (cell == null || cell == undefined) {
				throw new Exception('QTNode.contains cannot process a null cell.');
			}

			//Since both the cell and bounding box are aligned to the same axes
			//we can just check the min and max points.
			return this.containsPoint(cell.location.row, cell.location.col) && this.containsPoint(cell.location.row + cell.width, cell.location.col + cell.height);
		}

		/**
   * Axis-aligned bounding box intersection test.
   * @param {number} x
   * @param {number} y
   * @param {number} xx
   * @param {number} yy
   * @returns {boolean} Returns whether or not the node's bounding box intersects the provided range.
   */
		intersectsAABB(x, y, xx, yy) {
			let intersects = false;
			if (this.rect.x <= xx && this.rect.xx >= x && this.rect.y <= yy && this.rect.yy >= y) {
				intersects = true;
			}
			return intersects;
		}

		/**
   * Tests to see if the Node's AABB is inside the provided rectangle.
   * @param {number} x
   * @param {number} y
   * @param {number} xx
   * @param {number} yy
   * @returns {boolean}
   */
		isInsideRect(x, y, xx, yy) {
			let firstPointIntersection = x <= this.rect.x && this.rect.x <= xx && y <= this.rect.y && this.rect.y <= yy;

			let secondPointIntersection = x <= this.rect.xx && this.rect.xx <= xx && y <= this.rect.yy && this.rect.yy <= yy;

			return firstPointIntersection && secondPointIntersection;
		}

		/**
   * Calculates the area of the bounding rectangle.
   * Formula: Area = Length * Height
   *
   * @returns {number} The area of the rectangle.
   */
		area() {
			let length = Math.abs(this.rect.xx) - Math.abs(this.rect.x);
			let height = Math.abs(this.rect.yy) - Math.abs(this.rect.y);
			return length * height;
		}

		/**
   * Set the node to a leaf. This is where the data lives.
   * @param {number} index - The location of the leaf.
   */
		setLeaf(index) {
			this.index = index;
		}

		/**
   * Divides the node's region into 4 equal quadrants.
   *
   * Given the bounding box BB divide into the Quadrants Q1, Q2, Q3 & Q4 where:
   * BB ------------------->
   *    |   Q1   |   Q2   |
   *    |--------|--------|
   *    |   Q3   |   Q4   |
   *    -------------------
   *
   * And the quadrants being divided by the point (p,q).
   */
		subdivide() {
			//Only support the scenario of subdividing exactly once.
			if (this.subdivided) {
				return;
			}

			let p = this.rect.x + Math.ceil((Math.abs(this.rect.xx) - Math.abs(this.rect.x)) / 2);
			let q = this.rect.y + Math.ceil((Math.abs(this.rect.yy) - Math.abs(this.rect.y)) / 2);

			//How to handle overlap?..
			this.upperLeft = new QTNode(generateId(), this.rect.x, this.rect.y, p, q); //Q1
			this.upperRight = new QTNode(generateId(), p, this.rect.y, this.rect.xx, q); //Q2
			this.lowerLeft = new QTNode(generateId(), this.rect.x, q, p, this.rect.yy); //Q3
			this.lowerRight = new QTNode(generateId(), p, q, this.rect.xx, this.rect.yy); //Q4
			this.subdivided = true;
		}
	}

	/**
 * Create an empty Axis-aligned bounding box.
 * @returns {object} An AABB defined by two points.
 */
	function emptyAABB() {
		return {
			rowMin: 0, colMin: 0,
			rowMax: 0, colMax: 0
		};
	}

	/**
 * Constructs an axis aligned bounding box from a set of cells
 * on a uniform grid.
 *
 * @param {Cell[]} cells - An array of alive cells.
 * @returns {object} An AABB defined by two points.
 */
	function buildAxisAlignedBoundingBox(cells) {
		let rowMin = cells[0].location.row;
		let rowMax = cells[0].location.row;
		let colMin = cells[0].location.col;
		let colMax = cells[0].location.col;
		cells.forEach(cell => {
			rowMin = Math.min(rowMin, cell.location.row);
			rowMax = Math.max(rowMax, cell.location.row);
			colMin = Math.min(colMin, cell.location.col);
			colMax = Math.max(colMax, cell.location.col);
		});
		// The max is increased by one in both axis to
		// account for including the farthest cell rather
		// than intersecting it.
		return {
			rowMin: rowMin, colMin: colMin,
			rowMax: rowMax + 1, colMax: colMax + 1
		};
	}

	/**
 We want to use recursion to add a cell to quad tree.
 Starting with the root, check to see if the cell belongs the active node,
 if it does not, then subdivide by 4 and call each new child recursively.
 
 @param {number} minimumCellSize - The smallest area a partition can have.
 @param {QTNode} node - The node in the QuadTree to start the test.
 @param {Cell} cell - The cell to be added to the QualTree.
 @param {number} index - The location of the cell in the array of leaves.
 */
	function addCell(minimumCellSize, node, cell, index) {
		//If the cell does not fall in the node's bounding box end.
		if (!node.containsRect(cell)) {
			return;
		}

		//Is this the smallest a region can be? If so set the index otherwise subdivide.
		//Experiment: Rather than have the cell get to the minimum area, just add the cell
		//if none exist. However, the challenge with that, is when the second point is added,
		//the previously added leaf needs to be moved.
		/* Original
  if(minimumCellSize >= node.area)
  {
  	//set the cell
  	node.setLeaf(index)
  	return
  }else{
  	if (!node.subdivided){
  		node.subdivide()
  	}
  	//make recursive call for each quadrant
  	node.children().forEach((quadrant) => {
  		addCell(minimumCellSize, quadrant, cell, index)
  	})
  }
  */

		if (node.subdivided) {
			//Index should always be empty
			//make recursive call for each quadrant
			node.children().forEach(quadrant => {
				addCell.bind(this)(minimumCellSize, quadrant, cell, index);
			});
		} else {
			if (node.empty()) {
				node.setLeaf(index);
				return;
			} else {
				//If it's not empty, there's already a cell here. We need to subdivide and reposition the existing cell.
				node.subdivide();
				let relocateCell = this.leaves[node.index];
				let relocateCellIndex = node.index;
				node.setLeaf(null);
				node.children().forEach(quadrant => {
					//attempt to place the existing cell
					addCell.bind(this)(minimumCellSize, quadrant, relocateCell, relocateCellIndex);

					//attempt to place the current cell
					addCell.bind(this)(minimumCellSize, quadrant, cell, index);
				});
			}
		}
	}

	/**
  * Given an array and index, verifies that the index is valid.
  * @param {Array} array - The array to verify the index against.
  * @param {number} index - The index to verify
  * @returns {Boolean}
  */
	function validIndex(array, index) {
		return typeof index === 'number' && index >= 0 && index <= array.length - 1;
	}

	/**
  * Deletes the provided and all children nodes.
  * @param {QTNode} node - The node to start the top-down delete from.
  */
	function recursiveDelete(node) {
		if (typeof node === 'undefined' || node === null) {
			return;
		}
		recursiveDelete(node.upperLeft);
		recursiveDelete(node.upperRight);
		recursiveDelete(node.lowerLeft);
		recursiveDelete(node.lowerRight);
		node.destroy();
	}

	/**
  * A pointer based 2D spatial quad tree.
  */
	class QuadTree {
		constructor(liveCells) {
			this.leaves = liveCells;
			this.root = null;
			this.minimumCellSize = 1;
		}

		aliveCellsCount() {
			return this.leaves.length;
		}

		/**
   * Empties the tree. It sets the leaves to an empty array and recursively deletes all nodes.
   * @returns {QuadTree} The instance of the tree being operated on.
   */
		clear() {
			recursiveDelete(this.root);
			this.root = null;
			this.leaves = [];
			return this;
		}

		/**
   * Create a new empty quad tree.
   */
		static empty() {
			return new QuadTree([]);
		}

		/**
   * Creates a deep copy of the provided quad tree.
   * @param {QuadTree} tree
   * @returns {QuadTree} A deep copy of the tree. Returns an empty tree if passed null.
   */
		static clone(tree) {
			if (typeof tree === 'undefined' || tree === null) {
				return QuadTree.empty();
			}

			let clonedCells = [];
			tree.leaves.forEach(leaf => {
				clonedCells.push(leaf.clone());
			});
			let clonedTree = new QuadTree(clonedCells);
			clonedTree.index();
			return clonedTree;
		}

		/**
   * Build the spatial data structure based on a provided array of cells.
   * @param {Cell[]} liveCells
   * @returns {QTNode} Returns the root of the tree.
   */
		index(liveCells = null) {
			if (liveCells !== null) {
				this.leaves = liveCells;
			}
			this.boundary = this.leaves.length > 0 ? buildAxisAlignedBoundingBox(this.leaves) : emptyAABB();
			this.root = new QTNode(generateId(), this.boundary.rowMin, this.boundary.colMin, this.boundary.rowMax, this.boundary.colMax);

			this.leaves.forEach((cell, index) => {
				addCell.bind(this)(this.minimumCellSize, this.root, cell, index);
			});
			return this.root;
		}

		/**
   * Recursively searches for an alive cell in the tree.
   * @param {Number} x - The column coordinate of the cell.
   * @param {Number} y - The row column coordinate of the cell.
   *
   * @returns {QTNode} Returns the node that points to the alive cell if it exists. Otherwise returns null.
   */
		search(cell, currentNode = this.root) {
			if (currentNode === null) {
				throw new Error('Cannot search a null tree.');
			}
			// End the search
			if (currentNode.area == this.minimumCellSize) {
				if (currentNode.containsRect(cell) && currentNode.index !== null) {
					return currentNode;
				} else {
					return null;
				}
			}

			//End Search
			if (!currentNode.subdivided) {
				return null;
			}

			//try searching on the left of the horizontal partition.
			let cellRightBoundary = cell.location.row + cell.width;
			let cellLowerBoundary = cell.location.col + cell.height;
			let horizontalPartition = currentNode.upperLeft.rect.xx;
			let verticalPartition = currentNode.upperLeft.rect.yy;
			let nextNode = null;
			if (cellRightBoundary <= horizontalPartition) {
				// The right most boundary of the cell is to the left horizontal partition.
				if (cellLowerBoundary <= verticalPartition) {
					//try upper left
					nextNode = currentNode.upperLeft;
				} else {
					//try lower left
					nextNode = currentNode.lowerLeft;
				}
			} else {
				//try searching on the right of the horizontal partition.
				if (cellLowerBoundary <= verticalPartition) {
					//try upper right
					nextNode = currentNode.upperRight;
				} else {
					//try lower right
					nextNode = currentNode.lowerRight;
				}
			}
			return nextNode === null ? null : this.search(cell, nextNode);
		}

		//Most time is spent here according to profiler.
		/**
   * Finds a cell if it is alive in landscape.
   * @param {number} row
   * @param {number} col
   * @returns {Cell} Returns the found cell or the DeadCell.
   */
		findCellIfAlive(row, col) {
			let foundLeafNode = this.search(new Cell(row, col));
			if (foundLeafNode !== null && validIndex(this.leaves, foundLeafNode.index)) {
				let indexedCell = this.leaves[foundLeafNode.index];
				return indexedCell;
			} else {
				return DeadCell;
			}
		}

		//Most time is spent here according to profiler.
		/**
   * Recursive Range query. Finds all alive cells in the rectangle defined by bounds of the points (x,y), (xx,yy).
   * @param {number} x
   * @param {number} y
   * @param {number} xx
   * @param {number} yy
   * @param {QTNode} currentNode - The node to perform the range on. Defaults to the root of the tree.
   * @returns {Cell[]} The array of alive cells found. Returns an empty array if none are found.
   */
		findAliveInArea(x, y, xx, yy, currentNode = this.root) {
			if (typeof currentNode === 'undefined' || currentNode === null) {
				throw new Error('Cannot perform a range query on an empty node.');
			}
			let foundCells = [];
			if (!currentNode.intersectsAABB(x, y, xx, yy)) {
				return foundCells;
			}

			if (currentNode.subdivided) {
				let q1 = this.findAliveInArea(x, y, xx, yy, currentNode.upperLeft);
				let q2 = this.findAliveInArea(x, y, xx, yy, currentNode.upperRight);
				let q3 = this.findAliveInArea(x, y, xx, yy, currentNode.lowerLeft);
				let q4 = this.findAliveInArea(x, y, xx, yy, currentNode.lowerRight);
				//foundCells = foundCells.concat(q1,q2,q3,q4)
				//683   10.7%  t v8::internal::(anonymous namespace)::Fast_ArrayConcat
				foundCells = [...q1, ...q2, ...q3, ...q4];
			} else {
				let cell = this.leaves[currentNode.index];
				if (cell && cell.isInsideRect(x, y, xx, yy)) {
					foundCells.push(cell);
				}
			}
			return foundCells;
		}
	}

	/**
  * Scale from the origin by a constant in place along both axis.
  *
  * @param {QTNode} node - The node in the tree to scale.
  * @param {number} factor - The scaling factor.
  */
	function uniformScale(node, factor) {
		node.rect.x = node.rect.x * factor;
		node.rect.y = node.rect.y * factor;
		node.rect.xx = node.rect.xx * factor;
		node.rect.yy = node.rect.yy * factor;
		node.children().forEach(child => uniformScale(child, factor));
	}

	/**
  * Uniformly scales cells along both axis from the upper left corner.
  * @param {Cell[]} cells
  * @param {number} scalingFactor
  * @returns {Cell[]} A new array of cells.
  */
	function scaleCells(cells, scalingFactor) {
		return cells.map(cell => new Cell(cell.location.row * scalingFactor, cell.location.col * scalingFactor, cell.age));
	}

	/**
  * Given a cell's coordinates, find the count of alive neighbors.
  * @param {number} row - The cell's coordinates on the x-axis.
  * @param {number} col - The cell's coordinates on the y-axis.
  * @returns {number} The count of alive neighbors.
  */
	function findAliveNeighbors(tree, row, col) {
		let range = {
			x: row - 1,
			y: col - 1,
			xx: row + 1,
			yy: col + 1
		};
		let aliveCells = tree.findAliveInArea(range.x, range.y, range.xx, range.yy);
		let aliveCount = aliveCells.reduce((count, cell) => {
			if (!(cell.location.row == row && cell.location.col == col)) {
				count++;
			}
			return count;
		}, 0);
		return aliveCount;
	}

	/**
  * Creates a deep copy of an array of cells.
  * @param {Cell[]} cells - The array of cells to copy.
  * @returns {Cell[]} The new array.
  */
	function cloneCells(cells) {
		let clones = [];
		cells.forEach(cell => {
			clones.push(new Cell(cell.location.row, cell.location.col, 1));
		});
		return clones;
	}

	module.exports = {
		Cell,
		cloneCells,
		DeadCell,
		findAliveNeighbors,
		QTNode,
		QuadTree,
		scaleCells,
		uniformScale
	};
});
$__System.registerDynamic('10', ['c', 'e'], true, function ($__require, exports, module) {
	var global = this || self,
	    GLOBAL = global;
	/**
  * Conway's Game Initial State Seeder Module
  * @module seeders
  */
	const { CellStates } = $__require('c');
	const { Cell } = $__require('e');

	/**
  * Randomly selects 0 or 1.
  * @private
  * @returns {number}
  */
	function randomAliveOrDead() {
		return getRandomIntInclusive(CellStates.DEAD, CellStates.ALIVE);
	}

	/**
  * Finds a random integer in the set defined by two bounds.
  * @private
  * @param {number} min
  * @param {number} max
  * @returns {number}
  */
	function getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
	}

	/**
  * Abstract class. Defines a seeder.
  */
	class Seeder {
		/**
   * Initialize a new seeder.
   */
		constructor() {
			this.cells = [];
		}

		/**
   * The algorithm to seed the simulation with.
   * @abstract
   * @param {number} width
   * @param {number} height
   */
		seed(width, height) {
			throw new Error('Seeder implementations must implement the seed(width, height) method.');
		}

		/**
   * Initial cells to use by the seeder.
   * @param {Cell[]} cells
   */
		setCells(cells) {
			this.cells = cells;
		}
	}

	/**
  * Seeds a simulation with randomly selecting alive or dead for each cell.
  * @extends Seeder
  */
	class RandomSeeder extends Seeder {
		constructor() {
			super();
		}

		seed(width, height) {
			for (let x = 0; x < width; x++) {
				for (let y = 0; y < height; y++) {
					let birthChance = randomAliveOrDead();
					if (birthChance == 1) {
						this.cells.push(new Cell(x, y, 1));
					}
				}
			}
			return this.cells;
		}
	}

	/**
  * Seeds a simulation with a provided set of alive cells.
  * @extends Seeder
  */
	class StaticCellsSeeder extends Seeder {
		constructor() {
			super();
		}

		seed(width, height) {
			return this.cells;
		}
	}

	/**
  * The set of supported seeder models.
  */
	SeederModels = {
		DRAWING: 'draw',
		RANDOM: 'random'

		/**
   * Creates a new seeder based on a specified seeder model name.
   */
	};class SeederFactory {
		/**
   * Initializes a new seeder.
   * @param {string} modelName
   * @returns {Seeder}
   */
		static build(modelName) {
			let seeder = null;
			switch (modelName) {
				case SeederModels.RANDOM:
					seeder = new RandomSeeder();
					break;
				case SeederModels.DRAWING:
					seeder = new StaticCellsSeeder();
					break;
				default:
					throw new Error(`Unknown seeder model name: ${modelName}`);
			}
			return seeder;
		}
	}

	module.exports = { Seeder, SeederFactory, SeederModels };
});
$__System.registerDynamic('a', ['11', '14', '13', '18', '10'], true, function ($__require, exports, module) {
  var global = this || self,
      GLOBAL = global;
  module.exports.LifeSystem = $__require('11');
  module.exports.GridSystem = $__require('14');
  module.exports.DefaultConfig = $__require('13');
  module.exports.DrawingSystem = $__require('18');
  module.exports.SeederFactoryModule = $__require('10');
});
})
(function(factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    Conways = factory();
});