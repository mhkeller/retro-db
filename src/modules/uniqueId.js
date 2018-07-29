var idCounter = 0;

module.exports = function uniqueId (prefix) {
	var id = idCounter++ + '';
	return prefix ? prefix + id : id;
};
