var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Q = require('q');
chai.use(chaiAsPromised);
var common = require("./specs/common/common");

var expect = chai.expect;
exports.config = {
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',
    //Protractor will automatically start a standalone server with the use of jar
//    seleniumServerJar: 'node_modules/selenium-standalone/.selenium/2.43.1/server.jar',
    // Spec patterns are relative to the location of this config.
    specs: [
        'specs/cucumber/*.feature'
    ],
    baseUrl: '',
    cucumberOpts: {
        // Require files before executing the features.
        require: 'specs/cucumber/*.js',
        format: 'pretty'
    },
    capabilities: {
        'browserName': 'phantomjs',
        'phantomjs.binary.path': require('phantomjs').path,
        //use chrome in development
//        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 1
    },
    params: {
        login: {
            user: 'user@tpclient.com',
            password: 'tp123'
        },
        domainUrl: 'http://localhost:8080/',
        contextPath: '',
        serverUrl: 'http://localhost:8080/api/',
        homepage: 'planning'
    },
    onPrepare: function () {
        return browser.driver.get(browser.params.domainUrl + browser.params.contextPath + '/#/').then(function () {
            expect(browser.getTitle()).to.eventually.equal('Traffic Program Home').then(function (value) {
                element(by.name('username')).sendKeys(browser.params.login.user);
                element(by.name('password')).sendKeys(browser.params.login.password);
                element(by.id('btnLoginForm')).click().then(function () {
                    browser.driver.wait(function () {
                        return browser.driver.getCurrentUrl().then(function (url) {
                            return /planning/.test(url);
                        });
                    });
                });
            }, function (error) {

            });
        });
    }
};
