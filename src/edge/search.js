/**
 * Searches for edges in the graph database based on provided criteria.
 *
 * @async
 * @function
 * @param {Object} [options={}] - The search options.
 * @param {string|string[]|null} [options.v1s=null] - Vertex 1 UUID(s) to filter by. Can be a single UUID, an array of UUIDs, or null for wildcard.
 * @param {string|string[]|null} [options.edgeTypes=null] - Edge type(s) to filter by. Can be a single string, an array of strings, or null for wildcard.
 * @param {string|string[]|null} [options.v2s=null] - Vertex 2 UUID(s) to filter by. Can be a single UUID, an array of UUIDs, or null for wildcard.
 * @param {number|null} [options.limit=null] - Max number of rows to return.
 * @param {number} [options.startIndex=0] - Number of rows to skip.
 * @param {string|Object|null} [options.sortBy=null] - Sort configuration. Supports string formats (`id`, `-id`, `id:desc`) or object formats (`{ field, direction }`, `{ property, direction }`).
 * @param {Object|null} [options.filterProperties=null] - JSONB containment filter applied to the `properties` column.
 * @param {boolean} [options.returnProperties=false] - Whether to include edge properties in the result.
 * @returns {Promise<Object[]>} Resolves to an array of edge objects matching the search criteria.
 * @throws {Object} Throws an error object with a `dbError` property if input validation fails, or with a `searchEdgesFailed` property if the database query fails.
 */
import { isUUID } from '@awesomeness-js/utils';
import { createPool } from '../utils/pool.js';
import { settings } from '../config.js';

