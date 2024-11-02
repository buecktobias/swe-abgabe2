module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-spec-reporter'),
            require('karma-coverage'),
            require('karma-sabarivka-reporter'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            jasmine: {},
        },
        jasmineHtmlReporter: {
            suppressAll: true,
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/angular-buch-frontend'),
            include: ['src/**/*.component.ts', 'src/**/*.gql.ts', 'src/**/*.service.ts', 'src/**/*.directive.ts', 'src/**/*.pipe.ts'],
            subdir: '.',
            includeAllSources: true,
            reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcov' }],
            instrumenterOptions: {
                istanbul: { includeUntested: true },
            },
        },
        reporters: ['progress', 'spec', 'kjhtml', 'sabarivka', 'coverage'],
        browsers: ['Chrome'],
        restartOnFileChange: true,
    });
};
