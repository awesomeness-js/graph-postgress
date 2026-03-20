# edge.search usage

Use `search` to find edges by v1, type, v2, with optional JSONB property filtering, sorting, and pagination.

## Import

```js
import graph from '@awesomeness-js/graph-postgres';
```

## Basic search

```js
const edges = await graph.edge.search({
    from: '8b56cf17-0a8d-4a49-b4b7-3e37a96b4a10',
    edgeTypes: 'follows',
    returnProperties: true
});

console.log(edges);
```

## Full options example

```js
const edges = await graph.edge.search({
    from: '8b56cf17-0a8d-4a49-b4b7-3e37a96b4a10',
    to: null,
    edgeTypes: ['follows', 'likes'],

    // JSONB containment on the properties column
    filterProperties: {
        status: 'active',
        tags: ['vip']
    },

    // Sort by a top-level edge field
    // sortBy: 'id'
    // sortBy: '-type'
    // sortBy: 'v1:desc'

    // Or sort by a property inside the JSONB properties object
    sortBy: {
        property: 'priority',
        direction: 'desc'
    },

    limit: 25,
    startIndex: 50,
    returnProperties: true
});

console.log(edges.length);
console.log(edges[0]);
```

## sortBy formats

```js
// Field sort (ascending)
sortBy: 'id';

// Field sort (descending)
sortBy: '-type';

// Field sort with explicit direction
sortBy: 'v2:desc';

// Object form using edge field
sortBy: { field: 'v1', direction: 'asc' };

// Object form using JSONB property key
sortBy: { property: 'priority', direction: 'desc' };
```

## filterProperties examples

```js
// Exact top-level key/value match
await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        status: 'active'
    }
});

// Multi-key containment (all keys must be present)
await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        status: 'active',
        source: 'import_job'
    }
});

// Nested object match: "something.deeper"
// Use nested JSON shape, not dot-notation, for nested JSON values.
await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        something: {
            deeper: 'match-me'
        }
    }
});

// If your JSON literally has a key that includes a dot, match it exactly.
await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        'something.deeper': 'literal-dot-key'
    }
});

// Date filters on properties.created using operators inside filterProperties
await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        created: {
            after: '2026-01-01T00:00:00Z'
        }
    }
});

await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        created: {
            before: '2026-02-01T00:00:00Z'
        }
    }
});

await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        created: {
            between: ['2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z']
        }
    }
});

// Also supported: gt, gte, lt, lte
await graph.edge.search({
    edgeTypes: 'follows',
    filterProperties: {
        created: {
            gte: '2026-01-01T00:00:00Z',
            lte: '2026-02-01T00:00:00Z'
        }
    }
});
```

## Notes

- `limit` must be a positive integer or `null`.
- `startIndex` must be an integer greater than or equal to `0`.
- `filterProperties` must be an object (or `null`) and is applied as JSONB containment (`@>`).
- For nested JSON values, pass nested objects (example: `{ something: { deeper: 'value' } }`).
- `from` and `to` are aliases for `v1s` and `v2s`.
- `type` and `types` are aliases for `edgeTypes`.
