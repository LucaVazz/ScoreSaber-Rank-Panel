module.exports = function(eleventyConfig) {
	eleventyConfig
		.addPassthroughCopy({"static": "."})
		.addPassthroughCopy({"src/**/*.js": "."})
		.addPassthroughCopy({
			"node_modules/line-awesome/dist/line-awesome/fonts/la-solid-900.woff2":
			"fonts/la.woff2"
		})
		.addPassthroughCopy({
			"node_modules/line-awesome/dist/line-awesome/fonts/la-solid-900.ttf":
			"fonts/la.ttf"
		})
		.addPassthroughCopy({
			"node_modules/@sentry/browser/build/bundle.min.js":
			"sentry.min.js"
		})
		.addPassthroughCopy({
			"node_modules/svg-country-flags/png100px":
			"flags"
		})
    ;// end eleventyConfig
    
    return {
        dir: {
			input: "src",
            output: "dist"
        }
    }
}
