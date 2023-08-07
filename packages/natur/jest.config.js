module.exports = {
	verbose: false,
	testEnvironment: 'jest-environment-jsdom',
	coveragePathIgnorePatterns: ["/test/ui-demo"],
	testPathIgnorePatterns: [
		// "natur/test/hooks.test.js",
		// "natur/test/inject.test.js",
		// "natur/test/utils.test.js",
		// "natur/test/createStore.test.js",
	],
	transform: {
		"\\.[jt]sx?$": "babel-jest",
	},
};
