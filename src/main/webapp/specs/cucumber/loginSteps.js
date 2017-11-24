var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var Q = require('q');
chai.use(chaiAsPromised);

var expect = chai.expect;
var configFile = require('./../common/defaults');
var LoginElements = require("./../constants/loginelements");
var ScenarioTags = require("./../constants/scenariotags");
var UserMother = require("./../object-mothers/usermother");

module.exports = function () {
    this.Given(/^A User with email id and encrypted password exists in database$/, function (callback) {
        var userCreated = function () {
            callback();
        };
        UserMother.createByJson(userCreated, {first_name: 'Test', sur_name: 'User', email: ScenarioTags.loginTags.invalidCredentials});
    });

    this.Given(/^I'm on the log in page$/, function (callback) {
        configFile.goToLogInPage(callback);
    });

    this.When(/^I enter invalid credentials$/, function (callback) {
        LoginElements.userName.clear();
        LoginElements.password.clear();
        LoginElements.userName.sendKeys(ScenarioTags.loginTags.invalidCredentials);
        LoginElements.password.sendKeys(configFile.testUser.plainPassword + "invalid");
        callback();
    });

    this.When(/^click Log In$/, function (callback) {
        LoginElements.btnLoginForm.click().then(function () {
            setTimeout(function () {
                callback();
            }, 2000);
        });
    });

    this.Then(/^"([^"]*)" error message appears$/, function (arg1, callback) {
        expect(element(by.xpath("//div[@class='error,help-block']")).isDisplayed()).to.eventually.equal(true)
                .then(function () {
                    element(by.xpath("//div[@class='error,help-block']")).getText().then(function (value) {
                        if (arg1 === value) {
                            callback();
                        } else {
                            callback(new Error('wrong message: ' + value));
                        }
                    });
                }, function () {
                    callback(new Error('No validation message appears'));
                });
    });


    this.Then(/^I should be on log in page only\.$/, function (callback) {
        configFile.checkPageURL("", callback);
    });

    this.When(/^I enter valid credentials$/, function (callback) {
        LoginElements.userName.clear();
        LoginElements.password.clear();
        LoginElements.userName.sendKeys(ScenarioTags.loginTags.invalidCredentials);
        LoginElements.password.sendKeys(configFile.testUser.plainPassword);
        callback();
    });

    this.When(/^I hit jobs URL in address bar$/, function (callback) {
        configFile.gotoPage('jobs', callback);
    });

    this.Then(/^I should be on log in page only$/, function (callback) {
        configFile.checkPageURL("", callback);
    });

    this.Then(/^I should be on the jobs page$/, function (callback) {
        configFile.checkPageHeader("Jobs", null, callback);
    });
    this.Then(/^I should be on the Planning page$/, function (callback) {
        configFile.checkPageHeader("Planning", null, callback);
    });

    this.When(/^I hit "([^"]*)" Web service URL in address bar$/, function (arg1, callback) {
        browser.driver.get(browser.params.serverUrl + arg1);
        callback();
    });

    this.Then(/^I should get message "([^"]*)"$/, function (arg1, callback) {
        browser.driver.findElement(by.xpath("//*[contains(text(),'" + arg1 + "')]")).getText().then(function (value) {
            callback();
        }, function () {
            callback(new Error('It has some different message or data'));
        });
    });
};
