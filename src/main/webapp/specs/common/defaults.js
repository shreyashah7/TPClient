var defaults = function () {
    var chai = require('chai');
    var chaiAsPromised = require('chai-as-promised');
    var Q = require('q');
    chai.use(chaiAsPromised);

    var expect = chai.expect;
    var ptor;
    this.getConfig = function () {
        var schema_config = {
            database: 'tp_server_dev',
            username: 'root',
            host: 'localhost',
            port: 3306,
            password: 'password'
        };
        return schema_config;
    };
    this.goToLogInPage = function (callback) {
        this.gotoPage('');
        expect(element(by.xpath("//*[contains(text(),'Logout')]")).isDisplayed()).to.eventually.equal(true)
                .then(function () {
                    browser.findElement(by.xpath("//*[contains(text(),'Logout')]")).click().then(function () {
                        if (callback) {
                            callback();
                        }
                    });
                }, function (value) {
                    if (callback) {
                        callback();
                    }
                });
    };
    this.dummyDataSize = 3;
    this.driverPrefix = 'ProtrStaff';
    this.customerPrefix = 'ProtrCustomer';
    this.vehicleTypePrefix = 'Protr Vehicle';
    this.vehiclePrefix = 'Protr Vehicle';
    this.licenceClassPrefix = 'Protr Licence';
    this.defaultVehicleArtic = 'Rigid';
    this.driverNameIdMap = {};
    this.setDriverNameIdMap = function (map) {
        this.driverNameIdMap = map;
    };
    this.customerNameIdMap = {};
    this.setCustomerNameIdMap = function (map) {
        this.customerNameIdMap = map;
    };
    this.collectionPoints = [{name: 'pro CP 2123', point_type: 'C'}, {name: 'pro DP 2123', point_type: 'D'}];
    this.defaultCollectionPointId;
    this.defaultDeliveryPointId;
    ;
    this.vehicleNameIdMap = {};
    this.setVehicleNameIdMap = function (map) {
        this.vehicleNameIdMap = map;
    };
    this.vehicles = ['ProtrVehi 2', 'ProtrVehi3', 'ProtrVehi 1'];
    this.testUser = {email: 'user@tpclient.com', plainPassword: 'tp123', password: 'c062f0b6e30bbe2c0ee9d78e2f4a4fb1019d6a8b',
        first_name: 'Protractor', sur_name: 'User', active: 1, deleted: 0};
    this.getBaseUrl = function () {
        return browser.params.domainUrl + browser.params.contextPath + '/#/';
    };
    this.gotoPage = function (path, callback) {
        ptor = browser;
        browser.driver.manage().window().maximize();
        var url = this.getBaseUrl();
        var callbackFn = function () {
            ptor.driver.get(url + path).then(function () {
                ptor.waitForAngular();
                if (callback) {
                    callback();
                }
            }, function () {
                if (callback) {
                    callback();
                }
            });
        };
        callbackFn();
    };
    this.checkPageTitle = function (pageTitle, callback) {
        expect(ptor.getTitle()).to.eventually.equal(pageTitle).then(function (value) {
            callback();
        }, function (error) {
            callback.fail('Page title is not :' + pageTitle);
        });
    };
    this.checkPageURL = function (url, callback) {
        var browserUrl = this.getBaseUrl() + url;
        expect(ptor.getCurrentUrl()).to.eventually.equal(browserUrl).then(function (value) {
            callback();
        }, function (error) {
            callback(new Error('Page url is not :' + url));
        });
    };
    this.checkPageHeader = function (pageHeader, page, callback) {
        if (page === null) {
            expect(element(by.id("titleSubHeader")).getText()).to.eventually.equal(pageHeader).then(function (value) {
                callback();
            }, function (error) {
                callback(new Error('Page header is not :' + pageHeader + "   " + error));
            });
        } else {
            expect(element(by.id("titleHeader")).getText()).to.eventually.equal(pageHeader).then(function (value) {
                expect(element(by.id("titleSubHeader")).getText()).to.eventually.equal(page).then(function (value) {
                    callback();
                })
            }, function (error) {
                callback.fail('Page header is not :' + pageHeader);
            });
            //ol[@class='breadcrumb']//li[1]
        }
    };
    this.scrollInToElement = function (element) {
        var scrollIntoView = function () {
            arguments[0].scrollIntoView();
        };
        browser.executeScript(scrollIntoView, element);
    };
    this.hasClass = function (element, cls) {
        return element.getAttribute('class').then(function (classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    this.checkPageHeaderNew = function (pageHeader, callback) {
        Q(expect(element(by.xpath("//div//ol//li[contains(text(),'" + pageHeader + "')]")).isPresent()).to.eventually.equal(true)).then(function (value) {
            callback();
        }, function () {
            callback.fail('No Header text displayed');
        });
    };
    this.selectChosenOption = function (callback, elementId, option, strictCheck) {
        ptor.findElement(by.id(elementId)).click().then(function () {
            if (strictCheck == null || strictCheck == true) {
                element(by.xpath("//*[@id='" + elementId + "']//div//ul//li[text()= '" + option + "']")).click().then(function () {
                    callback();
                });
            } else {
                element(by.xpath("//*[@id='" + elementId + "']//div//ul//li[contains(text(),'" + option + "')]")).click().then(function () {
                    callback();
                });
            }
        });
    };

    this.selectInTypeAhead = function (inputElement, parentDivId, callback) {
        inputElement.sendKeys('', protractor.Key.TAB).then(function () {
            element(by.xpath("//*[@id='" + parentDivId + "']//li/a")).click();
            if (callback) {
                callback();
            }
        });
    };

    this.waitForElementToBeDisplayed = function (elemetToCheck) {
        browser.driver.wait(function () {
            return elemetToCheck.isDisplayed();
        });
    };

    this.verifyChosenOptions = function (callback, elementId, optionsToVerify) {
        element(by.id(elementId)).click().then(function () {
            var count = 0;
                for (var i = 0; i < optionsToVerify.length; i++) {
                    var value = optionsToVerify[i];
                    Q(expect(element(by.xpath("//*[@id='" + elementId + "']/div/ul/li[contains(text(), '" + value + "')]")).isPresent()).to.eventually.equal(true)).then(function (value) {
                        count++;
                        if (count === i) {
                            element(by.id(elementId)).click();
                            callback(true);
                        }

                    }, function (value) {
                        element(by.id(elementId)).click();
                        callback(false);
                        return;
                    });
                }
        });
    };
    this.selectDate = function (dateElement, text) {
        dateElement.click();
        dateElement.clear();
        dateElement.sendKeys(text);
        element(by.xpath("//*[@date-picker-wrap]//button[contains(text(),'Close')]")).isPresent().then(function () {
            element(by.xpath("//*[@date-picker-wrap]//button[contains(text(),'Close')]")).click().then(function () {
            }, function () {
            });
        })

    }

    this.convertDateTimeFormat = function (value) {
        var arr = value.split("/");
        return arr[2] + "-" + arr[1] + "-" + arr[0] + " " + "00:00:00";
    };
    this.convertDateToFullDateFormat = function (value) {
        var arr = value.split("/");
        var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var d = new Date(arr[2], arr[1] - 1, arr[0]);
        return weekdays[d.getDay()] + ", " + d.getDate() + " " + monthNames[d.getMonth()] + "," + d.getFullYear();
    };

};
module.exports = new defaults();
