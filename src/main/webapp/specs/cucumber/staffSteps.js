var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var StaffMother = require("./../object-mothers/staffmother");
var ScenarioTags = require("./../constants/scenariotags");
var StaffElements = require("./../constants/staffelements");
var Q = require('q');

var expect = chai.expect;
var driverNames = [];
module.exports = function () {
    var totalRecords;
    this.When(/^I navigate to the Staff page$/, function (callback) {
        var staffCreated = function () {
            configFile.gotoPage('staff', callback);
        };
        StaffMother.createByJson(staffCreated, {driver_name: ScenarioTags.staffTags.paging});
    });
    this.Then(/^a table containing the details of all the staff is displayed$/, function (callback) {
        element.all(by.repeater(StaffElements.repeaterStaffList)).then(function (elems) {
            if (elems.length > 0) {
                callback();
            } else {
                callback.fail("I cannot see the staff records.");
            }
        });
    });
    this.Given(/^there are (\d+) staff in the database$/, function (arg1, callback) {
        totalRecords = arg1;
        var staffCreated = function () {
            configFile.gotoPage('staff', callback);
        };
        var staffs = [];
        for (var i = 0; i < arg1; i++) {
            staffs.push({driver_name: ScenarioTags.staffTags.paging + (i + 1), licence_number: ScenarioTags.staffTags.licenceNumber});
        }
        StaffMother.createListByJson(staffCreated, staffs);
    });
    this.Then(/^(\d+) staff should be displayed$/, function (arg1, callback) {
        var staffDisplayed = function () {
            StaffElements.txtSearchStaff.sendKeys(ScenarioTags.staffTags.paging).then(function () {
                element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
                    if (elems.length == arg1) {
                        callback();
                    } else {
                        callback(new Error(arg1 + ' staffs are not displayed'));
                    }
                });
            });
        };
        staffDisplayed();
    });
    this.When(/^I scroll to the bottom of the page, each time the next (\d+) rows should be displayed in staff table$/, function (arg1, callback) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
            element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
                if (elems.length >= (Number(arg1) + Number(arg1))) {
                    callback();
                } else {
                    callback(new Error('No staffs available'));
                }
            });
        });
    });
    this.When(/^I click to create a new Staff member$/, function (callback) {

        var staffDisplayed = function () {
            browser.sleep(1000);
            StaffElements.btnNewStaff.click().then(function () {
                callback();
            }, function () {
                callback(new Error('No button exists for Creating new staff'));
            });
        };
        configFile.gotoPage('staff', staffDisplayed);
    });
    this.Then(/^a new staff modal panel is opened$/, function (callback) {
        browser.driver.wait(function () {
            return element(by.xpath("//*[contains(text(),'Add Staff')]")).isDisplayed();
        });
        expect(element(by.xpath("//div[@aria-hidden='false']")).isPresent()).to.eventually.equal(true).then(function () {
            expect(element(by.xpath("//*[contains(text(),'Add Staff')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });
    this.When(/^I fill in all the new staff details$/, function (callback) {
        Q.all([
            StaffElements.textDriverName.sendKeys(ScenarioTags.staffTags.newStaffScenario),
            configFile.selectInTypeAhead(StaffElements.textLicenceClass, 'licenceClassBlock'),
            StaffElements.textLicenceNumber.sendKeys(ScenarioTags.staffTags.licenceNumber),
            StaffElements.textNoRadio.click(),
            StaffElements.textPhoneNumber.sendKeys(ScenarioTags.staffTags.phoneNumber),
            StaffElements.textMobile.sendKeys(ScenarioTags.staffTags.mobile),
            configFile.selectDate(StaffElements.textDateOfBirth, ScenarioTags.staffTags.dateOfBirth),
            StaffElements.textCityTown.sendKeys(ScenarioTags.staffTags.cityTown),
            StaffElements.textCounty.sendKeys(ScenarioTags.staffTags.county),
            StaffElements.textPostCode.sendKeys(ScenarioTags.staffTags.postCode),
            configFile.selectDate(StaffElements.textEmploymentDate, ScenarioTags.staffTags.employmentDate),
            StaffElements.textAddress.click(),
            StaffElements.textAddress.sendKeys(ScenarioTags.staffTags.address),
            configFile.selectDate(StaffElements.textEyeTest, ScenarioTags.staffTags.eyeTest),
            StaffElements.textHourContract.sendKeys(ScenarioTags.staffTags.hourContract),
        ]).then(function (value) {
            callback()
        }, function (value) {
            callback(new Error(value));
        });
    });
    this.When(/^click to save the Staff member$/, function (callback) {
        StaffElements.btnSaveStaffYes.click().then(function () {
            callback();
        });
    });
    this.Then(/^the new staff member is displayed in the table$/, function (callback) {
        StaffElements.txtSearchStaff.clear();
        StaffElements.txtSearchStaff.sendKeys(ScenarioTags.staffTags.newStaffScenario).then(function () {
            setTimeout(function () {
                element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
                    if (elems.length > 0) {
                        callback();
                    } else {
                        callback(new Error('New Staff is not displayed in the table'));
                    }
                });
            }, 3000);
        });
    });
    this.Given(/^the modal panel to create new Staff member is open$/, function (callback) {
        var btnClicked = function () {
            callback();
        };
        var staffDisplayed = function () {
            StaffElements.btnNewStaff.click().then(function () {
                btnClicked();
            }, function (err) {
                callback(new Error('No button exists for Creating new staff'));
            });
        };
        configFile.gotoPage('staff', staffDisplayed);
    });
    this.When(/^I click to cancel the Staff creation$/, function (callback) {
        StaffElements.btnCancelStaff.click().then(function () {
            callback();
        });
    });
    this.Then(/^the new staff member is not displayed in the table$/, function (callback) {
        StaffElements.txtSearchStaff.clear();
        StaffElements.txtSearchStaff.sendKeys(ScenarioTags.staffTags.newStaffScenario).then(function () {
            setTimeout(function () {
                element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
                    if (elems.length === 0) {
                        callback();
                    } else {
                        callback(new Error('New Staff is displayed in the table'));
                    }
                });
            }, 3000);
        });
    });
    this.When(/^I click on a staff row$/, function (callback) {
        var staffCreated = function () {
            configFile.waitForElementToBeDisplayed(StaffElements.txtSearchStaff);
            StaffElements.txtSearchStaff.sendKeys(ScenarioTags.staffTags.editStaff).then(function () {
                element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
                    if (elems.length > 0) {
                        StaffElements.tblStaffRow.click().then(function () {
                            callback();
                        });
                    } else {
                        callback(new Error('staff is not displayed'));
                    }
                });
            });
        };
        var createStaff = function () {
            StaffMother.createByJson(staffCreated, {driver_name: ScenarioTags.staffTags.editStaff});
        };
        configFile.gotoPage('staff', createStaff);
    });
    this.Then(/^the "([^"]*)" modal panel is displayed on staff page$/, function (arg1, callback) {
        expect(element(protractor.By.xpath("//div[@aria-hidden='false']")).isPresent()).to.eventually.equal(true).then(function () {
            expect(element(protractor.By.xpath("//*[contains(text(),'Edit Staff')]")).isPresent()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });
    this.Then(/^all the details of the staff member are prepopulated$/, function (callback) {
        Q.all([
            expect(StaffElements.textDriverName.getAttribute('value')).to.eventually.equal(ScenarioTags.staffTags.editStaff)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });
    this.When(/^I change the details of the staff member$/, function (callback) {
        Q.all([
            StaffElements.textDriverName.clear(),
            StaffElements.textDriverName.sendKeys(ScenarioTags.staffTags.editedStaff),
            StaffElements.textLicenceClass.clear(),
            StaffElements.textLicenceNumber.clear(),
            StaffElements.textLicenceNumber.sendKeys(ScenarioTags.staffTags.licenceNumber),
            StaffElements.textNoRadio.click(),
            StaffElements.textPhoneNumber.clear(),
            StaffElements.textPhoneNumber.sendKeys(ScenarioTags.staffTags.phoneNumber),
            StaffElements.textMobile.clear(),
            StaffElements.textMobile.sendKeys(ScenarioTags.staffTags.mobile),
            configFile.selectDate(StaffElements.textDateOfBirth, ScenarioTags.staffTags.dateOfBirth),
            StaffElements.textCityTown.clear(),
            StaffElements.textCityTown.sendKeys(ScenarioTags.staffTags.cityTown),
            StaffElements.textCounty.clear(),
            StaffElements.textCounty.sendKeys(ScenarioTags.staffTags.county),
            StaffElements.textPostCode.clear(),
            StaffElements.textPostCode.sendKeys(ScenarioTags.staffTags.postCode),
            configFile.selectDate(StaffElements.textEmploymentDate, ScenarioTags.staffTags.employmentDate),
            StaffElements.textAddress.clear(),
            StaffElements.textAddress.sendKeys(ScenarioTags.staffTags.address),
            configFile.selectDate(StaffElements.textEyeTest, ScenarioTags.staffTags.eyeTest),
            StaffElements.textHourContract.clear(),
            StaffElements.textHourContract.sendKeys(ScenarioTags.staffTags.hourContract)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });
    this.Then(/^the staff's details have been updated in the table$/, function (callback) {
        StaffElements.txtSearchStaff.clear();
        StaffElements.txtSearchStaff.sendKeys(ScenarioTags.staffTags.editedStaff).then(function () {
            element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
                if (elems.length > 0) {
                    elems[0].getText().then(function (value) {
                        if (value == ScenarioTags.staffTags.editedStaff) {
                            callback();
                        }
                    });
                } else {
                    callback(new Error('staff is not displayed'));
                }
            });
        });
    });
    this.Given(/^I am on the staff grid view$/, function (callback) {
        var staffCreated = function () {
            callback();
        };
        var createStaff = function () {
            StaffMother.createByJson(staffCreated, {driver_name: ScenarioTags.staffTags.filterStaff, licence_class: ScenarioTags.staffTags.filterStaff});
        };
        configFile.gotoPage('staff', createStaff);
    });
    this.When(/^I click on the filter by driver name$/, function (callback) {
        StaffElements.driverFilter.click().then(function () {
            callback();
        });
    });
    this.When(/^enter the name of the driver$/, function (callback) {
        element(by.xpath("//input[@closeenter='filterDriverName']")).sendKeys(ScenarioTags.staffTags.filterStaff).then(function () {
            callback();
        });
    });
    this.Then(/^I can only see that driver filtered in the table$/, function (callback) {
        element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnDriverName)).then(function (elems) {
            elems[0].getText().then(function (value) {
                if (value == ScenarioTags.staffTags.filterStaff) {
                    callback();
                }
            });
        });
    });
    this.When(/^I click on the filter by license class$/, function (callback) {
        StaffElements.licenceClass.click().then(function () {
            callback();
        });
    });
    this.When(/^enter the license class of the driver$/, function (callback) {
        element(by.xpath("//input[@closeenter='filterLicenceClass']")).sendKeys(ScenarioTags.staffTags.filterStaff).then(function () {
            callback();
        });
    });
    this.Then(/^I can only see the license class filtered in the table$/, function (callback) {
        element.all(by.repeater(StaffElements.repeaterStaffList).column(StaffElements.columnLicenceClass)).then(function (elems) {
            elems[0].getText().then(function (value) {
                if (value == ScenarioTags.staffTags.filterStaff) {
                    callback();
                }
            });
        });
    });
    this.When(/^(.*) column is clicked in staff table$/, function (column, callback) {
        StaffElements.driverFilter.click().then(function () {
            element(protractor.By.xpath("//input[@closeenter='filterDriverName']")).sendKeys(ScenarioTags.staffTags.driverName1).then(function () {
                element(protractor.By.xpath("//th//span[contains(text(), '" + column + "')]")).click().then(function () {
                    callback();
                }, function (err) {
                    callback(new Error(err));
                });
            });
        });
    });
    this.When(/^the (.*) is clicked again in staff  table$/, function (column, callback) {
        element(by.xpath("//th//span[contains(text(), '" + column + "')]")).click().then(function () {
            callback();
        }, function (err) {
            callback.fail(err);
        });
    });
    this.Given(/^there are a number of staffs in the system$/, function (table, callback) {
        var raws = table.raw();
        var driverNames = [];
        for (var i = 1; i < raws.length; i++) {
            driverNames.push(raws[i][0]);
        }
        var goToStaffPage = function () {
            configFile.gotoPage('staff', callback);
        };
        var createStaff = function () {
            var staffs = [];
            for (i = 1; i < raws.length; i++) {
                raws[i][1] = configFile.convertDateTimeFormat(raws[i][1]);
                raws[i][2] = configFile.convertDateTimeFormat(raws[i][2]);
                staffs.push({driver_name: raws[i][0], licence_number: ScenarioTags.staffTags.licenceNumber, city_town: "new", mobile: "989898", county: "new", post_code: "2323j", employment_date: raws[i][1], eye_test: raws[i][2]});
            }
            StaffMother.createListByJson(goToStaffPage, staffs);
        };
        CommonDao.deleteData(createStaff, 'staff', {where: {driver_name: driverNames}});
    });
    this.Then(/^the (.*) is at the top in staff  table for (.*)$/, function (firstExpectedValue, column, callback) {
        var cellId;
        if (column === 'Driver Name') {
            cellId = 'tblDriverName1';
        } else if (column === 'Employment Date') {
            cellId = 'tblEmploymentDate1';
        } else if (column === 'Eye Test') {
            cellId = 'tblEyeTest1';
        }
        element(by.id(cellId)).getText().then(function (text) {
            if (text === firstExpectedValue) {
                callback();
            } else {
                callback(new Error('No sorting applied for ' + firstExpectedValue));
            }
        });
    });
    this.Given(/^I am on Staff page and adding a new staff$/, function (callback) {
        var staffDisplayed = function () {
            browser.sleep(1000);
            StaffElements.btnNewStaff.click().then(function () {
                callback();
            }, function () {
                callback(new Error('No button exists for Creating new staff'));
            });
        };
        configFile.gotoPage("staff", staffDisplayed);
    });
    this.When(/^I click on checkbox for "([^"]*)"$/, function (arg1, callback) {
        StaffElements.staffTemporarycheckbox.click().then(function () {
            callback();
        })
    });
    this.Then(/^the modal popup should be updated with Agency Company, Drivers Name, Mobile Number, Licence Class, ADR, Licence Number$/, function (callback) {
        expect(element(by.xpath("//div//label[contains(text(),'Driver Name')]")).isDisplayed()).to.eventually.equal(true).then(function () {
            expect(element(by.xpath("//div//label[contains(text(),'Agency Company')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                expect(element(by.xpath("//div//label[contains(text(),'Mobile')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                    expect(element(by.xpath("//div//label[contains(text(),'ADR')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                        expect(element(by.xpath("//div//label[contains(text(),'Licence Class')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                            expect(element(by.xpath("//div//label[contains(text(),'Licence Number')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                                expect(element(by.xpath("//div//label[contains(text(),'Phone Number')]")).isPresent()).to.eventually.equal(false).then(function () {
                                    expect(element(by.xpath("//div//label[contains(text(),'Employment Date')]")).isPresent()).to.eventually.equal(false).then(function () {
                                        expect(element(by.xpath("//div//label[contains(text(),'Address')]")).isPresent()).to.eventually.equal(false).then(function () {
                                            callback();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    this.Given(/^staff exist in a d\/b$/, function (callback) {
        var goToStaffPage = function () {
            configFile.gotoPage('staff', callback);
        };
        var staffs = [];
        staffs.push({driver_name: ScenarioTags.staffTags.staffManifestDate, licence_number: ScenarioTags.staffTags.staffManifestDate, city_town: "new", mobile: "989898", county: "new", post_code: "2323j"});
        StaffMother.createListByJson(goToStaffPage, staffs);
    });
    this.Given(/^I am viewing download manifest modal$/, function (callback) {
        StaffElements.txtSearchStaff.clear();
        StaffElements.txtSearchStaff.sendKeys(ScenarioTags.staffTags.staffManifestDate).then(function () {
            StaffElements.btnStaffManifest.click().then(function () {
                browser.sleep(500);
                callback();
            });
        });
    });
    this.Then(/^it should display manifest date default to tomorrow's date$/, function (callback) {
        StaffElements.txtManifestDate.getAttribute('value').then(function (value) {
            if(value==configFile.convertDateToString(new Date().setDate(new Date().getDate()+1))){
                callback();
            }else{
                callback(new Error("Date is not defaulted to tomorrow's date"));
            }
        });
    });

};