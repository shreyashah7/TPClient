(function () {
    var InvoiceController = function (CustomerDao, $uibModal, JobDao, InvoiceDao, $filter) {
        var ctrl = this;
        ctrl.activeView = "Create";
        ctrl.jobsNotSelected = true;
        ctrl.jobCount = 0;
        ctrl.invoiceList = [];
        ctrl.orderColumn = {};
        ctrl.orderColumn1 = {};
        var jobListForInvoice = [];
        var jobCheckedMap = {};
        this.searchParams = {skip: 0, limit: 50, isNotInvoiced: true};
        ctrl.open = {
            creationDateTime: false,
            filterCreationFromDateTime: false,
            filterCreationToDateTime: false,
            collectionDateTime: false,
            deliveryDateTime: false,
            filterCollectionFromDateTime: false,
            filterCollectionToDateTime: false
        };
        this.InvoiceSearchParams = {skip: 0, limit: 20};
        ctrl.changeView = function (type) {
            if (type === 'Create') {
                ctrl.activeView = type;
            }
            if (type === 'Invoices') {
                ctrl.InvoiceSearchParams = {skip: 0, limit: 20};
                ctrl.allInvoicesRetrieved = false;
                ctrl.activeView = type;
            }
        };

        ctrl.openInvoiceModal = function () {
            if (!ctrl.jobsNotSelected) {
                jobListForInvoice = [];
                angular.forEach(jobCheckedMap, function (job) {
                    jobListForInvoice.push(angular.copy(job));
                });
                ctrl.showJobForInvoiceModal(jobListForInvoice, ctrl.customerId);
            }
        }

        ctrl.clearSelectedJobs = function () {
            jobCheckedMap = {};
            angular.forEach(ctrl.jobList, function (job) {
                job.checked = false;
            });
            ctrl.jobCount = 0;
        }

        ctrl.checkJobSelected = function (jobObj) {
            if (jobObj.checked == null || jobObj.checked == undefined) {
                jobObj.checked = true;
            } else {
                jobObj.checked = !jobObj.checked;
            }
            if (jobObj.checked) {
                jobCheckedMap[jobObj.id] = jobObj;
            } else {
                delete jobCheckedMap[jobObj.id];
            }
            var count = 0;
            angular.forEach(jobCheckedMap, function (job) {
                if (job.checked) {
                    ctrl.jobsNotSelected = false;
                    count += 1;
                }
            });
            ctrl.jobCount = count;
        }

        ctrl.retrieveJobListForCustomerSelected = function (id) {
            ctrl.searchParams.customerId = id;
            ctrl.searchParams.skip = 0;
            ctrl.searchParams.limit = 50;
            ctrl.jobCount = 0;
            jobCheckedMap = {};
            if (id != null) {
                ctrl.retrieveResults(ctrl.searchParams);
            } else {
                ctrl.jobList = [];
            }
        }

        ctrl.nextPageForJobs = function () {
            if (!ctrl.allJobsRetrieved) {
                if (ctrl.customerId != null) {
                    ctrl.retrieveResults(ctrl.searchParams);
                }
            }
        };

        ctrl.nextPageForInvoices = function () {
            if (!ctrl.allInvoicesRetrieved) {
                ctrl.retrieveInvoice(ctrl.InvoiceSearchParams);
            }
        };

        ctrl.retrieveInvoice = function (params) {
            InvoiceDao.query(params).then(function (res) {
                if (ctrl.InvoiceSearchParams.skip === 0) {
                    ctrl.invoiceList = [];
                    ctrl.InvoiceSearchParams.skip = res.length;
                }
                if (res.length < 1) {
                    ctrl.allInvoicesRetrieved = true;
                }
                ctrl.invoiceList = ctrl.invoiceList.concat(res);
                ctrl.InvoiceSearchParams.skip = ctrl.invoiceList.length;
                ctrl.invoiceList = ($filter("unique")(ctrl.invoiceList, "id"));
//                ctrl.invoiceList = ctrl.invoiceList.concat(res);
            }).then(function () {
                ctrl.responseComplete = true;
            });
        }

        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
        };
        this.setflag = function () {
            this.setFocus = !this.setFocus;
        }
        ctrl.searchInvoice = function () {
            var searchParams = ctrl.InvoiceSearchParams;
            searchParams.skip = 0;
            if (searchParams.creationFromDate != null && searchParams.creationFromDate instanceof Date) {
                searchParams.creationFromDate = new Date(searchParams.creationFromDate).getTime();
            }
            if (searchParams.creationToDate != null && searchParams.creationToDate instanceof Date) {
                searchParams.creationToDate = new Date(searchParams.creationToDate).getTime();
            }
            angular.extend(searchParams, ctrl.orderColumn);
            ctrl.retrieveInvoice(searchParams);
        }

        //To set order of coulumn
        ctrl.setOrder = function (colName) {
            if (ctrl.orderColumn.sortBy === colName) {
                if (ctrl.orderColumn.order === 'asc') {
                    ctrl.orderColumn.order = 'desc';
                } else {
                    ctrl.orderColumn.order = 'asc';
                    ctrl.orderColumn.sortBy = colName;
                }
            } else {
                ctrl.orderColumn.sortBy = colName;
                ctrl.orderColumn.order = 'asc';
            }
            ctrl.searchInvoice();
        };

        ctrl.setOrder1 = function (colName) {
            if (ctrl.orderColumn1.sortBy === colName) {
                if (ctrl.orderColumn1.order === 'asc') {
                    ctrl.orderColumn1.order = 'desc';
                } else {
                    ctrl.orderColumn1.order = 'asc';
                    ctrl.orderColumn1.sortBy = colName;
                }
            } else {
                ctrl.orderColumn1.sortBy = colName;
                ctrl.orderColumn1.order = 'asc';
            }
            ctrl.searchJobs();
        };

        ctrl.searchJobs = function () {
            var searchParams = ctrl.searchParams;
            angular.extend(searchParams, ctrl.orderColumn1);
            searchParams.skip = 0;
            if (searchParams.collectionFromDate != null && searchParams.collectionFromDate instanceof Date) {
                searchParams.collectionFromDate = new Date(searchParams.collectionFromDate).getTime();
            }
            if (searchParams.collectionToDate != null && searchParams.collectionToDate instanceof Date) {
                searchParams.collectionToDate = new Date(searchParams.collectionToDate).getTime();
            }
            if (searchParams.deliveryFromDate != null && searchParams.deliveryFromDate instanceof Date) {
                searchParams.deliveryFromDate = new Date(searchParams.deliveryFromDate).getTime();
            }
            if (searchParams.deliveryToDate != null && searchParams.deliveryToDate instanceof Date) {
                searchParams.deliveryToDate = new Date(searchParams.deliveryToDate).getTime();
            }
            ctrl.retrieveResultsForFilter(searchParams);
        }

        ctrl.retrieveResultsForFilter = function (searchParams) {
            if (searchParams.customerId != undefined && searchParams.customerId != null) {
                JobDao.query(searchParams).then(function (res) {
                    if (ctrl.searchParams.skip === 0) {
                        ctrl.jobList = [];
                        ctrl.searchParams.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allJobsRetrieved = true;
                    }
                    angular.forEach(res, function (job) {
                        if (jobCheckedMap[job.id] != null) {
                            ctrl.jobList.push(jobCheckedMap[job.id]);
                        } else {
                            ctrl.jobList.push(job);
                        }
                    });
//                    ctrl.jobList = ctrl.jobList.concat(res);
                    ctrl.jobList = ($filter("unique")(ctrl.jobList, "id"));
                    ctrl.searchParams.skip = ctrl.jobList.length;
                }).then(function () {
                    ctrl.responseComplete = true;
                });
            }
        }

        ctrl.retrieveResults = function (searchParams) {
            if (searchParams.customerId != undefined && searchParams.customerId != null) {
                JobDao.query(searchParams).then(function (res) {
                    if (ctrl.searchParams.skip === 0) {
                        ctrl.jobList = [];
                        ctrl.searchParams.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allJobsRetrieved = true;
                    }
                    ctrl.jobList = ctrl.jobList.concat(res);
                    ctrl.jobList = ($filter("unique")(ctrl.jobList, "id"));
                    ctrl.searchParams.skip = ctrl.jobList.length;
                }).then(function () {
                    ctrl.responseComplete = true;
                });
            }
        }

        ctrl.retrieveCustomers = function () {
            CustomerDao.query().then(function (data) {
                ctrl.customerList = data;
            });
        };

        ctrl.showJobForInvoiceModal = function (jobsList, custId) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/invoices/views/jobForInvoiceModal.html',
                controller: 'JobInvoiceController as jobinvoice',
                backdrop: 'static',
                size: 'confirmation',
                keyboard: false,
                resolve: {
                    jobInvoiceParam: function () {
                        return {jobInvoiceList: jobsList, customerId: custId};
                    }
                }
            });
            modalInstance.result.then(function (isSaved) {
                if (isSaved) {
                    ctrl.jobCount = 0;
                    ctrl.customerId = null;
                    ctrl.jobList = [];
                    ctrl.changeView('Invoices');
                }
            });
        };

        ctrl.loadInvoiceInSage = function (invoiceObj) {
            InvoiceDao.loadInSage(invoiceObj).then(function (data) {

            });
        }
        ctrl.retrieveCustomers();
    };
    angular.module('tpc.controllers').controller('InvoiceController', ['CustomerDao', '$uibModal', 'JobDao', 'InvoiceDao', '$filter', InvoiceController]);
})();