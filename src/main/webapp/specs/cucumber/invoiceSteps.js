var chai = require('chai');
var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var CustomerMother = require("./../object-mothers/customermother");
var JobMother = require("./../object-mothers/jobmother");
var InvoiceMother = require("./../object-mothers/invoicemother");
var ScenarioTags = require("./../constants/scenariotags");
var InvoiceElements = require("./../constants/invoiceelements");
var Q = require('q');

var companyNames = [];
var ptor = browser;
var expect = chai.expect;
module.exports = function () {

    var checkArray = function (idList, text) {
        for (var i = 0; i < idList.length; i++) {
            if (idList[i] === text) {
                return true;
            }
        }
        return false;
    };

    this.Given(/^there is a new menu item 'Invoicing'$/, function (callback) {
        var checkMenuItem = function () {
//            setTimeout(function () {
            expect(InvoiceElements.invoiceMenuItem.isDisplayed()).to.eventually.equal(true).then(function () {
                callback();
            }, function () {
                callback(new Error("menu item is not displayed"));
            });
//            }, 2000)
        }
        configFile.gotoPage(browser.params.homepage, checkMenuItem);
    });

    this.When(/^I click on the menu option 'Invoicing'$/, function (callback) {
        InvoiceElements.invoiceMenuItem.click().then(function () {
            callback();
        }, function () {
            callback(new Error("buttion not clickable."));
        })
    });

    this.Then(/^I am navigated to a new page$/, function (callback) {
        expect(element(by.xpath("//div//span[contains(text(),'Invoices')]")).isPresent()).to.eventually.equal(true).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Then(/^I can see two tabs \- Create & Invoices on the screen$/, function (callback) {
        Q.all([
            expect(InvoiceElements.createTab.isPresent()).to.eventually.equal(true),
            expect(InvoiceElements.invoiceTab.isPresent()).to.eventually.equal(true)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Given(/^I am on the invoicing page with tabs : create, invoice$/, function (callback) {
        var checkMenuItem = function () {
            Q.all([
                expect(InvoiceElements.createTab.isPresent()).to.eventually.equal(true),
                expect(InvoiceElements.invoiceTab.isPresent()).to.eventually.equal(true)
            ]).then(function (value) {
                callback();
            }, function (value) {
                callback(new Error(value));
            });
        }
        var jobsCreated = function () {
            configFile.gotoPage('invoicing', checkMenuItem);
        }
        JobMother.createNumberOfJobs(jobsCreated, ScenarioTags.invoiceTags.invoiceJobs, 10);
    });

    this.When(/^I click on the Create Tab on the invoice page$/, function (callback) {
        InvoiceElements.createTab.click().then(function () {
            callback();
        }, function () {
            callback(new Error("the button is not clickable"));
        })
    });

    this.Then(/^no jobs are displayed on the screen$/, function (callback) {
        element.all(by.repeater(InvoiceElements.repeaterJobList).column(InvoiceElements.columnCustomerName)).then(function (elems) {
            if (elems.length == 0) {
                callback();
            } else {
                callback(new Error("job are displayed"));
            }
        });
    });

    this.When(/^I click to select a company from the dropdown$/, function (callback) {
        configFile.selectChosenOption(callback, InvoiceElements.customerChosen, ScenarioTags.invoiceTags.invoiceJobs);
    });

    this.Then(/^I can view the jobs for that company with checkbox on each row$/, function (callback) {
        setTimeout(function () {
            element.all(by.repeater(InvoiceElements.repeaterJobList).column(InvoiceElements.columnCustomerName)).then(function (elems) {
                if (elems.length > 0) {
                    callback();
                } else {
                    callback(new Error("job are not displayed"));
                }
            });
        }, 2000)
    });

    this.Then(/^an invoice buttion is disabled on the page when no checkbox is clicked$/, function (callback) {
        InvoiceElements.invoiceTab.click().then(function () {
            callback(new Error("buttion not clickable."));
        }, function () {
            callback();
        })
    });

    this.When(/^I click on checkbox to select jobs$/, function (callback) {
        InvoiceElements.jobCheckbox1.click().then(function () {
            callback();
        }, function () {
            callback(new Error("job not available"));
        })
    });

    this.Then(/^count of number of jobs selected is displayed on the top of invoice button$/, function (callback) {
        Q.all([
            expect(element(by.xpath("//div//span[contains(text(),'1')]")).isPresent()).to.eventually.equal(true)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Given(/^I am on the Invoice screen$/, function (callback) {
        var checkMenuItem = function () {
            Q.all([
                expect(element(by.xpath("//div//span[contains(text(),'Invoices')]")).isPresent()).to.eventually.equal(true)
            ]).then(function (value) {
                callback();
            }, function (value) {
                callback(new Error(value));
            });
        }
        var gotoPage = function () {
            setTimeout(function () {
                configFile.gotoPage('invoicing', checkMenuItem);
            }, 4000)
        }
        JobMother.createNumberOfJobs(gotoPage, ScenarioTags.invoiceTags.newInvoice, 10);
    });

    this.When(/^I click on Create tab$/, function (callback) {
        InvoiceElements.createTab.click().then(function () {
            callback();
        })
    });

    this.When(/^I select a company from the list$/, function (callback) {
        configFile.selectChosenOption(callback, InvoiceElements.customerChosen, ScenarioTags.invoiceTags.newInvoice);
    });

    this.Then(/^jobs will be fetched based on the company selected$/, function (callback) {
        element.all(by.repeater(InvoiceElements.repeaterJobList).column(InvoiceElements.columnCustomerName)).then(function (elems) {
            if (elems.length > 0) {
                callback();
            } else {
                callback(new Error("job are displayed"));
            }
        });
    });

    this.Given(/^I am on invoice tab with jobs populated for company$/, function (callback) {
        var selectOption1 = function () {
            configFile.selectChosenOption(callback, InvoiceElements.customerChosen, ScenarioTags.invoiceTags.jobCountInvoice);
        }
        var checkMenuItem = function () {
            Q.all([
                expect(element(by.xpath("//div//span[contains(text(),'Invoices')]")).isPresent()).to.eventually.equal(true)
            ]).then(function (value) {
                selectOption1();
            }, function (value) {
                callback(new Error(value));
            });
        }
        var gotoPage = function () {
            configFile.gotoPage('invoicing', checkMenuItem)
        }
        JobMother.createNumberOfJobs(gotoPage, ScenarioTags.invoiceTags.jobCountInvoice, 10);
    });

    this.When(/^I click to check a job from the list$/, function (callback) {
        InvoiceElements.jobCheckbox1.click().then(function () {
            callback();
        }, function () {
            callback(new Error("job not available"));
        })
    });

    this.Then(/^the count on the invoice button is updated with checked jobs value$/, function (callback) {
        Q.all([
            expect(element(by.xpath("//div//span[contains(text(),'1')]")).isPresent()).to.eventually.equal(true)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^I click on the clear button on the screen$/, function (callback) {
        InvoiceElements.btnClearJobs.click().then(function () {
            callback();
        })
    });

    this.Then(/^the count is updated and invoice button is disabled$/, function (callback) {
        Q.all([
            expect(element(by.xpath("//div//ul//li//span[contains(text(),'1')]")).isPresent()).to.eventually.equal(false)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.Given(/^I am on the Invoice screen for selected jobs$/, function (callback) {
        var checkMenuItem = function () {
            Q.all([
                expect(element(by.xpath("//div//span[contains(text(),'Invoices')]")).isPresent()).to.eventually.equal(true)
            ]).then(function (value) {
                callback();
            }, function (value) {
                callback(new Error(value));
            });
        }
        var gotoPage = function () {
            configFile.gotoPage('invoicing', checkMenuItem);
        }
        JobMother.createNumberOfJobs(gotoPage, ScenarioTags.invoiceTags.selectedJobCounts, 10);
    });

    this.Then(/^I can select a company from the list$/, function (callback) {
        configFile.selectChosenOption(callback, InvoiceElements.customerChosen, ScenarioTags.invoiceTags.selectedJobCounts);
    });

    this.When(/^I select (\d+) jobs from the list$/, function (arg1, callback) {
        InvoiceElements.jobCheckbox1.click().then(function () {
            InvoiceElements.jobCheckbox2.click().then(function () {
                callback();
            }, function () {
                callback(new Error("job not available"));
            })
        }, function () {
            callback(new Error("job not available"));
        })
    });

    this.Then(/^count on Invoice button should be (\d+)$/, function (arg1, callback) {
        Q.all([
            expect(element(by.xpath("//div//span[contains(text(),'" + arg1 + "')]")).isPresent()).to.eventually.equal(true)
        ]).then(function (value) {
            callback();
        }, function (value) {
            callback(new Error(value));
        });
    });

    this.When(/^I click on Invoice button$/, function (callback) {
        InvoiceElements.invoiceTab.click().then(function () {
            callback();
        }, function () {
            callback(new Error("buttion not clickable."));
        })
    });

    this.Then(/^It should open a popup with (\d+) jobs in the table$/, function (arg1, callback) {
        setTimeout(function () {
            expect(element(by.xpath("//*[contains(text(),'Create Invoice')]")).isDisplayed()).to.eventually.equal(true).then(function () {
                callback();
            });
        }, 1500)

    });

    this.When(/^I click on Invoice button to save$/, function (callback) {
        InvoiceElements.btnSaveInvoice.click().then(function () {
            callback();
        })
    });

    this.Then(/^invoices should be displayed in Invoice table$/, function (callback) {
        expect(element(by.xpath("//table//tbody//tr//td//div/p[contains(text(),'" + ScenarioTags.invoiceTags.selectedJobCounts + "')]")).isDisplayed()).to.eventually.equal(true).then(function () {
            callback();
        });
    });

    this.Given(/^I am on the Invoice screen for invoice view$/, function (callback) {
        var checkMenuItem = function () {
            Q.all([
                expect(element(by.xpath("//div//span[contains(text(),'Invoices')]")).isPresent()).to.eventually.equal(true)
            ]).then(function (value) {
                callback();
            }, function (value) {
                callback(new Error(value));
            });
        }
        var gotoPage = function () {
            configFile.gotoPage('invoicing', checkMenuItem);
        }
        InvoiceMother.createInvoices(gotoPage, ScenarioTags.invoiceTags.createdInvoices, 3)
    });

    this.When(/^I click on Invoices tab$/, function (callback) {
        InvoiceElements.btnInvoiceList.click().then(function () {
            callback();
        })
    });

    this.Then(/^table of invoices should be displayed$/, function (callback) {
        expect(element(by.xpath("//table//tbody//tr//td//div/p[contains(text(),'" + ScenarioTags.invoiceTags.createdInvoices + "')]")).isDisplayed()).to.eventually.equal(true).then(function () {
            callback();
        });
    });

    this.Given(/^there are a number of invoices in the system$/, function (table, callback) {
        var raws = table.raw();
        var invoices = [];
        var customers = [];
        for (i = 1; i < raws.length; i++) {
            companyNames.push(raws[i][0]);
            customers.push({customer_name: raws[i][0]});
        }
        var clickInvoiceButton = function () {
            InvoiceElements.btnInvoiceList.click().then(function () {
                callback();
            })
        }
        var invocieCreated = function (data) {
            configFile.gotoPage("invoicing", clickInvoiceButton)
        }
        var customersCreated = function (data) {
            var customerId1 = data[0][0].id;
            var customerId2 = data[1][0].id;
            var customerId3 = data[2][0].id;
            invoices.push({creation_date: raws[1][1], customer_id: customerId1, amount: raws[1][2], total_jobs: 1000, loaded_in_sage: false})
            invoices.push({creation_date: raws[2][1], customer_id: customerId2, amount: raws[2][2], total_jobs: 1000, loaded_in_sage: false})
            invoices.push({creation_date: raws[3][1], customer_id: customerId3, amount: raws[3][2], total_jobs: 1000, loaded_in_sage: false})
            invoices.push({creation_date: raws[4][1], customer_id: customerId2, amount: raws[4][2], total_jobs: 1000, loaded_in_sage: false})
            InvoiceMother.createListByJson(invocieCreated, invoices);
        }
        var createCust = function () {
            CustomerMother.createListByJson(customersCreated, customers);
        }
        CommonDao.deleteData(createCust, 'invoice', {where: {total_jobs: 1000}});
    });

    this.When(/^(.*) column is clicked in invoice table$/, function (column, callback) {
        var clickCOlumn = function () {
            ptor.findElement(protractor.By.xpath("//th//span[contains(text(), '" + column + "')]")).click().then(function () {
                callback();
            }, function (err) {
                callback(new Error(err));
            });
        }
        InvoiceElements.filterCustomer.click().then(function () {
            InvoiceElements.name.sendKeys("Pro-").then(function () {
                clickCOlumn();
            })
        })
    });

    this.Then(/^the (.*) is at the top in invoice  table$/, function (firstExpectedValue, callback) {
        var callbacked = false;
        element.all(by.repeater('invoiceObj in invoice.invoiceList').column('invoiceObj.customerName')).then(function (elems) {
            var j = 0;
            for (var i = 0; i < elems.length; i++) {
                elems[i].getText().then(function (text) {
                    if (checkArray(companyNames, text)) {
                        callbackFn(j, callback);
                    } else {
                        j++;
                    }
                    if (j === elems.length) {
                        callback(new Error());
                        return;
                    }
                });
            }
        }, function (err) {
            callback(new Error(err));
        });

        var callbackFn = function (index, callback) {
            var cellId;
            if (firstExpectedValue === 'Pro-Company 1' || firstExpectedValue === 'Pro-Company 3') {
                cellId = 'tblCustomerName' + (index + 1);
            } else if (firstExpectedValue === '23/12/17 12:00 AM' || firstExpectedValue === '26/12/17 12:00 AM') {
                cellId = 'tblCollectionDateTime' + (index + 1);
            } else if (firstExpectedValue === '1000' || firstExpectedValue === '1600') {
                cellId = 'tblCollectionPostcode' + (index + 1);
            }
            element(by.id(cellId)).getText().then(function (text) {
                if (!callbacked) {
                    if (text === firstExpectedValue) {
                        callbacked = true;
                        setTimeout(function () {
                            callback();

                        }, 1500)
                    } else {
                        callback(new Error('No sorting applied for ' + firstExpectedValue));
                    }
                }
            });
        };
    });

    this.When(/^the (.*) is clicked again in invoice  table$/, function (column, callback) {
        ptor.findElement(protractor.By.xpath("//th//span[contains(text(), '" + column + "')]")).click().then(function () {
            callback();
        }, function (err) {
            callback(new Error(err));
        });
    });
};

