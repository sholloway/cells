const { convertToCell } = require('./CanvasUtilities.js');

const MenuStates = {
	SHOW: 'SHOW',
	HIDE: 'HIDE',
};

/*
Next Steps
- How to handle clicking on a menu item?
- Intelligent Positioning
- Submenus
*/
class ContextMenu {
	constructor() {
		this.menuVisible = false;
		this.state = MenuStates.HIDE;
		// TODO: It would be better to dynamically calculate this.
		this.menuHeight = 258;
		this.menuWidth = 160;
		this.activeCell = null;
	}

	initialize(menuElement, eventHandler) {
		this.menuElement = menuElement;
		this.menuElement
			.querySelectorAll('.menu-options')
			.forEach((item) =>
				item.addEventListener('click', this.runItem.bind(this))
			);
		this.eventHandler = eventHandler;
	}

	isVisibile() {
		return this.menuVisible;
	}

	hideMenu() {
		this.menuVisible && this.toggleMenu(MenuStates.HIDE);
	}

	runItem(event) {
		this.hideMenu();
		this.eventHandler(
			this.activeCell.x,
			this.activeCell.y,
			event.srcElement.id
		);
	}

	/**
	 * Toggles the menu display.
	 * @param {string} command
	 */
	toggleMenu(command) {
		this.menuElement.style.display =
			command === MenuStates.SHOW ? 'block' : 'none';
		this.menuVisible = !this.menuVisible;
	}

	/**
	 * Moves the menu and displays it.
	 * @param {MouseEvent} clickEvent
	 * @param {DOMRect} boundary
	 * @param {number} zoom
	 */
	setMenuPosition(clickEvent, boundary, zoom) {
		this.activeCell = convertToCell(clickEvent, boundary, zoom);
		let situation = this.findMenuScenario(clickEvent, boundary);
		let menuLocation = this.findMenuLocation(clickEvent, boundary, situation);
		this.positionSubMenus(situation);
		this.menuElement.style.left = `${menuLocation.x}px`;
		this.menuElement.style.top = `${menuLocation.y}px`;
		this.toggleMenu(MenuStates.SHOW);
	}

	findMenuScenario(clickEvent, boundary) {
		let distFromBottom = boundary.bottom - clickEvent.clientY;
		let distFromRight = boundary.right - clickEvent.clientX;
		let tooCloseToRight = distFromRight < this.menuWidth;
		let willSubMenuFit = distFromRight > this.menuWidth * 2;
		return {
			distFromBottom: distFromBottom,
			tooCloseToRight: tooCloseToRight,
			willSubMenuFit: willSubMenuFit,
		};
	}

	//The menu should only be displayed inside of the canvas
	findMenuLocation(clickEvent, boundary, situation) {
		//Make sure there is room from the bottom.
		let py =
			situation.distFromBottom >= this.menuHeight
				? clickEvent.clientY
				: boundary.bottom - this.menuHeight;

		//Make sure there is room from the right boundary.
		let px;
		if (situation.tooCloseToRight) {
			px = boundary.right - this.menuWidth; //Align the menu to the right boundary.
		} else {
			px = clickEvent.clientX;
		}
		return { x: px, y: py };
	}

	positionSubMenus(situation) {
		let submenus = this.menuElement.querySelectorAll('.submenu ul');
		if (situation.willSubMenuFit) {
			submenus.forEach((menu) => {
				menu.className = 'menu-options right';
				menu.parentElement.setAttribute('arrow-icon', 'arrow_right');
				menu.parentElement.setAttribute('direction', 'right');
			});
		} else {
			submenus.forEach((menu) => {
				menu.className = 'menu-options left';
				menu.parentElement.setAttribute('arrow-icon', 'arrow_left');
				menu.parentElement.setAttribute('direction', 'left');
			});
		}
	}
}

module.exports = ContextMenu;
