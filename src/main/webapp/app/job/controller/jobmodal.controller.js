(function () {
    var JobModalController = function (JobDao, CustomerDao, CollectionPointDao, AlertService, jobId, $uibModalInstance, $uibModal, jobObj, $rootScope) {
        var ctrl = this;
        ctrl.statusList = ['New', 'Assigned', 'Delivered', 'Invoiced'];
        ctrl.deliveryDateBigger = true;
        //date picker options
        ctrl.open = {
            collectionDateTime: false,
            deliveryDateTime: false,
            filterCollectionFromDateTime: false,
            filterCollectionToDateTime: false
        };
        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
        };
        ctrl.initJobModal = function (id) {
            if (jobObj == null) {
                if (id == null) {
                    ctrl.jobObj = {};
                    ctrl.jobObj.collectionDateTime = new Date();
                    ctrl.jobObj.deliveryDateTime = new Date();
                    ctrl.jobObj.adr = false;
                } else {
                    JobDao.get({id: id}).then(function (res) {
                        ctrl.jobObj = res;
                        if (ctrl.jobObj.customerId != null) {
                            ctrl.retrieveListForCollection(ctrl.jobObj.customerId);
                        }
                    });
                }
            } else {
                ctrl.jobObj = jobObj;
                ctrl.retrieveListForCollection(jobObj.customerId);
            }
        };
        ctrl.clearDeliveryDateTime = function () {
            if (ctrl.jobObj.collectionDateTime != null && ctrl.jobObj.deliveryDateTime != null) {
                if (ctrl.jobObj.collectionDateTime > ctrl.jobObj.deliveryDateTime) {
                    ctrl.jobObj.deliveryDateTime = ctrl.jobObj.collectionDateTime;
                }
            }
        }

        ctrl.checkCollectionDeliveryDateTime = function () {
            if (ctrl.jobObj.collectionDateTime != null && ctrl.jobObj.deliveryDateTime != null) {
                if (ctrl.jobObj.collectionDateTime > ctrl.jobObj.deliveryDateTime) {
                    ctrl.deliveryDateBigger = false;
                } else {
                    ctrl.deliveryDateBigger = true;
                }
            } else {
                ctrl.deliveryDateBigger = true;
            }
        }
        ctrl.showCollectionPointModalPanel = function (type, company) {
            if (company != null) {
                $uibModalInstance.close();
                modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'app/job/views/collectionPointModal.html',
                    controller: 'CollectionController as collection',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        collectionParam: function () {
                            return {type: type, company: company, jobId: ctrl.jobObj.id, jobObj: ctrl.jobObj};
                        }
                    }
                });
                modalInstance.result.then(function (obj, type, id) {
                    // logic to keep selected...
                });
            }
        };
        ctrl.saveJob = function (form) {
            ctrl.jobSubmitted = true;
            if (form.$valid && ctrl.deliveryDateBigger) {
                ctrl.saveDisabled = true;
                if (ctrl.jobObj.id == null) {
                    JobDao.save(ctrl.jobObj).then(function () {
                        ctrl.jobSaved(form);
                        AlertService.addMessage({type: 'success', msg: 'Job has been created.'});
                    }).catch(function () {
                        AlertService.addMessage({type: 'danger', msg: 'Job could not be created.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                } else {
                    JobDao.update(ctrl.jobObj).then(function () {
                        ctrl.jobSaved(form);
                        AlertService.addMessage({type: 'success', msg: 'Job has been updated.'});
                    }).catch(function () {
                        AlertService.addMessage({type: 'danger', msg: 'Job could not be updated.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                }
            }
        };
        ctrl.jobSaved = function (form) {
            form.$setPristine();
            $uibModalInstance.close();
            $rootScope.$broadcast('refresh-jobs');
        };
        ctrl.hideJobModal = function () {
            $uibModalInstance.dismiss('cancel');
        };
        ctrl.retrieveCustomers = function () {
            CustomerDao.query().then(function (data) {
                ctrl.customerList = data;
            });
        };
        ctrl.getVehicleTypes = function () {
            JobDao.getVehicleTypes().then(function (res) {
                ctrl.vehicleTypes = res;
            });
        };
        ctrl.getVehicleSize = function () {
            JobDao.getVehicleSize().then(function (res) {
                ctrl.vehicleSize = res;
            });
        };
        ctrl.invoiceSent = function (id) {
            JobDao.changeStatus({id: id, action: 'invoiced'}).then(function () {
                ctrl.jobObj.status = 'Invoiced';
            });
        };
        ctrl.retrieveListForCollection = function (comapnyId) {
            ctrl.retrieveCollectionPoints(comapnyId);
            ctrl.retrieveDeliveryPoints(comapnyId);
        }
        ctrl.retrieveCollectionPoints = function (companyId) {
            var filter = {type: "C", customerId: companyId}
            CollectionPointDao.query(filter).then(function (data) {
                ctrl.collectionPointList = data;
            });
        };
        ctrl.retrieveDeliveryPoints = function (companyId) {
            var filter = {type: "D", customerId: companyId}
            CollectionPointDao.query(filter).then(function (data) {
                ctrl.deliveryPointList = data;
            });
        };
        ctrl.retrieveCustomers();
        ctrl.getVehicleTypes();
        ctrl.getVehicleSize();
        ctrl.initJobModal(jobId);
    };
    angular.module('tpc.controllers').controller('JobModalController', ['JobDao', 'CustomerDao', 'CollectionPointDao', 'AlertService', 'jobId', '$uibModalInstance', '$uibModal', 'jobObj', '$rootScope', JobModalController]);
})();
