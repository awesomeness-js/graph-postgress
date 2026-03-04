export default [
	{
		rules: {
			// Ignore ALL line-break rules around import statements ONLY
			'padding-line-between-statements': [
				'error',

				// imports are exempt
				{
					blankLine: 'any',
					prev: 'import',
					next: '*' 
				},
				{
					blankLine: 'any',
					prev: '*',
					next: 'import' 
				},

				// everything else still padded like before
				{
					blankLine: 'always',
					prev: '*',
					next: 'block-like' 
				},
				{
					blankLine: 'always',
					prev: 'block-like',
					next: '*' 
				},
				{
					blankLine: 'always',
					prev: '*',
					next: 'function' 
				},
				{
					blankLine: 'always',
					prev: 'function',
					next: '*' 
				},
				{
					blankLine: 'always',
					prev: '*',
					next: 'throw' 
				}
			],

			// ✅ This enforces ONE blank line at top + bottom of function bodies
			// (and other normal blocks), matching your "inside curly braces" requirement.
			'padded-blocks': [
				'error',
				{
					blocks: 'always',
					classes: 'always',
					switches: 'always'
				}
			],

			// Keep brace-newline rules, BUT disable them for imports only
			'object-curly-newline': [
				'error',
				{
					ObjectExpression: {
						minProperties: 2,
						multiline: true,
						consistent: true
					},
					ObjectPattern: {
						minProperties: 2,
						multiline: true,
						consistent: true
					},

					// imports ignore curly newline formatting
					ImportDeclaration: {
						multiline: false,
						minProperties: 99999,
						consistent: false
					},

					ExportDeclaration: {
						multiline: true,
						minProperties: 2
					}
				}
			],

			'object-property-newline': [ 'error', { allowAllPropertiesOnSameLine: false } ],
			indent: [ 'error', 'tab', { SwitchCase: 1 } ],
			semi: [ 'error', 'always' ],
			'arrow-parens': [ 'error', 'always' ],
			'object-curly-spacing': [ 'error', 'always' ],
			'array-bracket-spacing': [ 'error', 'always' ],
			'lines-between-class-members': [ 'error', 'always' ],
			'newline-after-var': [ 'error', 'always' ],
			'newline-before-return': 'error',
			'brace-style': [ 'error', '1tbs', { allowSingleLine: false } ],
			"no-unreachable": "off"
		}
	}
];
