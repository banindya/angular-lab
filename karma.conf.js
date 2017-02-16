// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
const {CUSTOM_LAUNCHERS} = require('./browsers.config.js');


// Source: https://github.com/angular/angular/blob/master/karma-js.conf.js.
const sauceLabs = {
	testName: 'UNIT - Angular Lab',
	retryLimit: 3,
	startConnect: false,
	recordVideo: false,
	recordScreenshots: false,
	options:  {
		'selenium-version': '2.53.0',
		'command-timeout': 600,
		'idle-timeout': 600,
		'max-duration': 5400
	}
};

if (process.env.TRAVIS) {
	sauceLabs.build = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
	sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
	// TODO: remove once SauceLabs supports websockets.
	//karmaConfig.transports = ['polling'];
}


module.exports = function (config) {
	config.set({
		sauceLabs,
		customLaunchers: CUSTOM_LAUNCHERS,
		basePath: '',
		frameworks: ['jasmine', '@angular/cli'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-phantomjs-launcher'),
			require('karma-coverage-istanbul-reporter'),
			require('@angular/cli/plugins/karma')
		],
		files: [
			{pattern: './src/test.ts', watched: false}
		],
		preprocessors: {
			'./src/test.ts': ['@angular/cli']
		},
		mime: {
			'text/x-typescript': ['ts', 'tsx']
		},
		coverageIstanbulReporter: {
			reports: [ 'html', 'lcovonly' ],
			fixWebpackSourcePaths: true
		},
		angularCli: {
			config: './angular-cli.json',
			environment: 'dev'
		},
		reporters: config.angularCli && config.angularCli.codeCoverage ? ['progress', 'coverage-istanbul'] : ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: [
			'PhantomJS',
			'Chrome'
		],
		singleRun: false
	});
};
