# Utils Index Management

These utilities manage indexes for the `properties` JSONB column on:

- `settings.tableName_edges`
- `settings.tableName_vertices`

## Complete Example: Index edges.properties.createdBy

```js
import graph from '@awesomeness-js/graph-postgres';

// 1) Create an index specifically for edges.properties.createdBy
// This creates an expression index on (properties->>'createdBy').
const created = await graph.utils.createIndex({
  target: 'edges',
  // required
  propertyKey: 'createdBy',
  indexName: 'awesomeness_edges_created_by_idx'
});

console.log(created);
// {
//   created: true,
//   indexName: 'awesomeness_edges_created_by_idx',
//   tableName: 'awesomeness__edges'
// }

// 2) Verify indexes
const indexes = await graph.utils.listIndexes();
console.log(indexes);

// 3) Remove when no longer needed
const removed = await graph.utils.removeIndex({
  target: 'edges',
  indexName: 'awesomeness_edges_created_by_idx'
});

console.log(removed);
// {
//   removed: true,
//   indexName: 'awesomeness_edges_created_by_idx',
//   tableName: 'awesomeness__edges'
// }
```

## createIndex Modes

```js
// Single key expression index on properties->>'createdBy'
await graph.utils.createIndex({
  target: 'edges',
  propertyKey: 'createdBy'
});

// Deep property path index using dot notation
// Indexes properties.something.deeper
await graph.utils.createIndex({
  target: 'edges',
  propertyKey: 'something.deeper'
});
```

## API Summary

- `listIndexes()`
  - Returns indexes that reference `properties` on edge/vertex tables.
- `createIndex({ target, indexName, propertyKey })`
  - `target`: `'edges' | 'vertices'`
  - `propertyKey` (required): creates expression index on a properties path
  - supports dot notation for deep keys (for example: `something.deeper`)
- `removeIndex({ target, indexName })`
  - Drops index only if it belongs to selected table and references `properties`.

## Notes

- Scope is intentionally limited to edge/vertex tables.
- Index names are validated to safe SQL identifier format.
- `removeIndex` throws `dbError` if index/table/properties scope does not match.
