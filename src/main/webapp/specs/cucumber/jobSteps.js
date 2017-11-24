var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var JobMother = require("./../object-mothers/jobmother");
var ScenarioTags = require("./../constants/scenariotags");
var JobElements = require("./../constants/jobelements");
var Q = require('q');

var expect = chai.expect;
module.exports = function () {
    var totalRecords;

    this.Given(/^there are (\d+) jobs in the database$/, function (arg1, callback)
    {
        totalRecords = arg1;
        var goToPage = function () {
            configFile.gotoPage('jobs', callback);
        }
        JobMother.createNumberOfJobs(goToPage, ScenarioTags.jobTags.paging, arg1);
    });

    this.Then(/^(\d+) jobs should be displayed$/, function (arg1, callback) {
        JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.paging).then(function () {
            element.all(by.repeater(JobElements.repeaterJobs)).then(function (elems) {
                if (elems.length == arg1) {
                    callback();
                } else {
                    callback(new Error("Expected to be on page with title jobs"));
                }
            });
        });
    });

    this.When(/^I scroll to the bottom of the page, each time the next (\d+) rows should be displayed in Job table$/, function (arg1, callback) {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
            element.all(by.repeater(JobElements.repeaterJobs).column(JobElements.columnVehicleSize)).then(function (elems) {
                if (elems.length >= (Number(arg1) + Number(arg1))) {
                    callback();
                } else {
                    callback(new Error("No jobs available"));
                }
            });
        });
    });

    this.When(/^all the jobs are displayed$/, function (callback) {
        var callbackFn = function () {
            browser.executeScript('window.scrollTo(0,document.body.scrollHeight);').then(function () {
                element.all(by.repeater(JobElements.repeaterJobList).column(JobElements.columnVehicleSize)).then(function (elems) {
                    if (elems.length >= totalRecords) {
                        callback();
                    } else {
                        callbackFn();
                    }
                });
            });
        };
        callbackFn();
    });

    this.Then(/^the text "([^"]*)" should be displayed$/, function (arg1, callback)
    {
        element(by.xpath("//*[contains(text(),'" + arg1 + "')]")).isPresent().then(function (value) {
            if (value == true) {
                callback();
            } else {
                callback(new Error('No text displayed such as ' + arg1));
            }
        }, function () {
            callback(new Error('No text displayed such as ' + arg1));
        });
    });


    this.Given(/^I am on the jobs grid view$/, function (callback) {
        var jobsCreated = function () {
            configFile.gotoPage('jobs', callback);
        };
        JobMother.createNumberOfJobs(jobsCreated, ScenarioTags.jobTags.customerFilter, 1);
    });

    this.When(/^I filter by a customer from one of the jobs$/, function (callback)
    {
        JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.customerFilter).then(function () {
            callback();
        });
    });

    this.Then(/^I can only see the job for the selected customer in the table$/, function (callback) {
        JobElements.customerNameElement.getText().then(function (value) {
            if (value == ScenarioTags.jobTags.customerFilter) {
                callback();
            } else {
                callback(new Error("Jobs are not filtered by customer name"));
            }
        });
    });

    this.When(/^I  filter by a status that appears in one of the jobs$/, function (callback) {
        var optionSelected = function () {
            callback();
        };
        JobElements.filterStatusDropdown.click().then(function () {
            configFile.selectChosenOption(optionSelected, JobElements.filterStatus, JobElements.deliveredStatus);
        });
    });

    this.Then(/^I can only see the job that has the selected status in the table$/, function (callback) {
        JobElements.statusElement.getText().then(function (value) {
            if (value == JobElements.deliveredStatus) {
                callback();
            } else {
                callback(new Error("Jobs are not filtered by status"));
            }
        });
    });
    this.When(/^I click to create a new Job$/, function (callback) {
        var createCollectionList = [];
        var clickNewCust = function () {
            browser.sleep(300);
            JobElements.btnNewJob.click().then(function () {
                callback();
            });
        };
        var createCollection = function () {
            CommonDao.createData(clickNewCust, 'collection_point', createCollectionList);
        }
        var deleteCollection = function () {
            CommonDao.deleteData(createCollection, 'collection_point', {where: {name: ScenarioTags.jobTags.uniqueCustName}});
        }
        var customerCreated = function (data) {
            var customerId = data[0].id;
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName, customer_id: customerId, point_type: 'C'})
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName, customer_id: customerId, point_type: 'D'})
            configFile.gotoPage('jobs', deleteCollection);
        };
        var createCustomer = function () {
            var customers = [{customer_name: ScenarioTags.jobTags.uniqueCustName}];
            CommonDao.createData(customerCreated, 'customer', customers);
        };
        createCustomer();
    });
    this.Then(/^a New Job modal panel is opened$/, function (callback) {
        setTimeout(function () {
            expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                expect(element(by.xpath("//*[contains(text(),'Add Job')]")).isPresent()).to.eventually.equal(true).then(function () {
                    callback();
                });
            });
        }, 1000);
    });
    this.When(/^I fill in all the new job details$/, function (callback) {

        var fillAllDetails = function () {
            Q.all([
                JobElements.txtVehicleSize.click(),
                JobElements.txtVehicleSize.sendKeys(ScenarioTags.jobTags.vehicleSize),
//                JobElements.txtPoId.sendKeys(ScenarioTags.jobTags.poId),
                JobElements.txtVehicleType.click(),
                JobElements.txtVehicleType.sendKeys(ScenarioTags.jobTags.vehicleType),
                JobElements.txtPalletQty.click(),
                JobElements.txtPalletQty.sendKeys(ScenarioTags.jobTags.palletQty),
                JobElements.txtWeight.sendKeys(ScenarioTags.jobTags.weight),
                JobElements.noTailLiftRadio.click(),
                JobElements.txtnoAdrRadio.click(),
                JobElements.txtcollectionDateTime.click(),
                JobElements.txtcollectionDateTime.clear(),
                JobElements.txtcollectionDateTime.sendKeys(ScenarioTags.jobTags.collectionDateTime),
                JobElements.txtdeliveryDateTime.click(),
                JobElements.txtdeliveryDateTime.sendKeys(ScenarioTags.jobTags.deliveryDateTime),
                JobElements.txtpriceQuoted.click(),
                JobElements.txtpriceQuoted.sendKeys(ScenarioTags.jobTags.priceQuoted),
                JobElements.txtcomments.sendKeys(ScenarioTags.jobTags.comments),
                callback()
            ]).then(function (value) {
                callback()
            }, function (value) {
                callback(new Error(value));
            });
        };
        var choseDelviery = function () {
            configFile.selectChosenOption(fillAllDetails, JobElements.deliveryPointChosen, ScenarioTags.jobTags.uniqueCustName);
        }
        var choseCollection = function () {
            configFile.selectChosenOption(choseDelviery, JobElements.collectionPointChosen, ScenarioTags.jobTags.uniqueCustName);
        }
        configFile.selectChosenOption(choseCollection, JobElements.customerChosen, ScenarioTags.jobTags.uniqueCustName);
    });

    this.When(/^click to save the Job$/, function (callback) {
        JobElements.btnSaveJob.click().then(function () {
            callback();
        });
    });

    this.Then(/^the new job is displayed in the table$/, function (callback) {
        element.all(by.repeater(JobElements.repeaterJobList).column(JobElements.columnVehicleSize)).then(function (elems) {
//            elems[0].getText().then(function (value) {
//                if (value == ScenarioTags.jobTags.vehicleSize) {
            callback();
//                }
        });
    });

    this.Given(/^the modal panel to create new Job is open$/, function (callback) {
        var createCollectionList = [];
        var clickNewCust = function () {
            browser.sleep(300);
            JobElements.btnNewJob.click().then(function () {
                setTimeout(function () {
                    expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                        expect(element(by.xpath("//*[contains(text(),'Add Job')]")).isPresent()).to.eventually.equal(true).then(function () {
                            callback();
                        });
                    });
                }, 300);
            });
        };
        var createCollection = function () {
            CommonDao.createData(clickNewCust, 'collection_point', createCollectionList);
        }
        var deleteCollection = function () {
            CommonDao.deleteData(createCollection, 'collection_point', {where: {name: ScenarioTags.jobTags.uniqueCustName}});
        }
        var customerCreated = function (data) {
            var customerId = data[0].id;
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName, customer_id: customerId, point_type: 'C'})
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName, customer_id: customerId, point_type: 'D'})
            configFile.gotoPage('jobs', deleteCollection);
        };
        var createCustomer = function () {
            var customers = [{customer_name: ScenarioTags.jobTags.uniqueCustName}];
            CommonDao.createData(customerCreated, 'customer', customers);
        };
        CommonDao.deleteData(createCustomer, 'customer', {where: {customer_name: ScenarioTags.jobTags.uniqueCustName}});
    });
    this.When(/^I click to cancel the Job creation$/, function (callback) {
        JobElements.btnCancelJob.click().then(function () {
            callback();
        });
    });
    this.Then(/^the new job is not displayed in the table$/, function (callback) {
        JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.uniqueCustName).then(function () {
            element.all(by.repeater(JobElements.repeaterJobList)).then(function (elems) {
                if (elems.length == 0) {
                    callback();
                } else {
                    callback(new Error('job is displayed'));
                }
            });
        });
    });
    this.Given(/^I am on the Jobs page$/, function (callback) {
        var vehicleTypeId;
        var jobsCreated = function () {
            configFile.gotoPage('jobs', callback);
        };
        JobMother.createJobByJson(jobsCreated, {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
            customer: {customer_name: ScenarioTags.jobTags.paging},
            comments: ScenarioTags.jobTags.paging,
            status: 'Delivered'})
    });

    this.When(/^I click to view a job with status delivered$/, function (callback)
    {
        var optionSelected = function () {
            callback();
        };
        JobElements.filterStatusDropdown.click().then(function () {
            configFile.selectChosenOption(optionSelected, JobElements.filterStatus, JobElements.deliveredStatus);
        });
    });

    this.Then(/^the Edit Job modal panel is opened with an 'Invoice sent' button$/, function (callback) {
        element.all(by.repeater(JobElements.repeaterJobs)).then(function (elems) {
            if (elems.length > 0) {
                elems[0].click().then(function () {
                    setTimeout(function () {
                        expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                            expect(element(by.xpath("//*[contains(text(),'Edit Job')]")).isPresent()).to.eventually.equal(true).then(function () {
                                expect(element(by.id("btnInvoiceSent")).isPresent()).to.eventually.equal(true).then(function () {
                                    callback();
                                });
                            });
                        });
                    }, 300);
                });
            } else {
                callback(new Error('job is not displayed'));
            }
        });
    });

    this.When(/^I click to view a job with status other than delivered$/, function (callback) {
        var vehicleTypeId;
        var optionSelected = function () {
            callback();
        };
        var jobsCreated = function () {
            JobElements.filterStatusDropdown.click().then(function () {
                configFile.selectChosenOption(optionSelected, JobElements.filterStatus, 'Quoting');
            });
        };
        var goToPage = function () {
            configFile.gotoPage('jobs', jobsCreated);
        }
        JobMother.createJobByJson(goToPage, {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
            customer: {customer_name: ScenarioTags.jobTags.paging},
            comments: ScenarioTags.jobTags.paging,
            status: 'Quoting', delivery_date_time: '2016-01-16 00:00:00',
            collection_date_time: '2026-01-16 00:00:00'});
    });

    this.Then(/^I cannot see the 'Invoice sent' button on the modal$/, function (callback) {
        element.all(by.repeater(JobElements.repeaterJobs)).then(function (elems) {
            if (elems.length > 0) {
                elems[0].click().then(function () {
                    setTimeout(function () {
                        expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                            expect(element(by.xpath("//*[contains(text(),'Edit Job')]")).isPresent()).to.eventually.equal(true).then(function () {
                                expect(element(by.id("btnInvoiceSent")).isPresent()).to.eventually.equal(false).then(function () {
                                    callback();
                                });
                            });
                        });
                    }, 300);
                });
            } else {
                callback(new Error('job is not displayed'));
            }
        });
    });
    this.Given(/^I am on the job grid view$/, function (callback) {
        var vehicleTypeId;
        var jobsCreated = function () {
            configFile.gotoPage('jobs', callback);
        };
//        var createJobs = function () {
//            var jobs = [];
//            jobs.push({vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, customer_id: customerId, comments: ScenarioTags.jobTags.paging, status: 'Delivered', delivery_date_time: '2016-02-16 00:00:00'});
//            jobs.push({vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, customer_id: customerId, comments: ScenarioTags.jobTags.paging, status: 'New', delivery_date_time: '2016-02-16 00:00:00'});
//            CommonDao.createData(jobsCreated, 'job', jobs);
//        };
//        var vehicleTypesCreated = function (createdData) {
//            if (createdData != null && createdData.length > 0) {
//                vehicleTypeId = createdData[0].id;
//            }
//            configFile.gotoPage('jobs', createJobs);
//        };
//
//        var customerCreated = function (createdData) {
//            if (createdData != null && createdData.length > 0) {
//                customerId = createdData[0].id;
//            }
//            var vehicleTypes = [];
//            vehicleTypes.push({vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType, licence_class: ScenarioTags.vehicleTypeLicenceTags.licenceClass});
//            CommonDao.createData(vehicleTypesCreated, 'vehicle_type_licence', vehicleTypes);
//        };
//        var createCustomer = function () {
//            var customers = [{customer_name: ScenarioTags.jobTags.paging}];
//            CommonDao.createData(customerCreated, 'customer', customers);
//        };
//        createCustomer();

        JobMother.createListByJson(jobsCreated, [{vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                customer: {customer_name: ScenarioTags.jobTags.paging},
                comments: ScenarioTags.jobTags.paging,
                status: 'Delivered', delivery_date_time: '2016-01-16 00:00:00'},
            {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                customer: {customer_name: ScenarioTags.jobTags.paging},
                comments: ScenarioTags.jobTags.paging,
                status: 'New', delivery_date_time: '2016-01-16 00:00:00'}]);
    });

    this.Then(/^I see two special filter buttons, Undelivered and Delivered not Invoiced$/, function (callback) {
        expect(element(by.id("btnUndelivered")).isPresent()).to.eventually.equal(true).then(function () {
            expect(element(by.id("btnNotInvoiced")).isPresent()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });

    this.When(/^I click the Undelivered button$/, function (callback) {
        element(by.id("btnUndelivered")).click().then(function () {
            callback();
        });
    });

    this.Then(/^only jobs that have a status of New or Assigned with and that have a delivery date are visible$/, function (callback) {
        element.all(by.repeater(JobElements.repeaterJobs).column(JobElements.status)).then(function (elems) {
            elems[0].getText().then(function (value) {
                if (value != JobElements.deliveredStatus) {
                    callback();
                }
            });
        });
    });

    this.When(/^I select Delivered not Invoiced button$/, function (callback) {
        element(by.id("btnNotInvoiced")).click().then(function () {
            callback();
        });
    });

    this.Then(/^I can view all jobs that have a status of Delivered that has a delivery date of the previous day or earlier$/, function (callback) {
        element.all(by.repeater(JobElements.repeaterJobs).column(JobElements.status)).then(function (elems) {
            elems[0].getText().then(function (value) {
                if (value == JobElements.deliveredStatus) {
                    callback();
                } else {
                    callback();
                }
            });
        });
    });

    this.Given(/^I have some quotes with quoting status and some with new status$/, function (callback) {
        var clickNewCust = function (data) {
            browser.sleep(300);
            callback();
        };
        JobMother.createListByJson(clickNewCust, [{vehicle_type: null,
                customer: {customer_name: ScenarioTags.jobTags.uniqueCustName + "quoting" + "0"},
                comments: ScenarioTags.jobTags.uniqueCustName,
                status: 'Quoting', delivery_date_time: configFile.convertDateTimeFormat('02/02/2029'),
                collection_date_time: configFile.convertDateTimeFormat('02/02/2029')},
            {vehicle_type: null,
                customer: {customer_name: ScenarioTags.jobTags.uniqueCustName + "new" + "1"},
                comments: ScenarioTags.jobTags.uniqueCustName,
                status: 'New'}]);
    });

    this.When(/^I am on quote page$/, function (callback) {
        configFile.gotoPage('jobs', callback);
    });

    this.Then(/^Accept Quote button is displayed on quotes with quoting status$/, function (callback) {
        JobElements.txtSearchCustomer.clear().then(function () {
            JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.uniqueCustName + "quoting" + "0").then(function () {
                expect(JobElements.acceptQuote1.isPresent()).to.eventually.equal(true).then(function () {
                    callback();
                }, function () {
                    callback(new Error("btn is not displayed"));
                });
            });
        });
    });

    this.Then(/^Accept Quote button is not displayed on quotes with new status$/, function (callback) {
        JobElements.txtSearchCustomer.clear().then(function () {
            JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.uniqueCustName + "new" + "1").then(function () {
                expect(JobElements.acceptQuote1.isPresent()).to.eventually.equal(false).then(function () {
                    callback();
                }, function () {
                    callback.fail("btn is displayed")
                });
            });
        });
    });

    this.Given(/^I am adding or editing a quote$/, function (callback) {
        var createCollectionList = [];
        var clickNewCust = function () {
            browser.sleep(300);
            JobElements.btnNewJob.click().then(function () {
                callback();
            });
        };
        var createCollection = function () {
            CommonDao.createData(clickNewCust, 'collection_point', createCollectionList);
        }
        var deleteCollection = function () {
            CommonDao.deleteData(createCollection, 'collection_point', {where: {name: ScenarioTags.jobTags.uniqueCustName}});
        }
        var customerCreated = function (data) {
            var customerId = data[0].id;
            var customerId1 = data[1].id;
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName, customer_id: customerId, point_type: 'C'})
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName, customer_id: customerId, point_type: 'D'})
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName + "1", customer_id: customerId1, point_type: 'C'})
            createCollectionList.push({name: ScenarioTags.jobTags.uniqueCustName + "1", customer_id: customerId1, point_type: 'D'})
            configFile.gotoPage('jobs', deleteCollection);
        };
        var createCustomer = function () {
            var customers = [{customer_name: ScenarioTags.jobTags.uniqueCustName}, {customer_name: ScenarioTags.jobTags.uniqueCustName + "1"}];
            CommonDao.createData(customerCreated, 'customer', customers);
        };
        createCustomer();
    });

    this.When(/^I click on \+ icon for delivery point$/, function (callback) {
        var clickOnDeliveryPoint = function () {
            JobElements.deliveryPointAddbtn.click().then(function () {
                callback();
            })
        }
        configFile.selectChosenOption(clickOnDeliveryPoint, JobElements.customerChosen, ScenarioTags.jobTags.uniqueCustName);
    });

    this.Then(/^a popup should appear to allow me to add a new delivery point$/, function (callback) {
        setTimeout(function () {
            expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                expect(element(by.xpath("//*[contains(text(),'Add Delivery Point')]")).isPresent()).to.eventually.equal(true).then(function () {
                    callback();
                });
            });
        }, 1000);
    });

    this.When(/^I enter all required fields for delivery point and click save$/, function (callback) {
        JobElements.name.sendKeys("New Name").then(function () {
            JobElements.address.sendKeys("address").then(function () {
                JobElements.town.sendKeys("town").then(function () {
                    JobElements.county.sendKeys("county").then(function () {
                        JobElements.postcode.sendKeys("postcode").then(function () {
                            JobElements.contact.sendKeys("989898989").then(function () {
                                JobElements.telephone.sendKeys("9898989").then(function () {
                                    JobElements.btnSaveCollection.click().then(function () {
                                        callback();
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    });

    this.Then(/^the modal should close and the new delivery point should be pre\-selected on the dropdown$/, function (callback) {
        setTimeout(function () {
            expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                expect(element(by.xpath("//*[contains(text(),'Add Delivery Point')]")).isPresent()).to.eventually.equal(false).then(function () {
                    callback();
                });
            });
        }, 1000);
    });

    this.Then(/^the collection point modal won’t be editable until I’ve selected a company$/, function (callback) {
        JobElements.deliveryPointAddbtn.click().then(function () {
            setTimeout(function () {
                expect(element(by.xpath("//div[@modal-render='true']")).isPresent()).to.eventually.equal(true).then(function () {
                    expect(element(by.xpath("//*[contains(text(),'Add Delivery Point')]")).isPresent()).to.eventually.equal(false).then(function () {
                        callback();
                    });
                });
            }, 1000);
        })
    });

    this.When(/^I select a company$/, function (callback) {

        configFile.selectChosenOption(callback, JobElements.customerChosen, ScenarioTags.jobTags.uniqueCustName);
    });

    this.Then(/^the collection\/delivery points for that company will appear as options in the collection and delivery point dropdowns$/, function (callback) {
        var choseCollection = function () {
            configFile.selectChosenOption(callback, JobElements.collectionPointChosen, ScenarioTags.jobTags.uniqueCustName);
        }
        choseCollection();
    });

    this.Then(/^the collection\/delivery points from other companies won’t be visible$/, function (callback) {
        element(by.id(JobElements.collectionPointChosen)).click().then(function () {
            element(by.xpath("//*[@id='" + JobElements.collectionPointChosen + "']//div//ul//li[contains(text(),'" + ScenarioTags.jobTags.uniqueCustName + "1" + "')]")).click().then(function () {
                callback.fail("elemt is isible");
            }, function () {
                callback();
            });
        })
    });

    this.Then(/^I can see a special filter buttons, Expired Quotes$/, function (callback) {
        expect(JobElements.btnExpiryDate.isPresent()).to.eventually.equal(true).then(function () {
            callback();
        });
    });

    this.When(/^I click the Unaccepted Quotes button$/, function (callback) {
        JobElements.btnExpiryDate.click().then(function () {
            callback();
        });
    });

    this.Then(/^only quotes that have a status of Quoting and that have a delivery date older than (\d+) day ago$/, function (arg1, callback) {
        JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.paging).then(function () {
            expect(JobElements.acceptQuote1.isPresent()).to.eventually.equal(true).then(function () {
                callback();
            });
        });
    });

    this.Given(/^I am on the job grid view for expired quotes$/, function (callback) {
        var vehicleTypeId;
        var jobsCreated = function () {
            configFile.gotoPage('jobs', callback);
        };
        JobMother.createListByJson(jobsCreated, [{vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                customer: {customer_name: ScenarioTags.jobTags.paging},
                comments: ScenarioTags.jobTags.paging,
                status: 'Quoting', delivery_date_time: '2016-01-16 00:00:00',
                collection_date_time: '2016-01-16 00:00:00'},
            {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                customer: {customer_name: ScenarioTags.jobTags.paging},
                comments: ScenarioTags.jobTags.paging,
                status: 'New', delivery_date_time: '2016-01-16 00:00:00'}]);
    });

    this.Given(/^there is a quote on the system that hasn’t been accepted and has a delivery date older than one day ago$/, function (callback) {
        var vehicleTypeId;
        var jobsCreated = function () {
            configFile.gotoPage('jobs', callback);
        };
        JobMother.createListByJson(jobsCreated, [{vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                customer: {customer_name: ScenarioTags.jobTags.paging},
                comments: ScenarioTags.jobTags.paging,
                status: 'Quoting', delivery_date_time: '2016-01-16 00:00:00',
                collection_date_time: '2016-01-26 00:00:00'},
            {vehicle_type: ScenarioTags.vehicleTypeLicenceTags.vehicleType,
                customer: {customer_name: ScenarioTags.jobTags.paging},
                comments: ScenarioTags.jobTags.paging,
                status: 'New', delivery_date_time: '2016-01-16 00:00:00'}]);
    });

    this.Then(/^that quote isn’t visible by default\.$/, function (callback) {
        JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.paging).then(function () {
            expect(JobElements.acceptQuote1.isPresent()).to.eventually.equal(false).then(function () {
                callback();
            });
        });
    });

    this.Then(/^I have to click the Expired Quotes filter to see it$/, function (callback) {
        JobElements.btnExpiryDate.click().then(function () {
            JobElements.txtSearchCustomer.clear().then(function () {
                JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.paging).then(function () {
                    expect(JobElements.acceptQuote1.isPresent()).to.eventually.equal(true).then(function () {
                        callback();
                    });
                });
            });
        })

    });

    this.Given(/^there are a number of jobs in the system$/, function (table, callback) {
        var createJobs = function () {
            var jobsCreated = function () {
                configFile.gotoPage('jobs');
                callback();
            };
            var raws = table.raw();
            var jobs = [];
            for (i = 1; i < raws.length; i++) {
                raws[i][0] = configFile.convertDateTimeFormat(raws[i][0]);
                raws[i][1] = configFile.convertDateTimeFormat(raws[i][1]);
                jobs.push({collection_date_time: raws[i][0], delivery_date_time: raws[i][1]});
            }
            JobMother.createNumberOfJobs(jobsCreated, ScenarioTags.jobTags.job_sort, raws.length - 1, jobs);
        };
        CommonDao.deleteData(createJobs, 'job', {where: {comments: ScenarioTags.jobTags.job_sort}});
    });

    this.When(/^(.*) column is clicked in jobs table$/, function (column, callback) {

        JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.job_sort).then(function () {
            var elementId;
            if (column === 'Collection Date/Time') {
                elementId = JobElements.collectionDateTimeHeader;
            } else if (column === 'Delivery Date/Time') {
                elementId = JobElements.deliveryDateHeader;
            }
            element(by.xpath("(//th[@id='" + elementId + "']//span)[1]")).click().then(function () {
                callback();
            })
        });

    });

    this.Then(/^the (.*) is at the top in jobs table for (.*)$/, function (firstExpectedValue, column, callback) {
        var element;
        if (column === 'Collection Date/Time') {
            element = JobElements.tblCollectionDateTime1;
        } else if (column === 'Delivery Date/Time') {
            element = JobElements.tblDeliveryDateTime1;
        }
        element.getText().then(function (text) {
            if (text.indexOf(firstExpectedValue.trim()) >= 0) {
                callback();
            } else {
                callback(new Error('No sorting applied for ' + firstExpectedValue));
            }
        });
    });

    this.When(/^the (.*) is clicked again in jobs table$/, function (column, callback) {
        var elementId;
        if (column === 'Collection Date/Time') {
            elementId = JobElements.collectionDateTimeHeader;
        } else if (column === 'Delivery Date/Time') {
            elementId = JobElements.deliveryDateHeader;
        }
        element(by.xpath("(//th[@id='" + elementId + "']//span)[1]")).click().then(function () {
            callback();
        })
    });

    this.Given(/^I have some quotes with quoting status and some with new status for unaccept job$/, function (callback) {
        var jobsCreated = function () {
            callback();
        };
        JobMother.createListByJson(jobsCreated, [{vehicle_type: null,
                customer: {customer_name: ScenarioTags.jobTags.unassignJob},
                comments: ScenarioTags.jobTags.unassignJob,
                status: 'Quoting', delivery_date_time: '2030-01-16 00:00:00',
                collection_date_time: '2030-01-16 00:00:00'},
            {vehicle_type: null,
                customer: {customer_name: ScenarioTags.jobTags.unassignJob},
                comments: ScenarioTags.jobTags.unassignJob,
                status: 'New', delivery_date_time: '2030-01-16 00:00:00'}]);
    });

    this.When(/^I am on jobs page$/, function (callback) {
        configFile.gotoPage('jobs', callback);
    });

    this.Then(/^Unaccept Job button is displayed on jobs with new status$/, function (callback) {
        var optionSelected = function () {
            expect(JobElements.unacceptQuote1.isPresent()).to.eventually.equal(true).then(function () {
                callback();
            }, function () {
                callback(new Error("Unaccept btn is not displayed"));
            });
        };
        JobElements.txtSearchCustomer.clear().then(function () {
            JobElements.txtSearchCustomer.sendKeys(ScenarioTags.jobTags.unassignJob).then(function () {
                JobElements.filterStatusDropdown.click().then(function () {
                    configFile.selectChosenOption(optionSelected, JobElements.filterStatus, 'New');
                });

            });
        });
    });

    this.Then(/^Unaccept Job button is not displayed on jobs with quoting status$/, function (callback) {
        var optionSelected = function () {
            expect(JobElements.unacceptQuote1.isPresent()).to.eventually.equal(false).then(function () {
                callback();
            }, function () {
                callback(new Error("Unaccept btn is displayed"));
            });
        };
        JobElements.filterStatusDropdown.click().then(function () {
            configFile.selectChosenOption(optionSelected, JobElements.filterStatus, 'Quoting');
        });

    });


};
