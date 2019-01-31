const chai = require('chai')
const expect = chai.expect

const { BrowserSystem, CanvasBasedSystem, SystemEvents, SystemState} = require('./../../lib/core/System.js')

describe('System Module', function(){
	describe('System States', function(){
		it ('should have a stopped state', function(){
			expect(SystemState.STOPPED).to.equal(1)
		})

		it ('should have a paused state', function(){
			expect(SystemState.PAUSED).to.equal(2)
		})

		it ('should have a running state', function(){
			expect(SystemState.RUNNING).to.equal(3)
		})
	})

	describe('System Events', function(){
		it ('should support system ticked event', function(){
			expect(SystemEvents.TICKED).to.equal('ticked')
		})
	})

	describe('Browser System', function(){
		it ('should initialize the simulation counter at zero', function(){
			let fakeWindow = {}
			let bs = new BrowserSystem(fakeWindow)
			expect(bs.numberOfSimulationIterations()).to.equal(0)
		})

		it ('should initialize with a state of stopped', function(){
			let fakeWindow = {}
			let bs = new BrowserSystem(fakeWindow)
			expect(bs.state).to.equal(SystemState.STOPPED)
		})

		it ('should change the state to RUNNING when started', function(){
			let fakeWindow = createFakeWindow(10)
			let bs = new BrowserSystem(fakeWindow)
			bs.start()
			expect(bs.state).to.equal(SystemState.RUNNING)
		})

		it ('should set the last tick to the system time when started', function(){
			let systemTime = 1502
			let fakeWindow = createFakeWindow(systemTime)
			let bs = new BrowserSystem(fakeWindow)
			bs.start()
			expect(bs.lastTick).to.equal(systemTime)
		})

		it ('should set the last render to the system time when started', function(){
			let systemTime = 1345
			let fakeWindow = createFakeWindow(systemTime)
			let bs = new BrowserSystem(fakeWindow)
			bs.start()
			expect(bs.lastRender).to.equal(systemTime)
		})

		it ('should reset the iteration counter zero when started', function(){
			let fakeWindow = createFakeWindow(0)
			let bs = new BrowserSystem(fakeWindow)
			bs.simIterationCounter = -1
			bs.start()
			expect(bs.numberOfSimulationIterations()).to.equal(0)
		})

		it ('should change the state to STOPPED when stop is called', function(){
			let fakeWindow = createFakeWindow(0)
			let bs = new BrowserSystem(fakeWindow)
			bs.start()
			expect(bs.state).to.equal(SystemState.RUNNING)
			bs.stop()
			expect(bs.state).to.equal(SystemState.STOPPED)
		})

		it ('should change the state to PAUSED when pause is called', function(){
			let fakeWindow = createFakeWindow(0)
			let bs = new BrowserSystem(fakeWindow)
			bs.start()
			expect(bs.state).to.equal(SystemState.RUNNING)
			bs.pause()
			expect(bs.state).to.equal(SystemState.PAUSED)
		})

		it ('should change the state to RUNNING when resume is called', function(){
			let fakeWindow = createFakeWindow(0)
			let bs = new BrowserSystem(fakeWindow)
			bs.start()
			expect(bs.state).to.equal(SystemState.RUNNING)
			bs.pause()
			expect(bs.state).to.equal(SystemState.PAUSED)
			bs.resume()
			expect(bs.state).to.equal(SystemState.RUNNING)
			bs.stop()
			bs.resume()
			expect(bs.state).to.equal(SystemState.RUNNING)
		})



		function createFakeWindow(time){
			return {
				performance: {
					now: function(){
						return time
					}
				}
			}
		}
	})

	describe('Canvas Based System', function(){})
	describe('Alt Life System', function(){})
	describe('Drawing System', function(){})
	describe('Grid System', function(){})
})
