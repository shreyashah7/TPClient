(function () {
    function CustomerController(CustomerDao, AlertService, $filter) {
        var ctrl = this;
        ctrl.dataloaded = false;
        ctrl.customerModalPanel = false;
        ctrl.editCustomerFlag = false;
        ctrl.allCustomersRetrieved = false;
        var searchFilter = {
            customerName: ctrl.searchedCustomer,
            skip: 0,
            limit: 50
        };

        ctrl.searchCustomers = function () {
            var searchFilter = {
                customerName: ctrl.searchedCustomer,
                skip: 0,
                limit: 50
            };
            ctrl.retrieveCustomers(searchFilter);
        };

        ctrl.retrieveCustomers = function (searchFilter) {
            CustomerDao.query(searchFilter).then(function (data) {
                if (searchFilter.skip === 0) {
                    ctrl.customerList = [];
                    searchFilter.skip = data.length;
                }
                if (data.length < 1) {
                    ctrl.allCustomersRetrieved = true;
                }
                ctrl.customerList = ctrl.customerList.concat(data);
                ctrl.customerList = ($filter("unique")(ctrl.customerList, "id"));
                searchFilter.skip = ctrl.customerList.length;
            });
        };

        //To create new customer
        ctrl.createCustomer = function (customerObj, customerForm) {
            var ctrl = this;
            ctrl.customerSubmittedFlag = true;
            if (customerForm.$valid && ctrl.editCustomerFlag !== undefined) {
                ctrl.saveDisabled = true;
                if (ctrl.editCustomerFlag == false) {
                    CustomerDao.save(angular.copy(customerObj)).then(function (res) {
                        ctrl.customerSaved(customerForm);
                        AlertService.addMessage({type: 'success', msg: 'Customer has been created.'});
                    }).catch(function (e) {
                        AlertService.addMessage({type: 'danger', msg: 'Customer could not be created.'});
                    }).then(function(){
                        ctrl.saveDisabled = false;
                    });
                } else {
                    CustomerDao.update(angular.copy(customerObj)).then(function (res) {
                        ctrl.customerSaved(customerForm);
                        AlertService.addMessage({type: 'success', msg: 'Customer has been updated.'});
                    }).catch(function (e) {
                        AlertService.addMessage({type: 'danger', msg: 'Customer could not be updated.'});
                    }).then(function(){
                        ctrl.saveDisabled = false;
                    });
                }
            }
        };

        ctrl.customerSaved = function (customerForm) {
            customerForm.$setPristine();
            ctrl.closeCustomerModalPanel();
            ctrl.searchCustomers();
        };

        ctrl.editCustomer = function (id) {
            CustomerDao.retrieveById({id: id}).then(function (res) {
                ctrl.customerObj = angular.copy(res);
                ctrl.editCustomerFlag = true;
                ctrl.openCustomerModalPanel();
            }).catch(function (e) {
                AlertService.addMessage({type: 'error', msg: 'No Customer exist.'});
            });
        };

        //next page method called by infinite scroll
        ctrl.nextPage = function () {
            if (!ctrl.allCustomersRetrieved) {
                CustomerDao.query(searchFilter).then(function (data) {
                    if (searchFilter.skip === 0) {
                        ctrl.customerList = [];
                        searchFilter.skip = data.length;
                    }
                    if (data.length < 50) {
                        ctrl.allCustomersRetrieved = true;
                    }
                    ctrl.customerList = ctrl.customerList.concat(data);
                    ctrl.customerList = ($filter("unique")(ctrl.customerList, "id"));
                    searchFilter.skip = ctrl.customerList.length;
                });
            }
        };

        ctrl.openCustomerModalPanel = function () {
            ctrl.customerModalPanel = true;
            ctrl.customerSubmittedFlag = false;
        };

        ctrl.closeCustomerModalPanel = function () {
            ctrl.customerSubmittedFlag = false;
            ctrl.customerModalPanel = false;
            ctrl.editCustomerFlag = false;
            delete ctrl.customerObj;
        };

    }
    angular.module('tpc.controllers').controller('CustomerController', ['CustomerDao', 'AlertService', '$filter', CustomerController]);
})();
