const {
	getElementById,
	querySelector,
	querySelectorAll,
	setElementValue,
} = require('./../dom/DomUtilities');

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
		this.menuElement = querySelector('.context-menu');
		this.menuItems = querySelectorAll('.menu-options');
		this.menuItems.forEach((item) =>
			item.addEventListener('click', this.runItem.bind(this))
		);
		this.state = MenuStates.HIDE;
	}

	isVisibile() {
		return this.menuVisible;
	}

	hideMenu() {
		this.menuVisible && this.toggleMenu(MenuStates.HIDE);
	}

	runItem(event) {
		console.log(event);
		console.log(event.srcElement.id);
		this.hideMenu();
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
	 * @param {*} left
	 * @param {*} top
	 */
	setMenuPosition(left, top) {
		this.menuElement.style.left = `${left}px`;
		this.menuElement.style.top = `${top}px`;
		this.toggleMenu(MenuStates.SHOW);
	}
}

module.exports = ContextMenu;
