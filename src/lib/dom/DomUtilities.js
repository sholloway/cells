/**
 * Helper function for finding elements on the document.
 * @param {*} id The ID of the element to fetch.
 * Throws an error if the element could not be found.
 */
function getElementById(id) {
	let element = document.getElementById(id);
	if (!element) {
		throw new Error(`No element could be found with the ID of ${id}`);
	}
	return element;
}

/**
 * Helper function for setting an elements value.
 * @param {string} id
 * @param {*} value
 */
function setElementValue(id, value) {
	getElementById(id).value = value;
}

function querySelector(query) {
	return document.querySelector(query);
}

function querySelectorAll(query) {
	return document.querySelectorAll(query);
}

module.exports = {
	getElementById,
	querySelector,
	querySelectorAll,
	setElementValue,
};
