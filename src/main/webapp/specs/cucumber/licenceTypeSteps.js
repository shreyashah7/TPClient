var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var CustomerMother = require("./../object-mothers/customermother");
var StaffMother = require("./../object-mothers/staffmother");
var VehicleMother = require("./../object-mothers/vehiclemother");
var ScenarioTags = require("./../constants/scenariotags");
var LicenceTypeElements = require("./../constants/licencetypeelements");
var PlanningElements = require("./../constants/planningelements");

var Q = require('q');

var expect = chai.expect;
module.exports = function () {
    this.Given(/^I am on the Licence Type Admin screen$/, function (callback) {
        configFile.gotoPage('admin/licencetypes', callback);
    });

    this.Then(/^I can see which type of licence apply to each size of vehicle in a table$/, function (callback) {
        LicenceTypeElements.licenceTypeTable.isPresent().then(function(value){
            if(value){
                callback();
            }else{
                callback(new Error("Licence type table is not displayed"));
            }
        });
    });

    this.When(/^I click the Add New button$/, function (callback) {
        LicenceTypeElements.addNewLink.click().then(function () {
            callback();
        });
    });

    this.Then(/^a new line will appear at the top of the table$/, function (callback) {
        LicenceTypeElements.licenceClass1Selection.getText().then(function (val) {
            if (val.indexOf('Please Select') >= 0) {
                callback();
            } else {
                callback(new Error('There is no row added at the top'));
            }
        });
    });


    this.Then(/^the row will contain a dropdown with all vehicles sizes and a dropdown with all licence types$/, function (callback) {
//        browser.sleep(5000);
        LicenceTypeElements.licenceClass1Input.click().then(function () {
            LicenceTypeElements.licenceClass1Options.then(function (elems) {
                console.log(elems.length)
                if (elems.length > 1) {
                    LicenceTypeElements.vehicleSize1Input.click().then(function () {
                        callback();
                    })
                } else {
                    callback(new Error('No values in licence class dropdown'));
                }
            })
        })

    });

    this.When(/^I select a new combination and click save$/, function (callback) {
//        element(by.id(LicenceTypeElements.vehicleType1Chosen)).sendKeys(configFile.vehicleTypePrefix + "1")
        configFile.selectChosenOption(function () {
            configFile.selectChosenOption(function () {
                LicenceTypeElements.saveButton.click().then(function () {
                    browser.sleep(1000);
                    browser.refresh();
                    callback();
                });
            }, LicenceTypeElements.vehicleSize1Chosen, configFile.vehicleTypePrefix + "1");
        }, LicenceTypeElements.licenceClass1Chosen, configFile.driverPrefix + "1");
    });

    this.Then(/^the new row is added to the top of the table$/, function (callback)
    {
        LicenceTypeElements.licenceClass1text.getText().then(function (val) {
            if (val === configFile.driverPrefix + "1") {
                callback();
            } else {
                callback(new Error('New row is not added at the top'))
            }
        }, function (val) {
            console.log(val)
        })
    });

    this.When(/^I change a value from one of the vehicle size or licence type dropdowns in the table$/, function (callback) {
        LicenceTypeElements.licenceClass1Input.click().then(function () {
            LicenceTypeElements.vehicleSize1Input.click().then(function () {
                configFile.selectChosenOption(function () {
                    configFile.selectChosenOption(function () {
                        callback();
                    }, LicenceTypeElements.vehicleSize1Chosen, configFile.vehicleTypePrefix + "2");
                }, LicenceTypeElements.licenceClass1Chosen, configFile.driverPrefix + "2");
            });
        });
    });

    this.When(/^I click save$/, function (callback) {
        LicenceTypeElements.saveButton.click().then(function () {
            browser.sleep(1000);
            browser.refresh();
            callback();
        });
    });

    this.Then(/^the combination of vehicle size and licence type is updated$/, function (callback) {
        LicenceTypeElements.licenceClass1text.getText().then(function (val) {
            if (val === configFile.driverPrefix + "2") {
                callback();
            } else {
                callback(new Error('New row is not added at the top'))
            }
        }, function (val) {
            console.log(val)
        })
    });
    this.Given(/^a driver has been allocated to a vehicle when their licence type isn't valid for the vehicle size$/, function (callback) {

        var vehiclePlanCreated = function () {
            configFile.gotoPage('planning', callback);
        };

        VehicleMother.createVehicleWithVehiclePlan(vehiclePlanCreated, {active: true, vehicle_reg: ScenarioTags.staffTags.validLicenceVehicle,
            vehicle_type: ScenarioTags.staffTags.validLicenceVehicle,
            vehicle_size: ScenarioTags.staffTags.validLicenceVehicle,
            vehicleTypeLicence: {vehicle_size: ScenarioTags.staffTags.validLicenceVehicle, licence_class: ScenarioTags.staffTags.invalidLicenceVehicle},
            staff: {driver_name: ScenarioTags.staffTags.validLicenceDriver, licence_class: ScenarioTags.staffTags.validLicenceVehicle},
            vehiclePlan: {plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForInvalidLicence)}});
    });

    this.Then(/^the vehicle on the planning screen shows a warning that the driver is not allowed to drive the vehicle$/, function (callback) {
        configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForInvalidLicence));
        element(protractor.By.xpath("//i[@id='" + ScenarioTags.staffTags.validLicenceVehicle + "']")).click().then(function () {
            browser.sleep(2000);
            element(protractor.By.xpath("//div[@id='" + ScenarioTags.staffTags.validLicenceVehicle + "Content']//i[@id='" + PlanningElements.unqualifiedWarning + "']")).isDisplayed().then(function (value) {
                if (value) {
                    callback();
                } else {
                    callback(new Error('Warning is not dipsleyd for unqualified driver.'));
                }
            });
        });
    });

    this.When(/^I go to the Licence Type Admin page and allocate their licence type to the vehicle size$/, function (callback) {
        var dataUpdated = function () {
            callback();
        };
        VehicleMother.updateVehicleTypeByLicenceClass(dataUpdated, ScenarioTags.staffTags.invalidLicenceVehicle, ScenarioTags.staffTags.validLicenceVehicle);
    });

    this.Then(/^the vehicle on the planning screen now shows that the driver is allowed to drive the vehicle$/, function (callback) {
        browser.refresh();
        configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForInvalidLicence));
        element(protractor.By.xpath("//i[@id='" + ScenarioTags.staffTags.validLicenceVehicle + "']")).click().then(function () {
            browser.sleep(2000);
            element(protractor.By.xpath("//div[@id='" + ScenarioTags.staffTags.validLicenceVehicle + "Content']//i[@id='" + PlanningElements.qualifiedWarning + "']")).isDisplayed().then(function (value) {
                if (value) {
                    callback();
                } else {
                    callback(new Error('Icon is not dipsleyd for qualified driver.'));
                }
            });
        });
    });

    this.When(/^I add or edit a row in the Licence Type Admin screen$/, function (callback) {
        var vehicleCreated = function () {
            var pageDisplayed = function () {
                LicenceTypeElements.addNewLink.click().then(function () {
                    callback();
                });
            };
            configFile.gotoPage('admin/licencetypes', pageDisplayed);
        };
        var vehicle = {vehicle_reg: configFile.vehiclePrefix + '3',
            vehicle_type: configFile.vehiclePrefix + '3',
            vehicle_size: configFile.vehiclePrefix + '3',
            vehicleTypeLicence: {vehicle_size: configFile.vehiclePrefix + '3', licence_class: configFile.driverPrefix + '3'}
        };
        VehicleMother.createByJson(vehicleCreated, vehicle);
    });

    this.When(/^create a combination that is a duplicate of another row$/, function (callback) {
        configFile.selectChosenOption(function () {
            configFile.selectChosenOption(function () {
                callback();
            }, LicenceTypeElements.vehicleSize1Chosen, configFile.vehiclePrefix + "3");
        }, LicenceTypeElements.licenceClass1Chosen, configFile.driverPrefix + "3");
    });

    this.When(/^I click the save button$/, function (callback) {
        LicenceTypeElements.saveButton.click().then(function () {
            browser.sleep(1000);
            callback();
        });
    });

    this.Then(/^the add\/update won't complete$/, function (callback) {
        callback();
    });

    this.Then(/^a message will appear telling me it was a duplicate$/, function (callback) {
        element(protractor.By.xpath("//span[contains(text(),'" + LicenceTypeElements.duplicateEntryMessage + "')]")).isDisplayed().then(function (value) {
            if (value) {
                callback();
            } else {
                callback(new Error('Duplicate entry message not displayed.'));
            }
        })
    });
};

