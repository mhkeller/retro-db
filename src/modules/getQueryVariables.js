export function getQueryVariables (query) {
	const match = query.match(/\$.+?(?=[^\w]|$)/g) || [];
	return match.reduce((store, val) => {
		if (!store.includes(val)) {
			store.push(val);
		}
		return store;
	}, []);
}
