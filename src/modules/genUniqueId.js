export function genUniqueId (startingI = 0) {
	let idCounter = 1 + (startingI);
	return function uniqueId (prefix = '') {
		return prefix + idCounter++;
	};
};
