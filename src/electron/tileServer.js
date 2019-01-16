import polka from 'polka';
import kleur from 'kleur';
import SphericalMercator from 'sphericalmercator';

import tilePort from '../config/tilePort.js';
import addQuery from '../modules/addQuery.js';
import getQueryFile from '../modules/getQueryFile.js';

const mercator = new SphericalMercator({
	size: 256
});

const generateVectorTileQuery = getQueryFile('generate-vector-tile-query.sql');

export function tileServer (db, tileCache) {
	polka()
		.get('/tiles/:tileId/:z/:x/:y.mvt', async (req, res) => {
			const { params } = req;

			const {
				tileId,
				z,
				x
			} = params;

			// Do a stupid work around bc polka doesn't recognize just the `:y` portion
			const y = params['y.mvt'].replace('.mvt', '');

			const tileViewId = `${tileId}-${x}_${y}_${z}`;

			// Retrieve cached query results if they exist
			const tileResponse = await tileCache.get(tileViewId);
			// console.log('tile response', tileViewId);
			if (!tileResponse) {
				// retreive the projectids from the cache
				const tileQuery = await tileCache.get(`${tileId}-query`);
				// calculate the bounding box for this tile
				const bbox = mercator.bbox(x, y, z, false, '900913');
				try {
					// console.log('getting from database', tileViewId);
					const { rows } = await db.query(addQuery(generateVectorTileQuery, tileQuery), [...bbox]);
					const tile = rows[0];
					const statusCode = tile.st_asmvt.length === 0 ? 204 : 200;

					res.writeHead(statusCode, {
						'Content-Type': 'application/x-protobuf'
					});

					if (statusCode === 200) {
						await tileCache.set(tileViewId, tile.st_asmvt);
					}

					res.end(tile.st_asmvt);
				} catch (e) {
					res.statusCode = 404;
					res.end({
						error: e.toString()
					});
				}
			} else {
				// console.log('Getting from cache', tileViewId);
				res.writeHead(200, {
					'Content-Type': 'application/x-protobuf'
				});

				const tileAsmvt = await tileCache.get(tileViewId);

				res.end(tileAsmvt);
			}
		})
		.listen(tilePort, err => {
			if (err) throw err;
			console.log(kleur.cyan(`> Tile server running on localhost:${tilePort}`));
		});
}
