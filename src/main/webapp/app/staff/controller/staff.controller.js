
(function () {
    var StaffController = function (StaffDao, location, AlertService, $filter, $uibModal) {
        var ctrl = this;
        //date picker options
        this.open = {
            dateOfBirth: false,
            employmentDate: false,
            eyeTest: false
        };
        ctrl.searchParams = {
            driverName: this.searchedStaff,
            skip: 0,
            limit: 50
        };
        this.setFocus = false;
        this.allStaffsRetrieved = false;
        this.addStaffModalPanel = false;
        ctrl.staffSubmitted = false;
        ctrl.editStaffFlag = false;
        ctrl.staffObject = {};
        ctrl.staffFilters = {};
        ctrl.orderColumn = {sortBy: 'id', order: 'desc'};
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
            ctrl.filterStaffs();
        };

        this.filterStaffs = function () {
            if (ctrl.staffFilters != null) {
                ctrl.searchParams.driverName = ctrl.staffFilters.driverName;
            }
            ctrl.searchParams.skip = 0;
            angular.extend(ctrl.searchParams, ctrl.orderColumn);
            ctrl.searchParams.licenceClass = ctrl.staffFilters.licenceClass;
            this.retrieveResults();
        };
        ctrl.searchStaffs = function () {
            ctrl.searchParams = {
                driverName: this.searchedStaff,
                skip: 0,
                limit: 50
            };
            angular.extend(ctrl.searchParams, ctrl.orderColumn);
            this.retrieveResults();
        };
        ctrl.retrieveResults = function () {
            if (!(angular.isDefined(ctrl.staffList)) || ctrl.staffList.length < 1) {
                ctrl.staffList = [];
            }
            if (angular.isDefined(ctrl.searchParams.skip)) {
                StaffDao.query(ctrl.searchParams).then(function (res) {
                    if (ctrl.searchParams.skip === 0) {
                        ctrl.staffList = [];
                        ctrl.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allStaffsRetrieved = true;
                    }
                    ctrl.staffList = ctrl.staffList.concat(res);
                    ctrl.staffList = ($filter("unique")(ctrl.staffList, "id"));
                    ctrl.skip = ctrl.staffList.length;
                });
            }
        };
        ctrl.nextPageForStaffs = function () {
            if (!ctrl.allStaffsRetrieved) {
                ctrl.searchParams.skip = ctrl.skip;
                ctrl.retrieveResults();
            }
        };
        ctrl.addModalPanel = function () {
            ctrl.addStaffModalPanel = true;
            ctrl.staffSubmitted = false;
            ctrl.getLicenceClass();
            ctrl.retrieveAgency();
        };

        ctrl.saveStaff = function (staffObject, form) {
            ctrl.staffSubmitted = true;
            if (form.$valid && ctrl.editStaffFlag !== undefined) {
                ctrl.saveDisabled = true;
                if (ctrl.editStaffFlag == false) {
                    StaffDao.save(staffObject).then(function () {
                        ctrl.staffSubmitted = false;
                        AlertService.addMessage({type: 'success', msg: 'Staff created successfully.'});
                        ctrl.hideCreateNewStaff(form);
                        ctrl.staffList = [];
                        ctrl.searchParams.skip = 0;
                        ctrl.searchStaffs();

                    }).catch(function () {
                        AlertService.addMessage({type: 'error', msg: 'There was an error when creating/updating the Staff.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                } else {
                    StaffDao.update(angular.copy(staffObject)).then(function (res) {
                        AlertService.addMessage({type: 'success', msg: 'Staff has been updated.'});
                        ctrl.hideCreateNewStaff(form);
                        ctrl.staffSubmitted = false;
                        ctrl.searchStaffs();
                    }).catch(function (e) {
                        AlertService.addMessage({type: 'danger', msg: 'Staff could not be updated.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                }
            }
        };
        ctrl.hideCreateNewStaff = function (form) {
            form.$setPristine(true);
            ctrl.addStaffModalPanel = false;
            ctrl.editStaffFlag = false;
            delete ctrl.staffObject;
        };
        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
        };
        ctrl.closeCalendar = function (e, date) {
            ctrl.open[date] = false;
        };
        ctrl.viewStaff = function (id) {
            StaffDao.retrieveById({id: id}).then(function (res) {
                ctrl.staffObject = angular.copy(res);
                ctrl.editStaffFlag = true;
                ctrl.addModalPanel();
            }).catch(function (e) {
                AlertService.addMessage({type: 'danger', msg: 'Staff does not exist.'});
            });
        };
        this.setflag = function () {
            this.setFocus = !this.setFocus;
        };
        ctrl.getLicenceClass = function () {
            StaffDao.getLicenceClass().then(function (res) {
                ctrl.licenceClass = res;
            });
        };

        ctrl.checkTemporary = function (temp) {
            ctrl.temporaryStaffCheck(!temp);
        }

        ctrl.retrieveAgency = function () {
            StaffDao.getAgencies().then(function (res) {
                ctrl.agencyList = res;
            })
        }

        ctrl.temporaryStaffCheck = function (temp) {
            if (temp == undefined) {
                temp = true;
            } else {
                temp = !temp;
            }
            ctrl.staffObject.temporary = temp;
            ctrl.staffObject.phoneNumber = null;
            ctrl.staffObject.dateOfBirth = null;
            ctrl.staffObject.employmentDate = null;
            ctrl.staffObject.address = null;
            ctrl.staffObject.cityTown = null;
            ctrl.staffObject.county = null;
            ctrl.staffObject.postCode = null;
            ctrl.staffObject.eyeTest = null;
            ctrl.staffObject.hourContract = null;
        }
        ctrl.showManifestModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/staff/views/manifestmodal.html',
                controller: 'ManifestModalController as manifest',
                backdrop: 'static',
                size: 'confirmation',
                keyboard: false,
                resolve: {
                    staffId: function () {
                        return id;
                    }
                }
            });
            modalInstance.result.then(function () {
            });
        };
        ctrl.showAbsenceModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/staff/views/absencemodal.html',
                controller: 'AbsenceModalController as absence',
                backdrop: 'static',
                size: 'confirmation',
                keyboard: false,
                resolve: {
                    staffId: function () {
                        return id;
                    }
                }
            });
            modalInstance.result.then(function () {
            });
        };
    };
    angular.module('tpc.controllers').controller('StaffController', ['StaffDao', '$location', 'AlertService', '$filter', '$uibModal', StaffController]);
})();



