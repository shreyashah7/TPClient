var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var CustomerMother = require("./../object-mothers/customermother");
var ScenarioTags = require("./../constants/scenariotags");
var CustomerElements = require("./../constants/customerelements");
var Q = require('q');

var expect = chai.expect;
module.exports = function () {
    var totalRecords;

    this.Given(/^there are (\d+) customers in the database$/, function (arg1, callback) {
        totalRecords = arg1;
        var customersCreated = function () {
            callback();
        };
        var customers = [];
        for (var i = 0; i < arg1; i++) {
            customers.push({customer_name: ScenarioTags.customerTags.customerPaging + (i + 1), sales_contact: ScenarioTags.customerTags.customerNames,
                generic_email: ScenarioTags.customerTags.genericEmail});
        }
        CustomerMother.createListByJson(customersCreated, customers);
    });

    this.Then(/^(\d+) customers should be displayed$/, function (arg1, callback) {
        var customersDisplayed = function () {
            CustomerElements.txtSearchCustomer.clear();
            CustomerElements.txtSearchCustomer.sendKeys(ScenarioTags.customerTags.customerPaging).then(function () {
                element.all(by.repeater(CustomerElements.repeaterCustomerList).column(CustomerElements.columnCustomerSize)).then(function (elems) {
                    if (elems.length == arg1) {
                        callback();
                    } else {
                        callback.fail(arg1 + ' customers are not displayed');
                    }
                });
            });
        };
        configFile.gotoPage('customers', customersDisplayed);
    });

    this.When(/^I scroll to the bottom of the page, each time the next (\d+) rows should be displayed in customer table$/, function (arg1, callback) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
            element.all(by.repeater(CustomerElements.repeaterCustomerList).column(CustomerElements.columnCustomerSize)).then(function (elems) {
                if (elems.length >= (Number(arg1) + Number(arg1))) {
                    callback();
                } else {
                    callback.fail('No customers available');
                }
            });
        });
    });

    this.When(/^I click to create a new Customer$/, function (callback) {
        var customersDisplayed = function () {
            browser.sleep(1000);
            CustomerElements.btnNewCustomer.click().then(function () {
                callback();
            }, function () {
                callback(new Error('No button exists for Creating new customer'));
            });
        };
        configFile.gotoPage('customers', customersDisplayed);
    });

    this.Then(/^a new customer modal panel is opened$/, function (callback) {
        browser.driver.wait(function () {
            return element(by.xpath("//*[contains(text(),'Add Customer')]")).isDisplayed();
        });
//        configFile.waitForElementToBeDisplayed();
        expect(element(by.xpath("//div[@aria-hidden='false']")).isPresent()).to.eventually.equal(true).then(function () {
            expect(element(by.xpath("//*[contains(text(),'Add Customer')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });

    this.When(/^I fill in all the details in the customer modal$/, function (callback) {
        Q.all([
            CustomerElements.textCustomerName.sendKeys(ScenarioTags.customerTags.newCustomerScenario),
            CustomerElements.textSalesContact.sendKeys(ScenarioTags.customerTags.salesContact),
            CustomerElements.textGenericEmail.sendKeys(ScenarioTags.customerTags.genericEmail),
            CustomerElements.textAccountContact.sendKeys(ScenarioTags.customerTags.phoneNumber),
            CustomerElements.textSalesEmail.sendKeys(ScenarioTags.customerTags.salesEmail),
            CustomerElements.textAddress.sendKeys(ScenarioTags.customerTags.address),
            CustomerElements.textCityTown.sendKeys(ScenarioTags.customerTags.cityTown),
            CustomerElements.textCounty.sendKeys(ScenarioTags.customerTags.county),
            CustomerElements.textPostCode.sendKeys(ScenarioTags.customerTags.postCode),
            CustomerElements.textPhoneNumber.sendKeys(ScenarioTags.customerTags.phoneNumber),
            CustomerElements.textFax.sendKeys(ScenarioTags.customerTags.fax),
            CustomerElements.textVatNo.sendKeys(ScenarioTags.customerTags.vatNo),
            CustomerElements.textCompanyNumber.sendKeys(ScenarioTags.customerTags.companyNumber),
            CustomerElements.textCreditCheckYesRadio.click(),
            CustomerElements.textCreditLimit.sendKeys(ScenarioTags.customerTags.creditLimit),
            CustomerElements.textOnlineBookingYesRadio.click(),
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^click to save the Customer$/, function (callback) {
        CustomerElements.btnSaveCustomer.click().then(function () {
            callback();
        });
    });

    this.Then(/^the new customer is displayed in the table$/, function (callback) {
        CustomerElements.txtSearchCustomer.clear();
        CustomerElements.txtSearchCustomer.sendKeys(ScenarioTags.customerTags.newCustomerScenario).then(function () {
            setTimeout(function () {
                element.all(by.repeater(CustomerElements.repeaterCustomerList).column(CustomerElements.columnCustomerName)).then(function (elems) {
                    if (elems.length > 0) {
                        callback();
                    } else {
                        callback(new Error('New Customer is not displayed in the table'));
                    }
                });
            }, 3000);
        });
    });

    this.When(/^I click to cancel the Customer creation$/, function (callback) {
        CustomerElements.btnCancelCustomer.click().then(function () {
            callback();
        });
    });

    this.Then(/^the new customer is not displayed in the table$/, function (callback) {
        CustomerElements.txtSearchCustomer.clear();
        CustomerElements.txtSearchCustomer.sendKeys(ScenarioTags.customerTags.newCustomerScenario).then(function () {
            setTimeout(function () {
                element.all(by.repeater(CustomerElements.repeaterCustomerList).column(CustomerElements.columnCustomerName)).then(function (elems) {
                    if (elems.length > 0) {
                        callback(new Error('New Customer is displayed in the table'));
                    } else {
                        callback();
                    }
                });
            }, 3000);
        });
    });

    this.When(/^I click on a customer row$/, function (callback) {
        var customersCreated = function () {
            CustomerElements.txtSearchCustomer.clear();
            CustomerElements.txtSearchCustomer.sendKeys(ScenarioTags.customerTags.editCustomer).then(function () {
                setTimeout(function () {
                    element.all(by.repeater(CustomerElements.repeaterCustomerList).column(CustomerElements.columnCustomerName)).then(function (elems) {
                        if (elems.length > 0) {
                            CustomerElements.tblCustomerRow.click().then(function () {
                                callback();
                            });
                        } else {
                            callback(new Error('Edit Customer is not displayed in the table'));
                        }
                    });
                }, 3000);
            });
        };
        var createCustomers = function () {
            CustomerMother.createByJson(customersCreated, {customer_name: ScenarioTags.customerTags.editCustomer, sales_contact: ScenarioTags.customerTags.customerNames,
                generic_email: ScenarioTags.customerTags.genericEmail});
        };
        configFile.gotoPage('customers', createCustomers);
    });

    this.Then(/^an "([^"]*)" modal panel is displayed$/, function (arg1, callback) {
        configFile.waitForElementToBeDisplayed(element(by.xpath("//*[contains(text(),'Edit Customer')]")));
        expect(element(by.xpath("//div[@aria-hidden='false']")).isPresent()).to.eventually.equal(true).then(function () {
            expect(element(by.xpath("//*[contains(text(),'Edit Customer')]")).isPresent()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });

    this.Then(/^all the details of the Customer are prepopulated$/, function (callback) {
        callback();
    });

    this.When(/^I change the details of the Customer$/, function (callback) {
        Q.all([
            CustomerElements.textCustomerName.clear(),
            CustomerElements.textCustomerName.sendKeys(ScenarioTags.customerTags.editedCustomer),
            CustomerElements.textSalesContact.clear(),
            CustomerElements.textSalesContact.sendKeys(ScenarioTags.customerTags.salesContact),
            CustomerElements.textGenericEmail.clear(),
            CustomerElements.textGenericEmail.sendKeys(ScenarioTags.customerTags.genericEmail),
            CustomerElements.textAccountContact.clear(),
            CustomerElements.textAccountContact.sendKeys(ScenarioTags.customerTags.phoneNumber),
            CustomerElements.textSalesEmail.clear(),
            CustomerElements.textSalesEmail.sendKeys(ScenarioTags.customerTags.salesEmail),
            CustomerElements.textAddress.clear(),
            CustomerElements.textAddress.sendKeys(ScenarioTags.customerTags.address),
            CustomerElements.textCityTown.clear(),
            CustomerElements.textCityTown.sendKeys(ScenarioTags.customerTags.cityTown),
            CustomerElements.textCounty.clear(),
            CustomerElements.textCounty.sendKeys(ScenarioTags.customerTags.county),
            CustomerElements.textPostCode.clear(),
            CustomerElements.textPostCode.sendKeys(ScenarioTags.customerTags.postCode),
            CustomerElements.textPhoneNumber.clear(),
            CustomerElements.textPhoneNumber.sendKeys(ScenarioTags.customerTags.phoneNumber),
            CustomerElements.textFax.clear(),
            CustomerElements.textFax.sendKeys(ScenarioTags.customerTags.fax),
            CustomerElements.textVatNo.clear(),
            CustomerElements.textVatNo.sendKeys(ScenarioTags.customerTags.vatNo),
            CustomerElements.textCompanyNumber.clear(),
            CustomerElements.textCompanyNumber.sendKeys(ScenarioTags.customerTags.companyNumber),
            CustomerElements.textCreditCheckYesRadio.click(),
            CustomerElements.textCreditLimit.clear(),
            CustomerElements.textCreditLimit.sendKeys(ScenarioTags.customerTags.creditLimit),
            CustomerElements.textOnlineBookingYesRadio.click(),
        ]).then(function (value) {
            callback()
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^click to save the changes$/, function (callback) {
        CustomerElements.btnSaveCustomer.click().then(function () {
            callback();
        });
    });

    this.Then(/^the customer's details have been updated in the table$/, function (callback) {
        CustomerElements.txtSearchCustomer.clear();
        CustomerElements.txtSearchCustomer.sendKeys(ScenarioTags.customerTags.editedCustomer).then(function () {
            setTimeout(function () {
                element.all(by.repeater(CustomerElements.repeaterCustomerList).column(CustomerElements.columnCustomerName)).then(function (elems) {
                    if (elems.length > 0) {
                        callback();
                    } else {
                        callback(new Error("the customer's details have not been updated in the table"));
                    }
                });
            }, 3000);
        });
    });


};

