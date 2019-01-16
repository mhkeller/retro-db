import * as fs from 'fs';
import * as path from 'path';
import minify from 'pg-minify';

export default (file) => {
	const fullPath = path.resolve(__dirname, '..', 'assets', 'queries', file);
	return minify(fs.readFileSync(fullPath, 'utf-8'));
};
