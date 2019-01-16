export default function addQuery (baseQuery, q) {
	return baseQuery.replace('$q', q.replace(/;/g, ''));
}
