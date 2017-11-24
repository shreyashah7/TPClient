(function () {
    var VehicleController = function (VehicleDao, AlertService, $filter) {
        var ctrl = this;
        this.allVehiclesRetrieved = false;
        this.addVehicleModalPanel = false;
        ctrl.vehicleSubmitted = false;
        ctrl.editVehicleFlag = false;
        ctrl.yesNoOptions = ['Yes', 'No'];
        ctrl.articOptions = ['Rigid', 'Unit', 'Trailer'];
        //date picker options
        this.open = {
            motDue: false,
            sixWeeklyCheck: false,
            tachoCheckDue: false,
            loler6MonthCheck: false,
            loler12MonthCheck: false
        };
        ctrl.vehicleObject = {};
        ctrl.vehicleObject.artic = ctrl.articOptions[0];
        ctrl.orderColumn = {sortBy: 'id', order: 'desc'};
        ctrl.vehicleFilters = {};
        ctrl.searchParams = {skip: 0, limit: 50};
        angular.extend(ctrl.searchParams, ctrl.orderColumn);
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
            ctrl.searchParams.skip = 0;
            ctrl.searchParams.limit = 50;
            ctrl.filterVehicles();
        };
        this.filterVehicles = function () {
            if (ctrl.vehicleFilters != null) {
                ctrl.searchParams.vehicleReg = ctrl.vehicleFilters.vehicleReg;
            }
            ctrl.searchParams.skip = 0;
            angular.extend(ctrl.searchParams, this.orderColumn);
            ctrl.searchParams.vehicleType = ctrl.vehicleFilters.vehicleType;
            ctrl.searchParams.vehicleSize = ctrl.vehicleFilters.vehicleSize;
            ctrl.searchParams.active = ctrl.vehicleFilters.active;
            ctrl.searchParams.defect = ctrl.vehicleFilters.defect;
            this.retrieveVehicles();
        };
        ctrl.searchVehicles = function () {
            if (!ctrl.searchParams) {
                ctrl.searchParams = {};
            }
            ctrl.searchParams.vehicleReg = this.searchedVehicle;
            ctrl.searchParams.skip = 0;
            ctrl.searchParams.limit = 50;
            this.retrieveVehicles();
        };
        ctrl.retrieveVehicles = function () {
            if (!(angular.isDefined(ctrl.vehicleList)) || ctrl.vehicleList.length < 1) {
                ctrl.vehicleList = [];
            }
            if (angular.isDefined(ctrl.searchParams.skip)) {
                VehicleDao.query(ctrl.searchParams).then(function (res) {
                    if (ctrl.searchParams.skip === 0) {
                        ctrl.vehicleList = [];
                        ctrl.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allVehiclesRetrieved = true;
                    }
                    ctrl.vehicleList = ctrl.vehicleList.concat(res);
                    ctrl.vehicleList = ($filter("unique")(ctrl.vehicleList, "id"));
                    ctrl.skip = ctrl.vehicleList.length;
                });
            }
        };
        ctrl.nextPageForVehicles = function () {
            if (!ctrl.allVehiclesRetrieved) {
                ctrl.searchParams.skip = ctrl.skip;
                ctrl.retrieveVehicles();
            }
        };
        ctrl.addModalPanel = function () {
            this.addVehicleModalPanel = true;
            ctrl.editVehicleFlag = false;
            ctrl.vehicleObject = {};
            ctrl.vehicleObject.tailLift = true;
            ctrl.vehicleObject.artic = ctrl.articOptions[0];
            ctrl.vehicleSubmitted = false;
            ctrl.getAllVehicleTypes();
            ctrl.getVehicleSize();
            ctrl.retrieveAgency();
        };
        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
        };
        ctrl.closeCalendar = function (e, date) {
            ctrl.open[date] = false;
        };
        ctrl.saveVehicle = function (vehicleObject, form) {
            ctrl.vehicleSubmitted = true;
            if (form.$valid && ctrl.editVehicleFlag !== undefined) {
                var vehicleObjectToSave = angular.copy(vehicleObject);
                if (vehicleObjectToSave.tailLift == null || vehicleObjectToSave.tailLift == false) {
                    vehicleObjectToSave.loler6MonthCheck = null;
                    vehicleObjectToSave.loler12MonthCheck = null;
                }
                ctrl.saveDisabled = true;
                if (ctrl.editVehicleFlag == false) {
                    VehicleDao.save(vehicleObjectToSave).then(function () {
                        ctrl.vehicleSubmitted = false;
                        AlertService.addMessage({type: 'success', msg: 'Vehicle created successfully.'});
                        ctrl.hideCreateNewVehicle(form);
                        ctrl.vehicleList = [];
                        ctrl.searchParams.skip = 0;
                        ctrl.retrieveVehicles();
                    }).catch(function () {
                        AlertService.addMessage({type: 'error', msg: 'There was an error when creating/updating the Vehicle.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                } else {
                    VehicleDao.update(vehicleObjectToSave).then(function () {
                        ctrl.vehicleSubmitted = false;
                        AlertService.addMessage({type: 'success', msg: 'Vehicle has been updated.'});
                        ctrl.hideCreateNewVehicle(form);
                        ctrl.vehicleList = [];
                        ctrl.searchParams.skip = 0;
                        ctrl.retrieveVehicles();
                    }).catch(function () {
                        AlertService.addMessage({type: 'error', msg: 'Vehicle could not be updated.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                }
            }
        };
        ctrl.changeTailLift = function () {
            if (ctrl.vehicleObject.tailLift == null || ctrl.vehicleObject.tailLift == false) {
                ctrl.vehicleObject.loler6MonthCheck = null;
                ctrl.vehicleObject.loler12MonthCheck = null;
            }
        };
        ctrl.hideCreateNewVehicle = function (form) {
            form.$setPristine(true);
            ctrl.addVehicleModalPanel = false;
            ctrl.editVehicleFlag = false;
            delete ctrl.vehicleObject;
        };
        ctrl.viewVehicle = function (id) {
            VehicleDao.retrieveById({id: id}).then(function (res) {
                ctrl.addModalPanel();
                ctrl.vehicleObject = angular.copy(res);
                ctrl.editVehicleFlag = true;
            }).catch(function (e) {
                AlertService.addMessage({type: 'error', msg: 'No vehicle exist.'});
            });
        };
        ctrl.getAllVehicleTypes = function () {
            VehicleDao.getVehicleTypes().then(function (res) {
                ctrl.vehicleTypes = res;
            });
        };
        ctrl.getVehicleSize = function () {
            VehicleDao.getVehicleSize().then(function (res) {
                ctrl.vehicleSize = res;
            });
        };
        ctrl.checkTemporary = function (temp) {
            ctrl.temporaryVehicleCheck(!temp);
        }

        ctrl.retrieveAgency = function () {
            VehicleDao.getAgencies().then(function (res) {
                ctrl.agencyList = res;
            })
        }

        ctrl.temporaryVehicleCheck = function (temp) {
            if (temp == undefined) {
                temp = true;
            } else {
                temp = !temp;
            }
            ctrl.vehicleObject.temporary = temp;
            ctrl.vehicleObject.carryingCapacity = null;
            ctrl.vehicleObject.palletCapacity = null;
            ctrl.vehicleObject.internalLength = null;
            ctrl.vehicleObject.internalHeight = null;
            ctrl.vehicleObject.vehicleHeight = null;
            ctrl.vehicleObject.motDue = null;
            ctrl.vehicleObject.sixWeeklyCheck = null;
            ctrl.vehicleObject.tachoCheckDue = null;
            ctrl.vehicleObject.loler6MonthCheck = null;
            ctrl.vehicleObject.defect = null;
            ctrl.vehicleObject.trackNumber = null;
            ctrl.vehicleObject.twelveWeeklyCheck = null;
        }
        ctrl.articChanged = function (artic) {
            ctrl.vehicleObject = {};
            ctrl.vehicleObject.tailLift = true;
            ctrl.vehicleObject.artic = artic;
        };
    };
    angular.module('tpc.controllers').controller('VehicleController', ['VehicleDao', 'AlertService', '$filter', VehicleController]);
})();
