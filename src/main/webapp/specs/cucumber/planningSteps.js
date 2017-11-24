var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var VehicleMother = require("./../object-mothers/vehiclemother");
var JobMother = require("./../object-mothers/jobmother");
var ScenarioTags = require("./../constants/scenariotags");
var PlanningElements = require("./../constants/planningelements");
var Q = require('q');

var expect = chai.expect;
module.exports = function () {
    var totalRecords;
    var vehicleTypeIds = [];
    var vehiclePlan = [];
    var vehiclePlanIds = [];
    var jobsIds = [];
    var staffIds = [];
    var customerId, vehicleTypeId;
    this.Given(/^there are (\d+) vehicle type along with (\d+) vehicles inside it$/, function (arg1, arg2, callback) {
        totalRecords = arg1;
        var vehicleCreated = function () {
            callback();
        };

        var vehicles = [];
        for (var i = 0; i < arg1; i++) {
            vehicles.push({active: true, vehicle_reg: ScenarioTags.vehicleTags.paging + (i + 1),
                vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                vehicle_size: ScenarioTags.vehicleTags.vehicleSize});
        }
        VehicleMother.createListByJson(vehicleCreated, vehicles);
    });

    this.Given(/^I am on the planner page$/, function (callback) {
        var data = function () {
            callback();
        };
        configFile.gotoPage('planning', data);
    });

    this.When(/^I select another vehicle type$/, function (callback) {
        setTimeout(function () {
            PlanningElements.secondHeader.click().then(function () {
                PlanningElements.divSecondVehicleType.click().then(function () {
                    callback();
                }, function () {
                    callback.fail('No vehicle type exists');
                });
            }, function () {
                callback.fail('No vehicle type exists');
            });
        }, 500);
    });

    this.Then(/^the previous list is closed$/, function (callback) {
        callback();
    });

    this.Then(/^new list of vehicles is displayed$/, function (callback) {
        element.all(by.repeater(PlanningElements.vehicleList).column(PlanningElements.vehicleSizeCol)).then(function (elems) {
            callback();
        });
    });

    this.Given(/^I am on the planner screen$/, function (callback) {
        var data = function () {
            callback();
        };
        configFile.gotoPage('planning', data);
    });

    this.When(/^I click on a vehicle from the vehicle type table$/, function (callback) {
        var vehiclePlanCreated = function () {
            browser.refresh();
            configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForViewJob));
            element(protractor.By.xpath("//i[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
                element(protractor.By.xpath("//a[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
                    callback();
                }, function () {
                    callback(new Error('No vehicle row exists'));
                });
            }, function () {
                callback(new Error('No vehicle type exists'));
            });
        };
        JobMother.createJobByVehiclePlan(vehiclePlanCreated, {vehicle_type: configFile.vehicleTypePrefix + '1',
            customer_id: configFile.customerNameIdMap[configFile.customerPrefix + '1'], comments: ScenarioTags.planningTags.jobsForVehicle,
            collection_date_time: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForViewJob),
            delivery_point_id: null, collection_point_id: null, weight: 10, price_quoted: 10,
            status: 'New', vehicle_plan: {vehicle_id: configFile.vehicleNameIdMap[configFile.vehiclePrefix + '1'], plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForViewJob), staff_id: null}});
    });

    this.Then(/^the vehicle type table is replaced with the vehicle view: a table of jobs for the selected vehicle\.$/, function (callback) {
        expect(PlanningElements.vehicleContentTable.isDisplayed()).to.eventually.equal(true).then(function () {
            callback();
        });
    });

    this.Given(/^I am viewing the jobs of a specific vehicle on the planner screen$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                PlanningElements.firstHeader.click().then(function () {
                    PlanningElements.tblPlanningRow.click().then(function () {
                        element.all(by.repeater(PlanningElements.vehicleContentList).column(PlanningElements.repeaterCotentCol)).then(function (elems) {
                            callback();
                        });
                    }, function () {
                        callback.fail('No vehicle row exists');
                    });
                }, function () {
                    callback.fail('No vehicle type exists');
                });
            }, 500);
        };
        configFile.gotoPage('planning', data);
    });

    this.When(/^i click on the back button$/, function (callback) {
        setTimeout(function () {
            PlanningElements.btnBackForPlanning.click().then(function () {
                callback();
            }, function () {
                callback.fail('No vehicle row exists');
            });
        }, 500);
    });

    this.Then(/^I return to the vehicle type list that was open before I clicked to view a specific vehicle$/, function (callback) {
        element.all(by.repeater(PlanningElements.vehicleList).column(PlanningElements.vehicleSizeCol)).then(function (elems) {
            callback();
        });
    });
    this.Given(/^I am on the planner page screen$/, function (callback) {
        var jobsCreated = function () {
            callback();
        };
        var createJobs = function () {
            JobMother.createJobByJson(jobsCreated, {vehicle_type: configFile.vehicleTypePrefix + '1',
                customer_id: configFile.customerNameIdMap[configFile.customerPrefix + '1'], comments: ScenarioTags.jobTags.default_comment,
                collection_date_time: '2019-02-02 06:58:01',
                status: 'New'})
        };
        configFile.gotoPage('planner', createJobs);
    });

    this.Then(/^the table of jobs is displayed ready to be assigned to the vehicles$/, function (callback) {
        var jobsDisplayed = function () {
            configFile.selectDate(PlanningElements.txtSearchJobs, 'Thursday, 02 Feb,2019');
            element(protractor.By.xpath("//a[@aria-controls='jobs']")).click().then(function () {
                element.all(by.repeater(PlanningElements.repeaterJobList).column(PlanningElements.columnCollectionDateTime)).then(function (elems) {
                    if (elems.length > 0) {
                        callback();
                    } else {
                        callback(new Error(' jobs are not displayed'));
                    }
                });

            });
        };

        jobsDisplayed();
    });

    this.Then(/^only jobs with a status of New and with collection date\/delivery date that is the same as the selected date are displayed$/, function (callback) {
        element(protractor.By.xpath("//a[@aria-controls='jobs']")).click().then(function () {
            element.all(by.repeater(PlanningElements.repeaterJobList).column(PlanningElements.columnCollectionDateTime)).then(function (elems) {
                if (elems.length > 0) {
                    elems[0].getText().then(function (value) {
                        if (value == '02/02/2019 06:58 AM') {
                            callback();
                        }
                    });
                } else {
                    callback(new Error('jobs are not displayed'));
                }
            });
        });
    });
    this.When(/^I click on next button$/, function (callback) {
        PlanningElements.btnNextDay.click().then(function () {
            callback();
        });
    });

    this.Then(/^I can view the vehicle details for the next day$/, function (callback) {
        element.all(by.repeater(PlanningElements.vehicleList).column(PlanningElements.vehicleSizeCol)).then(function (elems) {
            callback();
        });
    });

    this.When(/^I can on previous button$/, function (callback) {
        PlanningElements.btnPreviousDay.click().then(function () {
            callback();
        });
    });

    this.Then(/^I can view the vehicle details for the previous day$/, function (callback) {
        element.all(by.repeater(PlanningElements.vehicleList).column(PlanningElements.vehicleSizeCol)).then(function (elems) {
            callback();
        });
    });

    this.When(/^I click on Calendar to select a particular date$/, function (callback) {
        var planCreated = function () {
            configFile.selectDate(PlanningElements.txtSearchJobs, 'Thursday, 02 Feb,2017');
            callback();
        };
        var createPlan = function (createdVehicle) {
            var vehiclePlan = [];
            vehiclePlan.push({vehicle_id: createdVehicle[0].id, plan_date: '2017-02-02'});
            CommonDao.createData(planCreated, 'vehicle_plan', vehiclePlan);
        };
        var createVehicles = function () {
            var vehicles = [];
            vehicles.push({vehicle_reg: ScenarioTags.vehicleTags.paging, vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, vehicle_size: ScenarioTags.vehicleTags.vehicleSize});
            CommonDao.createData(createPlan, 'vehicle', vehicles);
        };

        var vehicleTypesCreated = function (createdData) {
            if (createdData != null && createdData.length > 0) {
                for (var i = 0; i < createdData.length; i++) {
                    vehicleTypeIds.push(createdData[i].id);
                }
            }
            createVehicles();
        };

        createVehicleTypes = function () {
            var vehicleTypes = [];
            vehicleTypes.push({vehicle_size: ScenarioTags.vehicleTypeLicenceTags.vehicleType, licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass});
            CommonDao.createData(vehicleTypesCreated, 'licence_type', vehicleTypes);
        };
        createVehicleTypes();

    });

    this.Then(/^I can view the vehicle details for that date in the planner$/, function (callback) {
        element(by.id('vehicleType1')).click().then(function () {
            element.all(by.repeater(PlanningElements.vehicleTypeList)).then(function (elems) {
                for (var i = 0; i < elems.length; i++) {
                    var id = 'vehicleType' + (i + 1);
                    element(by.id(id)).getText().then(function (value) {
                        callback();
//                        if(value== ScenarioTags.vehicleTypeLicenceTags.vehicleType){
//                            element(by.id(id)).click().then(function(){
//                                element.all(by.repeater(PlanningElements.vehicleList)).then(function (elems) {
//                                    if (elems.length > 0) {
//                                        callback();
//                                    } else {
//                                        callback(new Error('Vehicles are not displayed'));
//                                    }
//                                });
//                            });
//                        }
                    });
                }
            });
        });
    });

    this.Given(/^I am on the planner page and I have a driver assigned for a day$/, function (callback) {

        var goToPlanningPage = function () {
            configFile.gotoPage('planning', callback);
        }
        var vehiclePlans = [{vehicle_id: configFile.vehicleNameIdMap[configFile.vehiclePrefix + '3'], staff_id: configFile.driverNameIdMap[configFile.driverPrefix + '3'], plan_date: '2017-02-02'}];
        CommonDao.createData(goToPlanningPage, 'vehicle_plan', vehiclePlans);

    });

    this.Then(/^I can see the table of drivers ready to be assigned to the vehicles$/, function (callback) {
        configFile.selectDate(PlanningElements.txtSearchJobs, 'Thursday, 02 Feb,2017');
        PlanningElements.tabDrivers.click().click().then(function () {
            PlanningElements.filterDriverName.click().then(function () {
                PlanningElements.searchDriverName.sendKeys(configFile.driverPrefix).then(function () {
                    PlanningElements.filterDriverName.click().then(function () {
                        callback();
                    });
                })
            });

        });
    });

    this.Then(/^only drivers that are not assigned to a vehicle for the selected date are displayed$/, function (callback) {
        element.all(by.repeater(PlanningElements.driverList).column(PlanningElements.driverName)).then(function (elems) {
            if (elems.length > 0) {
                if (elems.length === 2)
                    callback();
            } else {
                callback(new Error('Drivers are not displayed'));
            }
        });
    });

    this.Given(/^you are viewing the vehicle load page$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                PlanningElements.firstHeader.click().then(function () {
                    PlanningElements.tblPlanningRow.click().then(function () {
                        element.all(by.repeater(PlanningElements.vehicleContentList).column(PlanningElements.repeaterCotentCol)).then(function (elems) {
                            callback();
                        });
                    }, function () {
                        callback.fail('No vehicle row exists');
                    });
                }, function () {
                    callback.fail('No vehicle type exists');
                });
            }, 500);
        };
        configFile.gotoPage('planning', data);
    });

    this.When(/^you change the date$/, function (callback) {
        PlanningElements.btnNextDay.click().then(function () {
            callback();
        });
    });

    this.Then(/^the vehicle load table should update to show the list of jobs allocated to the vehicle for that day$/, function (callback) {
        element.all(by.repeater(PlanningElements.vehicleContentList).column(PlanningElements.repeaterCotentCol)).then(function (elems) {
            callback();
        });
    });

    this.When(/^a vehicle has too much weight assigned$/, function (callback) {

        var data = function () {
            callback();
        };
        var createJobs = function () {
            var jobs = [];
            jobs.push({weight: 110, pallet_qty: 110, price_jobd: 100, vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, customer_id: customerId, comments: ScenarioTags.jobTags.paging, status: 'New', collection_date_time: '2016-02-01 00:00:00', vehicle_plan_id: vehiclePlanIds[0]});
            jobs.push({weight: 95, pallet_qty: 95, price_jobd: 100, vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, customer_id: customerId, comments: ScenarioTags.jobTags.paging, status: 'New', collection_date_time: '2016-02-01 00:00:00', vehicle_plan_id: vehiclePlanIds[1]});
            jobs.push({weight: 20, pallet_qty: 20, price_jobd: 100, vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, customer_id: customerId, comments: ScenarioTags.jobTags.paging, status: 'New', collection_date_time: '2016-02-01 00:00:00', vehicle_plan_id: vehiclePlanIds[2]});
            CommonDao.createData(data, 'job', jobs);
        };

        var customerCreated = function (createdData) {
            if (createdData != null && createdData.length > 0) {
                customerId = createdData[0].id;
            }
            createJobs();
        };
        var createCustomer = function () {
            var customers = [{customer_name: ScenarioTags.customerTags.customerNames}];
            CommonDao.createData(customerCreated, 'customer', customers);
        };
        var vehiclePlansCreated = function (createdData) {
            if (createdData != null && createdData.length > 0) {
                for (var i = 0; i < createdData.length; i++) {
                    vehiclePlanIds.push(createdData[i].id);
                }
            }
            createCustomer();
        };
        var createPlan = function (createdVehicle) {
            for (var i = 0; i < 3; i++) {
                vehiclePlan.push({vehicle_id: createdVehicle[i].id, plan_date: '2016-02-02', staff_id: staffIds[i]});
            }
            CommonDao.createData(vehiclePlansCreated, 'vehicle_plan', vehiclePlan);
        };

        var createVehicles = function () {
            var vehicles = [];
            for (var i = 0; i < 3; i++) {
                vehicles.push({active: true, vehicle_reg: ScenarioTags.vehicleTags.paging + (i + 1), vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, vehicle_size: ScenarioTags.vehicleTags.vehicleSize, carrying_capacity: 100, pallet_capacity: 100});
            }
            CommonDao.createData(createPlan, 'vehicle', vehicles);
        };

        var vehicleTypesCreated = function (createdData) {
            if (createdData != null && createdData.length > 0) {
                for (var i = 0; i < createdData.length; i++) {
                    vehicleTypeIds.push(createdData[i].id);
                }
            }
            createVehicles();
        };

        createVehicleTypes = function () {
            var vehicleTypes = [];
            vehicleTypes.push({vehicle_size: ScenarioTags.vehicleTypeLicenceTags.vehicleType, licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass});
            CommonDao.createData(vehicleTypesCreated, 'licence_type', vehicleTypes);
        };

        var staffCreated = function (createdData) {
            if (createdData != null && createdData.length > 0) {
                for (var i = 0; i < createdData.length; i++) {
                    staffIds.push(createdData[i].id);
                }
            }
            createVehicleTypes();
        };
        var createStaff = function () {
            var staffs = [];
            for (var i = 0; i < 3; i++) {
                if (i == 0) {
                    staffs.push({driver_name: ScenarioTags.staffTags.paging + (i + 1)});
                } else if (i == 1) {
                    staffs.push({driver_name: ScenarioTags.staffTags.paging + (i + 1), licence_class: "ProtractLicence"});
                } else {
                    staffs.push({driver_name: ScenarioTags.staffTags.paging + (i + 1), licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass});
                }

            }
            CommonDao.createData(staffCreated, 'staff', staffs);
        };
        configFile.gotoPage('planning', createStaff);
    });

    this.Then(/^a Red traffic light is displayed and the hover message describes the issue$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.loadImage1).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle is close to the weight limit$/, function (callback) {
        callback();
    });

    this.Then(/^an Amber traffic light is displayed and the hover message describes the issue$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.loadImage2).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle has too little weight assigned$/, function (callback) {
        callback();
    });

    this.Then(/^a Green traffic light is displayed and the hover message describes the issue$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.loadImage3).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle has too many pallets assigned$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.loadImage1).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle is close to the pallet limit$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.loadImage2).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle has too little pallets assigned$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.loadImage3).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle does not have a driver associated$/, function (callback) {
        callback();
    });

    this.Then(/^the vehicle is displayed with a grey highlight$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.driverGreyImage).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^an under\-qualified driver is assigned$/, function (callback) {
        callback();
    });

    this.Then(/^the vehicle is displayed with a red highlight$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.driverRedImage).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^a vehicle has a correctly qualified driver assigned$/, function (callback) {
        callback();
    });

    this.Then(/^the vehicle is displayed with a green highlight$/, function (callback) {
        var data = function () {
            setTimeout(function () {
                browser.actions().mouseMove(PlanningElements.driverGreenImage).perform();
                callback();
            }, 500);
        };
        data();
    });

    this.When(/^I click to filter the drivers table by Driver name$/, function (callback) {
        PlanningElements.tabDrivers.click().then(function () {
            PlanningElements.filterDriverName.click().then(function () {
                PlanningElements.searchDriverName.sendKeys(configFile.driverPrefix).then(function () {
                    PlanningElements.filterDriverName.click().then(function () {
                        callback();
                    });
                })
            })
        });
    });

    this.Then(/^the table is filtered to only show the drivers with that name$/, function (callback) {
        element.all(by.repeater(PlanningElements.driverList).column(PlanningElements.driverName)).then(function (elems) {
            if (elems.length > 0) {
                var promises = [];
                for (var i = 0; i < elems.length; i++) {
                    promises.push(elems[i].getText());
                }
                var wrongData = false;
                Q.all(promises).done(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].indexOf(configFile.driverPrefix) < 0) {
                            wrongData = true;
                            break;
                        }
                    }
                    if (wrongData) {
                        callback(new Error('Table is not filtered based on driver name'));
                    } else {
                        callback();
                    }
                });
            } else {
                callback(new Error('Drivers are not displayed'));
            }
        });
    });

    this.When(/^I click to filter the drivers table by License Class$/, function (callback) {
        PlanningElements.tabDrivers.click().click().then(function () {
            PlanningElements.filterDriverName.click().then(function () {
                PlanningElements.searchDriverName.sendKeys("").then(function () {
                    PlanningElements.filterLicenceClass.click().then(function () {
                        PlanningElements.searchLicenceClass.sendKeys(configFile.driverPrefix).then(function () {
                            PlanningElements.filterLicenceClass.click().then(function () {
                                callback();
                            });
                        })
                    });
                })
            })
        });
    });

    this.Then(/^the table is filtered to only show the drivers with that license class$/, function (callback) {
        element.all(by.repeater(PlanningElements.driverList).column(PlanningElements.licenceClass)).then(function (elems) {
            if (elems.length > 0) {
                var promises = [];
                for (var i = 0; i < elems.length; i++) {
                    promises.push(elems[i].getText());
                }
                var wrongData = false;
                Q.all(promises).done(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].indexOf(configFile.driverPrefix) < 0) {
                            wrongData = true;
                            break;
                        }
                    }
                    if (wrongData) {
                        callback(new Error('Table is not filtered based on licence class'));
                    } else {
                        callback();
                    }
                });
            } else {
                callback(new Error('Drivers are not displayed'));
            }
        });
    });

    this.Given(/^I am on the vehicle load table$/, function (callback) {
        configFile.gotoPage('planning', callback);
    });

    this.Given(/^there is a job that needs to be changed$/, function (callback) {
        var vehiclePlanCreated = function () {
            browser.refresh();
            callback();
        };
        JobMother.createJobByVehiclePlan(vehiclePlanCreated, {vehicle_type: configFile.vehicleTypePrefix + '1',
            customer_id: configFile.customerNameIdMap[configFile.customerPrefix + '1'], comments: ScenarioTags.jobTags.planning_edit_job,
            collection_date_time: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob),
            delivery_point_id: null, collection_point_id: null, weight: 10, price_quoted: 10,
            status: 'New', vehicle_plan: {vehicle_id: configFile.vehicleNameIdMap[configFile.vehiclePrefix + '1'], plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob), staff_id: null}});
    });

    this.When(/^I click on job on vehicle load table$/, function (callback) {
        configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob));
        element(protractor.By.xpath("//i[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
            element(protractor.By.xpath("//a[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
                PlanningElements.tblCustomerName.click().then(function () {
                    callback();
                });
            });
        });
    });

    this.Then(/^the edit job modal will appear$/, function (callback) {
        browser.sleep(300);
        expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
            callback();
        }, function (value) {
            callback(new Error('Job modal is not displayed'));
        });
    });
    this.Given(/^a driver has been assigned to a vehicle for a day$/, function (callback) {
        var vehiclePlanCreated = function () {
            callback();
        };
        JobMother.createJobByVehiclePlan(vehiclePlanCreated, {vehicle_type: configFile.vehicleTypePrefix + '1',
            customer_id: configFile.customerNameIdMap[configFile.customerPrefix + '1'], comments: ScenarioTags.planningTags.unAssignDriver,
            collection_date_time: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob),
            delivery_point_id: null, collection_point_id: null, weight: 10, price_quoted: 10,
            status: 'New', vehicle_plan: {vehicle_id: configFile.vehicleNameIdMap[configFile.vehiclePrefix + '1'], plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob), staff_id: configFile.driverNameIdMap[configFile.driverPrefix + '1']}});
    });

    this.When(/^I click the X button next to the drivers name on vehicle summary table$/, function (callback) {
        configFile.gotoPage('planning');
        configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob));
        element(protractor.By.xpath("//i[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
            element(protractor.By.xpath("//a[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
                PlanningElements.unassignDriver.click().then(function () {
                    callback();
                });
            });
        });
    });

    this.Then(/^the driver should be removed from the vehicle$/, function (callback) {
        PlanningElements.btnBackForPlanning.click().then(function () {
            PlanningElements.tblDriverName.getText().then(function (text) {
                if (text == null || text == '') {
                    callback();
                } else {
                    callback(new Error('Driver is not removed from the vehcle'));
                }
            })
        });
    });

    this.Then(/^this driver should be displayed in driver tab again ready to assign to a different vehicle$/, function (callback) {
        PlanningElements.tabDrivers.click().click().then(function () {
            element(protractor.By.xpath("//table[@id='" + PlanningElements.driverTableId + "']//p[text()='" + configFile.driverPrefix + '1' + "']")).isDisplayed().then(function (value) {
                if (value) {
                    callback();
                } else {
                    callback(new Error('Driver is not displayed in driver tab'));
                }
            });
        });
    });

    this.Given(/^I am on planner page and a job has been assigned to a vehicle for a day$/, function (callback) {
        var vehiclePlanCreated = function () {
            configFile.gotoPage('planning', callback);
        };
        JobMother.createJobByVehiclePlan(vehiclePlanCreated, {vehicle_type: configFile.vehicleTypePrefix + '1',
            customer_id: configFile.customerNameIdMap[configFile.customerPrefix + '1'], comments: ScenarioTags.planningTags.unAssignJob,
            collection_date_time: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnassignJob),
            weight: 10, price_quoted: 10,
            status: 'New', vehicle_plan: {vehicle_id: configFile.vehicleNameIdMap[configFile.vehiclePrefix + '1'], plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnassignJob), staff_id: null}});
    });

    this.When(/^I click the X button at the end of row on vehicle load table$/, function (callback) {
        configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnassignJob));
        element(protractor.By.xpath("//i[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
            element(protractor.By.xpath("//a[@id='" + configFile.vehiclePrefix + '1' + "']")).click().then(function () {
                PlanningElements.unassignJob.click().then(function () {
                    callback();
                });
            });
        });
    });

    this.Then(/^the job should be removed from the vehicle load table$/, function (callback) {
        element.all(by.repeater(PlanningElements.vehicleContentList).column(PlanningElements.repeaterCotentCol)).then(function (elems) {
            if (elems.length == 0) {
                callback();
            } else {
                callback(new Error('job is not removed from the vehicle load table'));
            }
        });
    });

    this.Then(/^this job should be displayed in job tab again ready to assign to a different vehicle$/, function (callback) {
        PlanningElements.tblCustomerName.isDisplayed().then(function (value) {
            if (value) {
                PlanningElements.tblCustomerName.getText().then(function (textValue) {
                    if (textValue == configFile.customerPrefix + '1') {
                        callback();
                    } else {
                        callback(new Error('job is not available for different vehicle'));
                    }
                });
            } else {
                callback(new Error('job is not available for different vehicle'));
            }
        })
    });
    this.Given(/^I have rigid, unit and trailer vehicles for same vehicle type$/, function (callback) {
        var vehicleCreated = function () {
            callback();
        };

        var vehicles = [];
        var vehicleArticsTags = [ScenarioTags.vehicleTags.unitVehicle, ScenarioTags.vehicleTags.trailerVehicle, ScenarioTags.vehicleTags.rigidVehicle];
        var artics = ["Unit", "Trailer", "Rigid"];
        for (var i = 0; i < vehicleArticsTags.length; i++) {
            vehicles.push({active: true, vehicle_reg: vehicleArticsTags[i], vehicle_size: '22',
                vehicle_type: ScenarioTags.vehicleTags.articVehicles, artic: artics[i]});
        }
        VehicleMother.createListByJson(vehicleCreated, vehicles);
    });

    this.When(/^I am on planner page$/, function (callback) {
        configFile.gotoPage('planning', callback);
    });

    this.When(/^Click to check artic of vehicle$/, function (callback) {
        element(protractor.By.xpath("//i[@id='" + ScenarioTags.vehicleTags.articVehicles + "']")).getAttribute('class').then(function (value) {
            if (value.indexOf("fa-minus-circle") < 0) {
                element(protractor.By.xpath("//i[@id='" + ScenarioTags.vehicleTags.articVehicles + "']")).click().then(function () {
                    callback();
                });
            } else {
                callback();
            }
        });
    });

    this.Then(/^I can see only rigid and trailer$/, function (callback) {

        expect(element(by.xpath("//div[@aria-expanded='true']//td//a[text()='" + ScenarioTags.vehicleTags.unitVehicle + "']")).isPresent()).to.eventually.equal(false).then(function () {
            Q.all([
                expect(element(by.xpath("//div[@aria-expanded='true']//td//a[text()='" + ScenarioTags.vehicleTags.rigidVehicle + "']")).isPresent()).to.eventually.equal(true),
                expect(element(by.xpath("//div[@aria-expanded='true']//td//a[text()='" + ScenarioTags.vehicleTags.trailerVehicle + "']")).isPresent()).to.eventually.equal(true)]).then(function (value) {
                callback();
            }, function (value) {
                callback(new Error("Rigid or trailer vehicle is not displayed."));
            });
        }, function (value) {
            callback(new Error('Unit vehicle is displayed'));
        });

    });

    this.Given(/^I am on a planning screen$/, function (callback) {
        var vehicleCreated = function () {
            configFile.gotoPage('planning', callback);
        };
        var vehicles = [];
        vehicles.push({active: true, vehicle_reg: ScenarioTags.vehicleTags.unitTabVehicle, vehicle_size: '22',
            vehicle_type: ScenarioTags.vehicleTags.unitTabVehicle, artic: 'Unit'});
        VehicleMother.createListByJson(vehicleCreated, vehicles);
    });

    this.When(/^I click on Units tab$/, function (callback) {
        PlanningElements.unitTab.click().then(function () {
            callback();
        });
    });

    this.Then(/^I can see vehicles which has unit artic$/, function (callback) {
        PlanningElements.vehicleRegFilter.click().then(function () {
            element(protractor.By.xpath("//input[@closeenter='" + PlanningElements.vehicleRegClass + "']")).clear();
            element(protractor.By.xpath("//input[@closeenter='" + PlanningElements.vehicleRegClass + "']")).sendKeys(ScenarioTags.vehicleTags.unitTabVehicle).then(function () {
                element(protractor.By.xpath("//input[@closeenter='" + PlanningElements.vehicleRegClass + "']")).sendKeys('', protractor.Key.TAB).then(function () {
                    PlanningElements.unitVehicle1.getText().then(function (value) {
                        if (value == ScenarioTags.vehicleTags.unitTabVehicle) {
                            callback();
                        } else {
                            callback(new Error('Unit vehicle is not displayed'));
                        }
                    })
                });
            });
        });
    });
    this.Given(/^a unit has been assigned to a vehicle for a day$/, function (callback) {
        var planningPageDisplayed = function () {
            configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnit));
            element(protractor.By.xpath("//i[@id='" + ScenarioTags.planningTags.unAssignUnit + "']")).click().then(function () {
                browser.sleep(2000);
                callback();
            });
        };
        var vehiclePlanCreated = function () {
            configFile.gotoPage('planning', planningPageDisplayed);
        };
        VehicleMother.createVehicleWithVehiclePlanForUnits(vehiclePlanCreated, {active: true, vehicle_reg: ScenarioTags.planningTags.unAssignUnit,
            vehicle_type: ScenarioTags.planningTags.unAssignUnit,
            vehicle_size: ScenarioTags.planningTags.unAssignUnit,
            unit: {vehicle_reg: ScenarioTags.planningTags.unAssignUnit, artic: 'Unit', active: true, vehicle_size: '22', vehicle_type: 'type'},
            vehiclePlan: {plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnit)}});
    });

    this.When(/^I click the X button next to the unit's name on vehicle summary table$/, function (callback) {
        element(by.xpath("//div[@aria-expanded='true']//td//i[@id='" + PlanningElements.unassignUnitPlanningTable1 + "']")).click().then(function () {
            callback();
        });
    });

    this.Then(/^the unit should be removed from the vehicle$/, function (callback) {
        element(by.xpath("//div[@aria-expanded='true']//td//span[@id='" + PlanningElements.tblVehUnitName1 + "']")).getText().then(function (value) {
            if (value == null || value == '') {
                callback();
            } else {
                callback(new Error('Unit is not unassigned'));
            }
        });
    });

    this.Then(/^this unit should be displayed in unit tab again ready to assign to a different vehicle$/, function (callback) {
        PlanningElements.vehicleRegFilter.click().then(function () {
            element(protractor.By.xpath("//input[@closeenter='" + PlanningElements.vehicleRegClass + "']")).clear();
            element(protractor.By.xpath("//input[@closeenter='" + PlanningElements.vehicleRegClass + "']")).sendKeys(ScenarioTags.planningTags.unAssignUnit).then(function () {
                element(protractor.By.xpath("//input[@closeenter='" + PlanningElements.vehicleRegClass + "']")).sendKeys('', protractor.Key.TAB).then(function () {
                    PlanningElements.unitVehicle1.getText().then(function (value) {
                        if (value == ScenarioTags.planningTags.unAssignUnit) {
                            callback();
                        } else {
                            callback(new Error('Unit vehicle is not displayed'));
                        }
                    })
                });
            });
        });
    });

    this.Given(/^there is a Trailer which does not have unit assigned$/, function (callback) {

        VehicleMother.createVehicleWithVehiclePlanForUnits(callback, {active: true, vehicle_reg: ScenarioTags.planningTags.unAssignUnit,
            vehicle_type: ScenarioTags.planningTags.planWithNoUnit,
            vehicle_size: ScenarioTags.planningTags.planWithNoUnit,
            artic: 'Trailer',
            vehiclePlan: {plan_date: configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnit)}});
    });
    this.When(/^I go to planning screen$/, function (callback) {
        var planningPageDisplayed = function () {
            configFile.selectDate(PlanningElements.txtSearchJobs, configFile.convertDateToFullDateFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnit));
            element(protractor.By.xpath("//i[@id='" + ScenarioTags.planningTags.planWithNoUnit + "']")).click().then(function () {
                browser.sleep(4000);
                callback();
            });
        };
        configFile.gotoPage('planning', planningPageDisplayed);
    });

    this.Then(/^I can see red traffic for the trailer$/, function (callback) {
        browser.actions().
                mouseMove(element(protractor.By.xpath("//div[@aria-expanded='true']//img[@src='images/red-light.png']"))).
                perform();
        element(protractor.By.xpath("//*[contains(text(), 'No Unit Allocated')]")).isPresent().then(function(){
            callback();
        });
    });

};
