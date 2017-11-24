(function () {
    var LicenceTypeController = function (StaffDao, VehicleDao, VehicleLicenceTypeDao, AlertService, $scope, $location, $filter, $uibModal) {
        var ctrl = this;
        ctrl.licenceTypeList = [];
        ctrl.classList = [];
        ctrl.vehicleSizeList = [];
        ctrl.searchParams = {skip: 0, limit: 20};
        ctrl.allDateRetrieved = false;
        StaffDao.getLicenceClass().then(function (data) {
            ctrl.classList = data;
        }).catch(function (e) {
            console.log("Failed to retrieve licence classes");
        });
        VehicleDao.getVehicleSize().then(function (data) {
            ctrl.vehicleSizeList = data;
        }).catch(function (e) {
            console.log("Failed to retrieve vehicle sizes");
        });
        //To add new row
        ctrl.addNewRow = function (form) {
            if (ctrl.licenceTypeList.length > 0) {
                ctrl.licenceFormSubmitted = true;
                if (form.$valid) {
                    ctrl.licenceFormSubmitted = false;
                    ctrl.licenceTypeList.unshift({});
                }
            } else {
                ctrl.licenceFormSubmitted = false;
                ctrl.licenceTypeList.unshift({});
            }
            ctrl.scrollFlag = true;
        };
        ctrl.retrieveAllLicenceTypes = function () {
            VehicleLicenceTypeDao.get(ctrl.searchParams).then(function (data) {
                if (data.length < 1) {
                    ctrl.allDateRetrieved = true;
                }
                ctrl.licenceTypeList = ctrl.licenceTypeList.concat(data);
                ctrl.licenceTypeList = ($filter("unique")(ctrl.licenceTypeList, "id"));
                ctrl.searchParams.skip = ctrl.licenceTypeList.length;
            }).catch(function (e) {
                console.log("Failed to retrieve licence types");
            });
        }
        ctrl.nextPage = function () {
            if (!ctrl.allDateRetrieved) {
                ctrl.retrieveAllLicenceTypes();
            }
        };
        ctrl.initialRetrieval = function () {
            ctrl.allDateRetrieved = false;
            ctrl.skip = 0;
            ctrl.licenceTypeList = [];
            ctrl.searchParams = {skip: 0, limit: 20};
            ctrl.retrieveAllLicenceTypes();
        };
        //To save licence types
        ctrl.saveLicenceTypes = function (form) {
            ctrl.formObj = form;
            ctrl.licenceFormSubmitted = true;
            if (form.$valid) {
                var licenceTypesToSave = [];
                angular.forEach(ctrl.licenceTypeList, function (licence) {
                    if (!!licence.dirty) {
                        var licenceToSave = angular.copy(licence);
                        delete licenceToSave.openDropdown;
                        delete licenceToSave.openDropdown1;
                        delete licenceToSave.duplicateRecord;
                        delete licenceToSave.dirty;
                        licenceTypesToSave.push(licenceToSave);
                    }
                });
                if (licenceTypesToSave.length > 0) {
                    ctrl.saveDisabled = true;
                    VehicleLicenceTypeDao.update(licenceTypesToSave).then(function (res) {
                        AlertService.addMessage({type: 'success', msg: 'Licence types have been saved.'});
                        ctrl.initialRetrieval();
                    }).catch(function (response) {
                        if (response.status === 417) {
                            angular.forEach(ctrl.licenceTypeList, function (licence) {
                                if (!!licence.dirty) {
                                    licence.duplicateRecord = false;
                                    angular.forEach(response.data, function (duplicatObj) {
                                        if (duplicatObj.id === licence.id && duplicatObj.licenceClass === licence.licenceClass
                                                && duplicatObj.vehicleSize === licence.vehicleSize) {
                                            licence.duplicateRecord = true;
                                        }
                                    });
                                }
                            });
                        } else {
                            AlertService.addUnautorizedMessage({type: 'danger', msg: 'Licence types cannot be saved.'});
                        }
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                }
            }
        };

        //confirmation modal logic
        ctrl.showConfirmation = true;
        $scope.$on('$locationChangeStart', function (event, newURL) {
            var locationToMove;
            if (newURL.lastIndexOf("#/") >= 0) {
                locationToMove = newURL.substring(newURL.lastIndexOf("#/") + 1);
            } else {
                locationToMove = "/";
            }
            var formDirty = false;
            angular.forEach(ctrl.licenceTypeList, function (licence) {
                if (!!licence.dirty) {
                    formDirty = true;
                }
            });
            if (formDirty && ctrl.showConfirmation) {
                ctrl.showConfirmationModal(locationToMove);
                event.preventDefault();
            }
        });

        ctrl.showConfirmationModal = function (locationToMove) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                templateUrl: 'app/common/views/confirmationmodal.html',
                controller: 'ConfirmationModalController as confirmationModal',
                backdrop: 'static',
                size: 'confirmation'
            });
            modalInstance.result.then(function (ok) {
                ctrl.showConfirmation = !ok;
                if (ok) {
                    $location.path(locationToMove);
                }
            });
        };
    };
    angular.module('tpc.controllers').controller('LicenceTypeController', ['StaffDao', 'VehicleDao', 'VehicleLicenceTypeDao', 'AlertService', '$scope', '$location', '$filter', '$uibModal', LicenceTypeController]);
})();
