export default function traverse (node, target) {
	let result;
	if (node.id === target) {
		result = node;
	}
	if (node.children) {
		for (var i = 0; i < node.children.length; i++) {
			let r = traverse(node.children[i], target);
			if (r !== undefined) {
				result = r;
				break;
			}
		}
	}
	return result;
}
