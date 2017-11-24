var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var VehicleMother = require("./../object-mothers/vehiclemother");
var ScenarioTags = require("./../constants/scenariotags");
var VehicleElements = require("./../constants/vehicleelements");
var Q = require('q');
var expect = chai.expect;
var vehTypeId;
var totalRecords;
module.exports = function () {
    //beforefeatures hook to create testdata..
    this.When(/^I navigate to the Vehicle page$/, function (callback) {
        var vehicleDisplay = function () {
            callback();
        };
        configFile.gotoPage('vehicle', vehicleDisplay);
    });

    this.Then(/^a table containing the details of all the vehicles is displayed$/, function (callback) {
        element.all(by.repeater(VehicleElements.repeaterVehicleList)).then(function (elems) {
            if (elems.length > 0) {
                callback();
            } else {
                callback.fail("I cannot see the vehicle records.");
            }
        });
    });
    this.Given(/^there are (\d+) vehicles in the database$/, function (arg1, callback) {
        var vehicleCreated = function () {
            configFile.gotoPage('vehicle', callback);
        };
        totalRecords = arg1;
        var vehicles = [];
        for (var i = 0; i < arg1; i++) {
            vehicles.push({vehicle_reg: ScenarioTags.vehicleTags.paging + (i + 1),
                vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                vehicle_size: ScenarioTags.vehicleTags.vehicleSize,
//                vehicleTypeLicence : {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass}
            });
        }
        VehicleMother.createListByJson(vehicleCreated, vehicles)
    });

    this.Then(/^(\d+) vehicles should be displayed$/, function (arg1, callback) {
        var vehicleDisplayed = function () {
            VehicleElements.txtSearchVehicle.sendKeys(ScenarioTags.vehicleTags.paging).then(function () {
                element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehReg)).then(function (elems) {
                    if (elems.length == arg1) {
                        callback();
                    } else {
                        callback.fail(arg1 + ' vehicles are not displayed');
                    }
                });
            });
        };
        vehicleDisplayed();
    });

    this.When(/^I scroll to the bottom of the page, each time the next (\d+) rows should be displayed in Vehicle table$/, function (arg1, callback) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
            element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehReg)).then(function (elems) {
                if (elems.length >= (Number(arg1) + Number(arg1))) {
                    callback();
                } else {
                    callback.fail('No vehicles available');
                }
            });
        });
    });

    this.When(/^I click to create a new vehicle on page$/, function (callback) {
        configFile.gotoPage('vehicle', callback);
    });

    this.Then(/^the New Vehicle modal panel is opened$/, function (callback) {
        browser.sleep(3000);
        VehicleElements.btnNewVehicle.click().then(function () {
            expect(VehicleElements.addVehicleModal.isDisplayed()).to.eventually.equal(true).then(function () {
                expect(element(by.xpath("//*[contains(text(),'Add Vehicle')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                    callback();
                });
            });

        }, function () {
            callback(new Error('No button exists for Creating new staff'));
        });
    });
    this.When(/^I fill in all the new vehicle details$/, function (callback) {
        Q.all([
            VehicleElements.textvehicleReg.sendKeys(''),
            VehicleElements.textvehicleReg.sendKeys(ScenarioTags.vehicleTags.newVehicleScenario),
            configFile.selectInTypeAhead(VehicleElements.textvehicleSize, 'vehicleSizeBlock'),
            configFile.selectInTypeAhead(VehicleElements.textvehicleType, 'vehicleTypeBlock'),
            VehicleElements.textcarryingCapacity.sendKeys(4),
//            VehicleElements.noRadio.click(),
            VehicleElements.textpalletCapacity.sendKeys(4),
            VehicleElements.textinternalHeight.sendKeys(100),
            VehicleElements.textinternalLength.sendKeys(100),
            VehicleElements.textinternalLength.sendKeys(100),
            VehicleElements.textvehicleHeight.sendKeys(50),
            VehicleElements.textmotDue.click(),
            VehicleElements.textmotDue.sendKeys('01/01/1990'),
            VehicleElements.textsixWeeklyCheck.click(),
            VehicleElements.textsixWeeklyCheck.sendKeys('01/01/1990'),
            VehicleElements.texttachoCheckDue.click(),
            VehicleElements.texttachoCheckDue.sendKeys('01/01/1990'),
            VehicleElements.textloler6MonthCheck.click(),
            VehicleElements.textloler6MonthCheck.sendKeys('01/01/1990'),
            VehicleElements.textloler12MonthCheck.click(),
            VehicleElements.textloler12MonthCheck.sendKeys('01/01/1990'),
            VehicleElements.activeNoRadio.click(),
            VehicleElements.defectNoRadio.click(),
            VehicleElements.textTrackNumber.sendKeys('10123456'),
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value))
        });
    }
    );

    this.When(/^click to save the Vehicle$/, function (callback) {
        VehicleElements.btnSaveVehicle.click().then(function () {
            callback();
        });
    });

    this.Then(/^the new vehicle is displayed in the table$/, function (callback) {
        VehicleElements.txtSearchVehicle.clear();
        VehicleElements.txtSearchVehicle.sendKeys(ScenarioTags.vehicleTags.newVehicleScenario).then(function () {
            setTimeout(function () {
                element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehReg)).then(function (elems) {
                    if (elems.length > 0) {
                        callback();
                    } else {
                        callback(new Error('New vehicle is not displayed in the table'));
                    }
                });
            }, 3000);
        });
    });

    this.Given(/^the modal panel to create new Vehicle is open$/, function (callback) {
        var vehicleDisplayed = function () {
            browser.sleep(2000);
            VehicleElements.btnNewVehicle.click().then(function () {
                setTimeout(function () {
                    expect(VehicleElements.addVehicleModal.isPresent()).to.eventually.equal(true).then(function () {
                        browser.sleep(500);
                        expect(element(by.xpath("//*[contains(text(),'Add Vehicle')]")).isPresent()).to.eventually.equal(true).then(function () {
                            callback();
                        });
                    });
                }, 500);
            }, function () {
                callback(new Error('No button exists for Creating new staff'));
            });
        };
        configFile.gotoPage('vehicle', vehicleDisplayed);
    });

    this.When(/^I click to cancel the Vehicle creation$/, function (callback) {
        VehicleElements.btnCancelVehicle.click().then(function () {
            callback();
        });
    });

    this.Given(/^one vehicle exists to edit$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        var vehicleCreated = function () {
            configFile.gotoPage('vehicle', callback);
        };
        var vehicle = {vehicle_reg: ScenarioTags.vehicleTags.editVehicle,
            vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
            vehicle_size: ScenarioTags.vehicleTags.vehicleSize,
//                vehicleTypeLicence : {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass}
        };
        VehicleMother.createByJson(vehicleCreated, vehicle);
    });

    this.When(/^I click on a vehicle row$/, function (callback) {
        VehicleElements.txtSearchVehicle.clear();
        VehicleElements.txtSearchVehicle.sendKeys(ScenarioTags.vehicleTags.editVehicle).then(function () {
            VehicleElements.tblVehicleRow.click().then(function () {
                expect(VehicleElements.addVehicleModal.isPresent()).to.eventually.equal(true).then(function () {
                    expect(element(by.xpath("//*[contains(text(),'Edit Vehicle')]")).isPresent()).to.eventually.equal(true).then(function () {
                        callback();
                    });
                });
            }, function () {
                callback(new Error('No vehicle exists for edit'));
            });
        });
    });

    this.Then(/^all the details of the Vehicle are prepopulated$/, function (callback) {
        callback();
    });

    this.When(/^I change the details of the Vehicle$/, function (callback) {
        Q.all([
            VehicleElements.textvehicleReg.clear(),
            VehicleElements.textvehicleReg.sendKeys(ScenarioTags.vehicleTags.editedVehicle),
            VehicleElements.textvehicleSize.sendKeys(ScenarioTags.vehicleTags.vehicleSize),
            VehicleElements.textvehicleType.sendKeys(ScenarioTags.vehicleTags.paging),
            VehicleElements.textcarryingCapacity.sendKeys('4'),
            VehicleElements.textpalletCapacity.sendKeys('4'),
            VehicleElements.yesRadio.click(),
            VehicleElements.textinternalHeight.clear(),
            VehicleElements.textinternalHeight.sendKeys(1),
            VehicleElements.textinternalLength.clear(),
            VehicleElements.textinternalLength.sendKeys(1),
            VehicleElements.textvehicleHeight.clear(),
            VehicleElements.textvehicleHeight.sendKeys(1),
            VehicleElements.textmotDue.clear(),
            VehicleElements.textmotDue.click(),
            VehicleElements.textmotDue.sendKeys('01/01/1990'),
            VehicleElements.textsixWeeklyCheck.clear(),
            VehicleElements.textsixWeeklyCheck.click(),
            VehicleElements.textsixWeeklyCheck.sendKeys('01/01/1990'),
            VehicleElements.texttachoCheckDue.clear(),
            VehicleElements.texttachoCheckDue.click(),
            VehicleElements.texttachoCheckDue.sendKeys('01/01/1990'),
            VehicleElements.textloler6MonthCheck.clear(),
            VehicleElements.textloler6MonthCheck.click(),
            VehicleElements.textloler6MonthCheck.sendKeys('01/01/1990'),
            VehicleElements.textloler12MonthCheck.clear(),
            VehicleElements.textloler12MonthCheck.click(),
            VehicleElements.textloler12MonthCheck.sendKeys('01/01/1990'),
            VehicleElements.activeNoRadio.click(),
            VehicleElements.defectNoRadio.click(),
            VehicleElements.textTrackNumber.sendKeys('1'),
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback.fail(value);
        });
    });

    this.When(/^click to save the changes of Vehicle$/, function (callback) {
        VehicleElements.btnSaveVehicle.click().then(function () {
            callback();
        });
    });

    this.Then(/^the vehicle's details have been updated in the table$/, function (callback) {
        VehicleElements.txtSearchVehicle.clear();
        VehicleElements.txtSearchVehicle.sendKeys(ScenarioTags.vehicleTags.editedVehicle).then(function () {
            setTimeout(function () {
                element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehReg)).then(function (elems) {
                    if (elems.length > 0) {
                        callback();
                    } else {
                        callback(new Error('New vehicle is displayed in the table'));
                    }
                });
            }, 3000);
        });
    });
    this.Then(/^the new vehicle is not displayed in the table$/, function (callback)
    {
        VehicleElements.txtSearchVehicle.clear();
        VehicleElements.txtSearchVehicle.sendKeys(ScenarioTags.vehicleTags.newVehicleScenario).then(function () {
            setTimeout(function () {
                element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehReg)).then(function (elems) {
                    if (elems.length > 0) {
                        callback(new Error('New vehicle is displayed in the table'));
                    } else {
                        callback();
                    }
                });
            }, 3000);
        });
    });

    this.Given(/^I am on the vehicles grid view$/, function (callback) {
        var vehicleCreated = function () {
            configFile.gotoPage('vehicle', callback);
        };
        var vehicle = {vehicle_reg: ScenarioTags.vehicleTags.filterVehicle,
            vehicle_type: ScenarioTags.vehicleTags.filterVehicle,
            vehicle_size: ScenarioTags.vehicleTags.vehicleSize,
//                vehicleTypeLicence : {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass}
        };
        VehicleMother.createByJson(vehicleCreated, vehicle);
    });

    this.When(/^I click on the filter by vehicle reg$/, function (callback) {
        VehicleElements.vehicleRegFilter.click().then(function () {
            callback();
        });
    });

    this.When(/^enter the reg number of the vehicle$/, function (callback) {
        element(protractor.By.xpath("//input[@closeenter='vehicleRegClass']")).sendKeys(ScenarioTags.vehicleTags.filterVehicle).then(function () {
            callback();
        });
    });

    this.Then(/^I can only see the vehicle reg filtered in the table$/, function (callback) {
        element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehReg)).then(function (elems) {
            elems[0].getText().then(function (value) {
                if (value == ScenarioTags.vehicleTags.filterVehicle) {
                    callback();
                } else {
                    callback(new Error("Vehicle registration filter not working"));
                }
            });
        });
    });

    this.When(/^I click on the filter by vehicle type$/, function (callback) {
        VehicleElements.filterVehicleType.click().then(function () {
            callback();
        });
    });

    this.When(/^enter the type of the vehicle$/, function (callback) {
        element(protractor.By.xpath("//input[@closeenter='VehicleType']")).sendKeys(ScenarioTags.vehicleTags.filterVehicle).then(function () {
            callback();
        });
    });

    this.Then(/^I can only see the vehicle type filtered in the table$/, function (callback) {
        element.all(by.repeater(VehicleElements.repeaterVehicleList).column(VehicleElements.columnVehType)).then(function (elems) {
            elems[0].getText().then(function (value) {
                if (value == ScenarioTags.vehicleTags.filterVehicle) {
                    callback();
                } else {
                    callback(new Error("Vehicle type filter not working"));
                }
            });
        });
    });
    var flag = true;
    this.Given(/^there are a number of vehicles in the system$/, function (table, callback) {
        var raws = table.raw();
        var vehicleCreated = function () {
            configFile.gotoPage('vehicle', callback);
        };
        var vehicles = [];
        for (var i = 1; i < raws.length; i++) {
            raws[i][0] = configFile.convertDateTimeFormat(raws[i][0]);
            raws[i][1] = configFile.convertDateTimeFormat(raws[i][1]);
            raws[i][2] = configFile.convertDateTimeFormat(raws[i][2]);
            raws[i][3] = configFile.convertDateTimeFormat(raws[i][3]);
            raws[i][4] = configFile.convertDateTimeFormat(raws[i][4]);
            vehicles.push({vehicle_reg: ScenarioTags.vehicleTags.sortingVehicle, vehicle_type: ScenarioTags.vehicleTags.sortingVehicle, vehicle_size: ScenarioTags.vehicleTags.vehicleSize,
                mot_due: raws[i][0], six_weekly_check: raws[i][1], tacho_check_due: raws[i][2], loler_6_month_check: raws[i][3], loler_12_month_check: raws[i][4]});
        }
        VehicleMother.createListByJson(vehicleCreated, vehicles);
    });

    this.When(/^(.*) column is clicked in vehicle table$/, function (column, callback) {
        VehicleElements.vehicleRegFilter.click().then(function () {
            element(protractor.By.xpath("//input[@closeenter='vehicleRegClass']")).clear();
            element(protractor.By.xpath("//input[@closeenter='vehicleRegClass']")).sendKeys(ScenarioTags.vehicleTags.sortingVehicle).then(function () {
                element(protractor.By.xpath("//th[contains(text(), '" + column + "')]")).click().then(function () {
                    callback();
                }, function (err) {
                    callback(new Error(err));
                });
            });
        });
    });

    this.Then(/^the (.*) is at the top in vehicle table for (.*)$/, function (firstExpectedValue, column, callback) {
        var cellId;
        if (column === 'MOT Due') {
            cellId = 'tblMotDue1';
        } else if (column === '6 Weekly Check') {
            cellId = 'tblSixWeeklyCheck1';
        } else if (column === 'Tacho Check Due') {
            cellId = 'tblTachoCheckDue1';
        } else if (column === 'LOLER 6 Month Check') {
            cellId = 'tblLoler6MonthCheckDue1';
        } else if (column === 'LOLER 12 Month Test') {
            cellId = 'tblLoler12MonthCheckDue1';
        }
        element(by.id(cellId)).getText().then(function (text) {
            if (text === firstExpectedValue) {
                callback();
            } else {
                callback(new Error('No sorting applied for ' + firstExpectedValue));
            }
        });
    });

    this.When(/^the (.*) is clicked again in vehicle table$/, function (column, callback) {
        element(protractor.By.xpath("//th[contains(text(), '" + column + "')]")).click().then(function () {
            callback();
        }, function (err) {
            callback(new Error(err));
        });
    });
    this.Then(/^an "([^"]*)" modal panel is displayed on vehicle page$/, function (arg1, callback) {
        expect(element(protractor.By.xpath("//div[@aria-hidden='false']")).isPresent()).to.eventually.equal(true).then(function () {
            expect(element(protractor.By.xpath("//*[contains(text(),'Edit Vehicle')]")).isPresent()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });

    this.Then(/^I can see Loler due inputs$/, function (callback) {
        Q.all([
            VehicleElements.loler6MonthCheckLabel.isDisplayed(),
            VehicleElements.loler12MonthCheckLabel.isDisplayed()
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^I select no for tail lift$/, function (callback) {
        VehicleElements.noRadio.click().then(function () {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Then(/^I can not see Loler due inputs$/, function (callback) {
        Q.all([
            expect(VehicleElements.loler6MonthCheckLabel.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.loler12MonthCheckLabel.isPresent()).to.eventually.equal(false)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Given(/^I am on the vehicle grid veiw$/, function (callback) {
        configFile.gotoPage('vehicle', callback);
    });

    this.When(/^I click to create a new vehicle$/, function (callback) {
        browser.sleep(1000);
        VehicleElements.btnNewVehicle.click().then(function () {
            callback();
        })
    });

    this.Then(/^I can see all the fields in the modal panel opened$/, function (callback) {
        setTimeout(function () {
            expect(VehicleElements.addVehicleModal.isPresent()).to.eventually.equal(true).then(function () {
                browser.sleep(500);
                Q.all([
                    expect(VehicleElements.textvehicleReg.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textvehicleSize.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textvehicleType.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textcarryingCapacity.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textpalletCapacity.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.yesRadio.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textinternalHeight.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textinternalLength.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textvehicleHeight.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textmotDue.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textsixWeeklyCheck.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.texttachoCheckDue.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.activeNoRadio.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.defectNoRadio.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.textTrackNumber.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.loler6MonthCheckLabel.isPresent()).to.eventually.equal(true),
                    expect(VehicleElements.loler12MonthCheckLabel.isPresent()).to.eventually.equal(true)
                ]).then(function (value) {
                    callback();
                }, function (value) {
                    callback(new Error(value));
                });
            });
        }, 500);
    });

    this.Then(/^vehicle type is defaulted to Rigid$/, function (callback) {
        expect(element(protractor.By.xpath("//div[@id='" + VehicleElements.articChosen + "']//a//span[contains(text(),'Rigid')]")).isPresent()).to.eventually.equal(true).then(function () {
            callback();
        });
    });

    this.When(/^I click to change the value of Vehicle Type$/, function (callback) {
        callback();
    });

    this.Then(/^I can view options for Rigid, Trailer and Unit in the dropdown$/, function (callback) {
        var optionVerified = function (value) {
            if (value) {
                callback();
            } else {
                callback(new Error("Artic are not filled with  options"));
            }
        };
        configFile.verifyChosenOptions(optionVerified, VehicleElements.articChosen, ['Rigid', 'Trailer', 'Unit']);
    });

    this.When(/^I select Trailer option from the dropdown$/, function (callback) {
        var optionSelected = function () {
            callback();
        };
        configFile.selectChosenOption(optionSelected, VehicleElements.articChosen, 'Trailer');
    });

    this.Then(/^I am not able to see some fields in the modal panel$/, function (callback) {
        Q.all([
            expect(VehicleElements.textvehicleReg.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.textvehicleSize.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.texttachoCheckDue.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.activeNoRadio.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.defectNoRadio.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.textTrackNumber.isPresent()).to.eventually.equal(false)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^I change the vehicle type to Unit$/, function (callback) {
        var optionSelected = function () {
            callback();
        };
        configFile.selectChosenOption(optionSelected, VehicleElements.articChosen, 'Unit');
    });


    this.Then(/^all fields are displayed except loler, internal height,int length and pit capacity$/, function (callback) {
        Q.all([
            expect(VehicleElements.loler6MonthCheckLabel.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.loler12MonthCheckLabel.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.textinternalLength.isPresent()).to.eventually.equal(false),
            expect(VehicleElements.textpalletCapacity.isPresent()).to.eventually.equal(false)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Then(/^I can save the vehicle based on the fields displayed$/, function (callback) {
        expect(VehicleElements.btnSaveVehicle.isPresent()).to.eventually.equal(true).then(function () {
            callback();
        }, function () {
            callback(new Error("Save button not displayed"));
        })
    });

    this.Given(/^I am on Vehicle page and adding a new vehicle$/, function (callback) {
        var vehicleDisplayed = function () {
            browser.sleep(1000);
            VehicleElements.btnNewVehicle.click().then(function () {
                callback();
            }, function () {
                callback(new Error('No button exists for Creating new vehicle'));
            });
        };
        configFile.gotoPage("vehicle", vehicleDisplayed);
    });

    this.When(/^I click on checkbox for Temporary Vehicle$/, function (callback) {
        VehicleElements.vehicleTemporarycheckbox.click().then(function () {
            callback();
        })
    });

    this.Then(/^the modal popup should be updated with Registration, Vehicle Size, Tail Lift, Vehicle Type inputs\.$/, function (callback) {
        expect(element(by.xpath("//div//label[contains(text(),'Vehicle Reg')]")).isDisplayed()).to.eventually.equal(true).then(function () {
            expect(element(by.xpath("//div//label[contains(text(),'Vehicle Size')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                expect(element(by.xpath("//div//label[contains(text(),'Vehicle Type')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                    expect(element(by.xpath("//div//label[contains(text(),'Tail Lift')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                        expect(element(by.xpath("//div//label[contains(text(),'Agency Company')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                            expect(element(by.xpath("//div//label[contains(text(),'Internal Length')]")).isPresent()).to.eventually.equal(false).then(function () {
                                expect(element(by.xpath("//div//label[contains(text(),'6 Weekly Check')]")).isPresent()).to.eventually.equal(false).then(function () {
                                    expect(element(by.xpath("//div//label[contains(text(),'Active')]")).isPresent()).to.eventually.equal(false).then(function () {
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
};