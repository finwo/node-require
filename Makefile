build:
	node build
	{ echo "// Build by" $$(whoami) "@" $$(date) ; uglifyjs -c -m -- dist/require.js ; } > dist/require.min.js
