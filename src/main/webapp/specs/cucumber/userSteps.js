var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var CustomerMother = require("./../object-mothers/customermother");
var StaffMother = require("./../object-mothers/staffmother");
var VehicleMother = require("./../object-mothers/vehiclemother");
var ScenarioTags = require("./../constants/scenariotags");
var LicenceTypeElements = require("./../constants/userelements");
var PlanningElements = require("./../constants/planningelements");

var Q = require('q');

var expect = chai.expect;
module.exports = function () {
    this.When(/^I navigate to the users page from the admin menu$/, function (callback) {
        configFile.gotoPage('admin/users', callback);
    });

    this.Then(/^all the users who can access the system are displayed in a table$/, function (callback) {
        element.all(by.repeater(LicenceTypeElements.repeaterUsers)).then(function (elems) {
            if (elems.length > 0) {
                callback();
            } else {
                callback(new Error("I cannot see the user records."));
            }
        });
    });

    this.Given(/^I am on the User page$/, function (callback) {
        configFile.gotoPage('admin/users', callback);
    });

    this.When(/^I click to add a new User$/, function (callback) {
        LicenceTypeElements.addNewLink.click().then(function () {
            callback();
        });
    });

    this.Then(/^a new row is added to the existing user table$/, function (callback) {
        LicenceTypeElements.email1.getText().then(function (val) {
            if (val === '') {
                callback();
            } else {
                callback(new Error('There is no row added at the top'));
            }
        });
    });

    this.When(/^I fill in the user details$/, function (callback) {
        Q.all([
            LicenceTypeElements.email1.sendKeys(ScenarioTags.userTags.newEmailId),
            LicenceTypeElements.firstName1.sendKeys(ScenarioTags.userTags.newFName),
            LicenceTypeElements.surName1.sendKeys(ScenarioTags.userTags.newLName),
        ]).then(function () {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^click to Save the User$/, function (callback) {
        LicenceTypeElements.saveButton.click().then(function () {
            browser.sleep(1000);
            browser.refresh();
            callback();
        });
    });

    this.Then(/^the User is saved$/, function (callback) {
        LicenceTypeElements.firstName1.isDisplayed().then(function () {
            LicenceTypeElements.firstName1.getAttribute('value').then(function (val) {
                console.log(val)
                if (val === ScenarioTags.userTags.newFName) {
                    callback();
                } else {
                    callback(new Error('There is no row added at the top'));
                }
            });
        });

    });

    this.When(/^I make some change to the User$/, function (callback) {
        LicenceTypeElements.firstName1.clear();
        LicenceTypeElements.firstName1.sendKeys(ScenarioTags.userTags.editFname);
        callback();
    });

    this.Then(/^the User is updated$/, function (callback) {
        LicenceTypeElements.firstName1.isDisplayed().then(function () {
            LicenceTypeElements.firstName1.getAttribute('value').then(function (val) {
                console.log(val)
                if (val === ScenarioTags.userTags.editFname) {
                    callback();
                } else {
                    callback(new Error('There is no row added at the top'));
                }
            });
        });
    });

    this.Given(/^I have a user in the system with specific user id$/, function (callback) {
        configFile.gotoPage('admin/users', callback);
    });

    this.When(/^change the email id to the other users email$/, function (callback) {
        LicenceTypeElements.email1.clear();
        LicenceTypeElements.email1.sendKeys(configFile.testUser.email);
        LicenceTypeElements.firstName1.sendKeys('');
        callback();
    });

    this.Then(/^I can see an error message for invalid user email$/, function (callback) {
        LicenceTypeElements.duplicateEmailIdErrorElement.isDisplayed().then(function () {
            callback();
        });
    });

    this.Then(/^I cannot save the user details$/, function (callback) {
        LicenceTypeElements.duplicateEmailIdErrorElement.isDisplayed().then(function () {
            callback();
        });
    });
};

