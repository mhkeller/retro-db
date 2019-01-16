function pad (num) {
	return num < 10 ? `0${num}` : num;
}

export default function prettyDate (utcTimestamp, showSeconds) {
	const dt = new Date(+utcTimestamp * 1000);
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const seconds = showSeconds === true ? `:${pad(dt.getSeconds())} ` : '';
	return `${days[dt.getDay()]}. ${months[dt.getMonth()]} ${dt.getDate()}, ${pad(dt.getHours())}:${pad(dt.getMinutes())}${seconds}`;
}