export default async function searchEdges({
	from = null,
	to = null,
	v1s = null, 
	edgeTypes = null, // alias
	type = null, 
	types = null, // alias
	v2s = null,
	limit = null,
	startIndex = 0,
	sortBy = null,
	filterProperties = null,
	returnProperties = false
} = {}) {

	if(type && !edgeTypes) edgeTypes = type;
	if(types && !edgeTypes) edgeTypes = types;

	// new names
	if(to && !v2s) v2s = to;
	if(from && !v1s) v1s = from;

	let returnToFrom = false;

	if(to || from) returnToFrom = true;

	const graph = createPool();
    
	let v1_is_x = false;
	let v2_is_x = false;
	let edgeType_is_x = false;


	// Convert single inputs to arrays
	if (typeof v1s === 'string' || v1s === null) v1s = [ v1s ];
	if (typeof edgeTypes === 'string' || edgeTypes === null) edgeTypes = [ edgeTypes ];
	if (typeof v2s === 'string' || v2s === null) v2s = [ v2s ];

	// Validate `v1s`
	if (
		!Array.isArray(v1s)
        && v1s !== null
	) {

		throw {
			dbError: {
				msg: 'v1s invalid - must be null, a uuid, or an array of uuids',
				v1s
			}
		};

	} else if (
		v1s.length === 1 
        && v1s[0] === null
	) {

		v1_is_x = true;

	} else {

		v1s.forEach((v1, i) => {

			if (!isUUID(v1)) {

				throw {
					dbError: {
						msg: 'v1s invalid - must be a uuid, or an array of uuids',
						v1s,
						key: i,
						value: v1
					}
				};
			
			}
		
		});

	}

	// Validate `v2s`
	if (
		!Array.isArray(v2s)
        && v2s !== null
	) {

		throw {
			dbError: {
				msg: 'v2s invalid - must be null, a uuid, or array of uuids',
				v2s
			}
		};

	} else if (
		v2s.length === 1 
        && v2s[0] === null
	) {

		v2_is_x = true;

	} else {

		v2s.forEach((v2, i) => {

			if (!isUUID(v2)) {

				throw {
					dbError: {
						msg: 'v2s invalid - must be a uuid, or array of uuids',
						v2s,
						key: i,
						value: v2
					}
				};
			
			}
		
		});

	}

	// Validate `edgeTypes`
	if (!Array.isArray(edgeTypes)) {

		throw {
			dbError: {
				msg: 'edgeTypes invalid - must be string or array of strings (min len: 2)',
				edgeTypes
			}
		};

	} else if (
		edgeTypes.length === 1 
        && edgeTypes[0] === null
	) {

		edgeType_is_x = true;
   
	} else {

		edgeTypes.forEach((type, i) => {

			if (typeof type !== 'string' || type.length < 2) {

				throw {
					dbError: {
						msg: 'edgeTypes invalid - must be string or array of strings (min len: 2)',
						edgeTypes,
						key: i,
						value: type
					}
				};
			
			}
		
		});

	}

	if (v1_is_x && edgeType_is_x && v2_is_x) {

		throw {
			dbError: {
				msg: 'all three inputs cannot be x',
				v1s,
				v2s,
				edgeTypes
			}
		};
	
	}

	if (limit !== null) {

		if (!Number.isInteger(limit) || limit <= 0) {

			throw {
				dbError: {
					msg: 'limit invalid - must be a positive integer or null',
					limit
				}
			};

		}

	}

	if (!Number.isInteger(startIndex) || startIndex < 0) {

		throw {
			dbError: {
				msg: 'startIndex invalid - must be an integer >= 0',
				startIndex
			}
		};

	}

	if (
		filterProperties !== null
        && (
        	typeof filterProperties !== 'object'
            || Array.isArray(filterProperties)
        )
	) {

		throw {
			dbError: {
				msg: 'filterProperties invalid - must be an object or null',
				filterProperties
			}
		};

	}

	const dateFilterOps = [ 'after', 'before', 'between', 'gt', 'gte', 'lt', 'lte' ];

	const filterContainsDateOps = (value) => {

		if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

		return dateFilterOps.some((op) => Object.prototype.hasOwnProperty.call(value, op));

	};

	let sortField = null;
	let sortDirection = 'ASC';
	let sortPropertyKey = null;

	if (sortBy !== null) {

		const validFields = [ 'id', 'v1', 'type', 'v2' ];

		if (typeof sortBy === 'string') {

			let field = sortBy;

			if (field.startsWith('-')) {

				sortDirection = 'DESC';
				field = field.slice(1);

			}

			if (field.includes(':')) {

				const [ rawField, rawDirection ] = field.split(':');

				field = rawField;

				if (rawDirection?.toLowerCase() === 'desc') sortDirection = 'DESC';
				if (rawDirection?.toLowerCase() === 'asc') sortDirection = 'ASC';

			}

			if (!validFields.includes(field)) {

				throw {
					dbError: {
						msg: 'sortBy invalid - field must be one of id, v1, type, v2',
						sortBy
					}
				};

			}

			sortField = field;

		} else if (
			typeof sortBy === 'object'
            && !Array.isArray(sortBy)
		) {

			const rawDirection = sortBy.direction;


			if (rawDirection && typeof rawDirection !== 'string') {

				throw {
					dbError: {
						msg: 'sortBy invalid - direction must be "asc" or "desc"',
						sortBy
					}
				};

			}

			if (rawDirection?.toLowerCase() === 'desc') sortDirection = 'DESC';
			if (rawDirection?.toLowerCase() === 'asc') sortDirection = 'ASC';

			const field = sortBy.field;
			const propertyKey = sortBy.property || sortBy.propertyKey;

			if (propertyKey !== undefined) {

				if (typeof propertyKey !== 'string' || !propertyKey.length) {

					throw {
						dbError: {
							msg: 'sortBy invalid - property must be a non-empty string',
							sortBy
						}
					};

				}

				sortPropertyKey = propertyKey;

			} else {

				if (!validFields.includes(field)) {

					throw {
						dbError: {
							msg: 'sortBy invalid - field must be one of id, v1, type, v2',
							sortBy
						}
					};

				}

				sortField = field;

			}

			if (propertyKey === undefined && !field) {

				throw {
					dbError: {
						msg: 'sortBy invalid - object must include field or property',
						sortBy
					}
				};

			}

		} else {

			throw {
				dbError: {
					msg: 'sortBy invalid - must be a string, object, or null',
					sortBy
				}
			};

		}

	}

	// Build query dynamically
	let query = `
    SELECT 
        id,
        type
        ${returnToFrom ? ', v1 AS "from", v2 AS "to"' : ', v1, v2' }
        ${ returnProperties ? ', properties' : '' }
    FROM ${settings.tableName_edges} WHERE `;
	const conditions = [];
	const params = [];

	if (!v1_is_x) {

		conditions.push(`v1 = ANY($${params.length + 1}::uuid[])`);
		params.push( v1s );
	
	}

	if (!edgeType_is_x) {

		conditions.push(`type = ANY($${params.length + 1}::text[])`);
		params.push( edgeTypes );
	
	}

	if (!v2_is_x) {

		conditions.push(`v2 = ANY($${params.length + 1}::uuid[])`);
		params.push( v2s );
	
	}

	if (filterProperties !== null) {

		const containmentFilter = {};

		Object.entries(filterProperties).forEach(([ propertyKey, propertyValue ]) => {

			if (!filterContainsDateOps(propertyValue)) {

				containmentFilter[propertyKey] = propertyValue;
				
				return;

			}

			if (propertyValue.after !== undefined || propertyValue.gt !== undefined) {

				const afterValue = propertyValue.after ?? propertyValue.gt;

				if (typeof afterValue !== 'string' || !afterValue.length) {

					throw {
						dbError: {
							msg: `filterProperties.${propertyKey} invalid - after/gt must be a non-empty date string`,
							filterProperties
						}
					};

				}

				params.push(propertyKey);
				const keyParam = params.length;

				params.push(afterValue);
				const valueParam = params.length;

				conditions.push(`(properties->>$${keyParam})::timestamptz > $${valueParam}::timestamptz`);

			}

			if (propertyValue.gte !== undefined) {

				if (typeof propertyValue.gte !== 'string' || !propertyValue.gte.length) {

					throw {
						dbError: {
							msg: `filterProperties.${propertyKey} invalid - gte must be a non-empty date string`,
							filterProperties
						}
					};

				}

				params.push(propertyKey);
				const keyParam = params.length;

				params.push(propertyValue.gte);
				const valueParam = params.length;

				conditions.push(`(properties->>$${keyParam})::timestamptz >= $${valueParam}::timestamptz`);

			}

			if (propertyValue.before !== undefined || propertyValue.lt !== undefined) {

				const beforeValue = propertyValue.before ?? propertyValue.lt;

				if (typeof beforeValue !== 'string' || !beforeValue.length) {

					throw {
						dbError: {
							msg: `filterProperties.${propertyKey} invalid - before/lt must be a non-empty date string`,
							filterProperties
						}
					};

				}

				params.push(propertyKey);
				const keyParam = params.length;

				params.push(beforeValue);
				const valueParam = params.length;

				conditions.push(`(properties->>$${keyParam})::timestamptz < $${valueParam}::timestamptz`);

			}

			if (propertyValue.lte !== undefined) {

				if (typeof propertyValue.lte !== 'string' || !propertyValue.lte.length) {

					throw {
						dbError: {
							msg: `filterProperties.${propertyKey} invalid - lte must be a non-empty date string`,
							filterProperties
						}
					};

				}

				params.push(propertyKey);
				const keyParam = params.length;

				params.push(propertyValue.lte);
				const valueParam = params.length;

				conditions.push(`(properties->>$${keyParam})::timestamptz <= $${valueParam}::timestamptz`);

			}

			if (propertyValue.between !== undefined) {

				if (
					!Array.isArray(propertyValue.between)
					|| propertyValue.between.length !== 2
					|| typeof propertyValue.between[0] !== 'string'
					|| typeof propertyValue.between[1] !== 'string'
					|| !propertyValue.between[0].length
					|| !propertyValue.between[1].length
				) {

					throw {
						dbError: {
							msg: `filterProperties.${propertyKey} invalid - between must be [fromDate, toDate]`,
							filterProperties
						}
					};

				}

				params.push(propertyKey);
				const keyParam = params.length;

				params.push(propertyValue.between[0]);
				const fromParam = params.length;

				params.push(propertyValue.between[1]);
				const toParam = params.length;

				conditions.push(`(properties->>$${keyParam})::timestamptz BETWEEN $${fromParam}::timestamptz AND $${toParam}::timestamptz`);

			}

		});

		if (Object.keys(containmentFilter).length) {

			conditions.push(`properties @> $${params.length + 1}::jsonb`);
			params.push(JSON.stringify(containmentFilter));

		}

	}

	query += conditions.join(' AND ');

	if (sortPropertyKey !== null) {

		params.push(sortPropertyKey);
		query += ` ORDER BY COALESCE(properties->>$${params.length}, '') ${sortDirection}`;

	} else if (sortField) {

		query += ` ORDER BY ${sortField} ${sortDirection}`;

	}

	if (limit !== null) {

		params.push(limit);
		query += ` LIMIT $${params.length}`;

	}

	if (startIndex > 0) {

		params.push(startIndex);
		query += ` OFFSET $${params.length}`;

	}

	try {

		const res = await graph.query(query, params);

		
		return res.rows;
	
	} catch (ex) {

		throw {
			searchEdgesFailed: ex.stack,
		};
	
	}

}
