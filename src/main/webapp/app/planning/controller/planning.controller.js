(function () {
    var PlanningController = function (PlanningDao, VehicleDao, StaffDao, JobDao, $filter, $sce, $uibModal, VehicleLicenceTypeDao, $scope) {
        var ctrl = this;
        ctrl.planningView = true;
        this.setFocus = false;
        ctrl.allStaffsRetrieved = false;
        ctrl.allVehicleContentsRetrieved = false;
        ctrl.activeView = "jobs";
        ctrl.orderColumn = {};
        ctrl.vehicleContentSearchParams = {
            skip: 0,
            limit: 20
        };
        ctrl.open = {
            filterCollectionFromDateTime: false,
            filterCollectionToDateTime: false,
            filterDeliveryFromDateTime: false,
            filterDeliveryToDateTime: false,
            openPlannerDate: false
        };

        ctrl.holidays = [];
        ctrl.jobFilters = {};
        ctrl.orderColumn = {};
        ctrl.plannerDate = new Date();
        ctrl.jobsParams = {skip: 0, limit: 50};
        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
            if (date == 'openPlannerDate') {
                PlanningDao.retrieveHolidays().then(function (res) {
                    ctrl.holidays = angular.copy(res);
                });
            }
        };
        ctrl.getHolidays = function (date, mode) {

            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
                var day = date.getDay();
                if ((day == 6) || (day == 0)) {
                    ctrl.holidays.push({"date": dayToCheck, "holidayName": "Weekend"});
                }
                for (var i = 0; i < ctrl.holidays.length; i++) {
                    var currentDay = new Date(ctrl.holidays[i].date).setHours(0, 0, 0, 0);
                    if (dayToCheck === currentDay) {
                        return 'full';
                    }
                }
            }
            return '';
        };
        ctrl.getNextDay = function () {
            var date = new Date(ctrl.plannerDate);
            date.setFullYear(date.getFullYear());
            date.setMonth(ctrl.plannerDate.getMonth());
            date.setDate(ctrl.plannerDate.getDate() + 1);
            ctrl.plannerDate = date;
            ctrl.changeView(ctrl.activeView);
            if (ctrl.planningView) {
                ctrl.changePlansOnDate();
            } else {
                ctrl.vehicleContentSearchParams.skip = 0;
                ctrl.vehicleContentSearchParams.limit = 0;
                ctrl.getVehicleContents(ctrl.vehicleId);
            }
        };
        ctrl.getPreviousDay = function () {
            var date = new Date(ctrl.plannerDate);
            date.setFullYear(date.getFullYear());
            date.setMonth(ctrl.plannerDate.getMonth());
            date.setDate(ctrl.plannerDate.getDate() - 1);
            ctrl.plannerDate = date;
            ctrl.changeView(ctrl.activeView);
            if (ctrl.planningView) {
                ctrl.changePlansOnDate();
            } else {
                ctrl.vehicleContentSearchParams.skip = 0;
                ctrl.vehicleContentSearchParams.limit = 0;
                ctrl.getVehicleContents(ctrl.vehicleId);
            }
        };
        ctrl.getVehiclesWithPlan = function (vehicleType, planningView) {
            if (!!vehicleType) {
                ctrl.vehicleType = angular.copy(vehicleType);
                var param = {
                    vehicleType: vehicleType,
                    date: ctrl.plannerDate ? new Date(ctrl.plannerDate).getTime() : ''
                };
//                ctrl.getVehicleTypeClassByVehicleTypes(vehicleType);
                PlanningDao.getVehicleByPlanCriteria(param).then(function (data) {
                    ctrl.vehicles = [];
                    if (data) {
                        angular.forEach(data, function (item) {
                            if (item.vehiclePlans[0]) {
                                item.loadColor = item.vehiclePlans[0].color;
                                item.loadTooltip = $sce.trustAsHtml(item.vehiclePlans[0].message);
                            }
                        })
                        ctrl.vehicles = angular.copy(data);
                        if (planningView == false) {
                            ctrl.getVehicleContents(ctrl.vehicleId);
                        }
                    }
                });
            }
            if (planningView == null) {
                ctrl.goBackToPlanningView(true);
            }
        };

//        ctrl.getVehicleTypeClassByVehicleTypes = function (vehicleType) {
        VehicleLicenceTypeDao.query({}).then(function (res) {
            ctrl.sizeClassesMap = {};
            angular.forEach(res, function (obj) {
                if (!ctrl.sizeClassesMap[obj.vehicleSize]) {
                    ctrl.sizeClassesMap[obj.vehicleSize] = [];
                }
                ctrl.sizeClassesMap[obj.vehicleSize].push(obj.licenceClass);
            });
        });
//        };

        ctrl.getVehicleTypes = function () {
            ctrl.vehicleTypeList = [];
            VehicleDao.getVehicleTypes({}).then(function (data) {
                if (data != undefined) {
                    ctrl.vehicleTypeList = angular.copy(data);
                }
            });
        };

        ctrl.changePlansOnDate = function () {
            ctrl.getVehiclesWithPlan(ctrl.vehicleType);
        };
        ctrl.goBackToPlanningView = function (fromMethod) {
            ctrl.planningView = true;
            ctrl.vehicleObject = undefined;
            ctrl.vehicleId = undefined;
            ctrl.vehicleContentList = [];
            ctrl.vehicleContentSearchParams = {
                skip: 0,
                limit: 20
            };
            if (!fromMethod) {
                ctrl.getVehiclesWithPlan(ctrl.vehicleType);
            }

        };
        ctrl.getVehicleContents = function (vehicleId) {
            if (!!vehicleId) {
                ctrl.vehicleId = angular.copy(vehicleId);
                angular.forEach(ctrl.vehicles, function (vehicle) {
                    if (vehicle.id == vehicleId) {
                        ctrl.vehicleObject = vehicle;
                    }
                });
                if (!(angular.isDefined(ctrl.vehicleContentList)) || ctrl.vehicleContentList.length < 1) {
                    ctrl.vehicleContentList = [];
                }
                if (angular.isDefined(ctrl.vehicleContentSearchParams.skip)) {
                    ctrl.vehicleContentSearchParams.date = ctrl.plannerDate ? new Date(ctrl.plannerDate).getTime() : ''
                    ctrl.vehicleContentSearchParams.vehicle = vehicleId;
                    angular.extend(ctrl.vehicleContentSearchParams, ctrl.orderColumn);
                    PlanningDao.get(ctrl.vehicleContentSearchParams).then(function (data) {
                        if (ctrl.vehicleContentSearchParams.skip === 0) {
                            ctrl.vehicleContentList = [];
                            ctrl.vehicleContentSearchParams.skip = data.length;
                        }
                        if (data.length < 1) {
                            ctrl.allVehicleContentsRetrieved = true;
                        }
                        ctrl.planningView = false;
                        ctrl.vehicleContentList = ctrl.vehicleContentList.concat(data);
                        ctrl.vehicleContentList = ($filter("unique")(ctrl.vehicleContentList, "id"));
                        ctrl.vehicleContentSearchParams.skip = ctrl.vehicleContentList.length;
                    }).then(function () {
                    });
                }

            }
        };
        //for data in hover directive 
        ctrl.getJobData = function (jobObj) {
            jobObj.tailLift = (jobObj.tailLift == true || jobObj.tailLift == 'Yes') ? "Yes" : "No";
            jobObj.adr = (jobObj.adr == true || jobObj.adr == 'Yes') ? "Yes" : "No";
            jobObj.collectionDateTime = $filter('date')(jobObj.collectionDateTime, "dd/MM/yyyy hh:mm a");
            jobObj.deliveryDateTime = $filter('date')(jobObj.deliveryDateTime, "dd/MM/yyyy hh:mm a");
            jobObj.palletQty = jobObj.palletQty ? jobObj.palletQty : "N/A";
            jobObj.collectionPointName = jobObj.collectionPointName ? jobObj.collectionPointName : "N/A";
            jobObj.deliveryPointName = jobObj.deliveryPointName ? jobObj.deliveryPointName : "N/A";
            var hoverData = "<div class='hover-text'>Customer: " + jobObj.customer.customerName + "</br>\n\
            Pallet Qty: " + jobObj.palletQty + "</br>\n\
            Weight: " + jobObj.weight + "</br>\n\
            Tail Lift: " + jobObj.tailLift + "</br>\n\
            ADR: " + jobObj.adr + "</br>\n\
            Collection Point: " + jobObj.collectionPointName + "</br>\n\
            Collection DateTime: " + jobObj.collectionDateTime + "</br>\n\
            Delivery Point: " + jobObj.deliveryPointName + "</br>\n\
            Delivery DateTime: " + jobObj.deliveryDateTime + "</br>\n\
            Comments: " + jobObj.comments + "</div>";
            return hoverData;
        };

        function calculatePercentage(num, amount) {
            return num * amount / 100;
        }

        ctrl.getVehicleTypes();
        ctrl.nextPageForVehicleContents = function () {
            if (!ctrl.allVehicleContentsRetrieved) {
                ctrl.getVehicleContents(ctrl.vehicleId);
            }
        };
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
            ctrl.vehicleContentSearchParams.skip = 0;
            ctrl.vehicleContentSearchParams.limit = 20;
            ctrl.getVehicleContents(ctrl.vehicleId);
        };
        //-----------------------code for driver tab
        ctrl.retrieveDrivers = function () {
            if (!(angular.isDefined(ctrl.driverList)) || ctrl.driverList.length < 1) {
                ctrl.driverList = [];
            }
            if (angular.isDefined(ctrl.driverSearchParams.skip)) {
                StaffDao.query(ctrl.driverSearchParams).then(function (res) {
                    if (ctrl.driverSearchParams.skip === 0) {
                        ctrl.driverList = [];
                        ctrl.driverSearchParams.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allStaffsRetrieved = true;
                    }
                    ctrl.driverList = ctrl.driverList.concat(res);
                    ctrl.driverList = ($filter("unique")(ctrl.driverList, "id"));
                    ctrl.driverSearchParams.skip = ctrl.driverList.length;
                }).then(function () {
                });
            }
        };
        ctrl.filterDrivers = function () {
            if (!ctrl.driverSearchParams) {
                ctrl.driverSearchParams = {};
            }
            ctrl.driverSearchParams.skip = 0;
            ctrl.driverSearchParams.limit = 20;
            ctrl.driverSearchParams.sortBy = 'driverName';
            ctrl.driverSearchParams.order = 'asc';
            ctrl.driverSearchParams.unassigned = new Date(ctrl.plannerDate).getTime();
            ctrl.retrieveDrivers();
        }
        ctrl.retrieveJobs = function () {
            if (ctrl.jobsParams.skip != null) {
                ctrl.jobsParams.status = 'New';
                if (ctrl.jobsParams.collectionFromDate) {
                    ctrl.jobsParams.collectionFromDate = new Date(ctrl.jobsParams.collectionFromDate).getTime();
                }
                if (ctrl.jobsParams.collectionToDate) {
                    ctrl.jobsParams.collectionToDate = new Date(ctrl.jobsParams.collectionToDate).getTime();
                }
                if (ctrl.jobsParams.deliveryFromDate) {
                    ctrl.jobsParams.deliveryFromDate = new Date(ctrl.jobsParams.deliveryFromDate).getTime();
                }
                if (ctrl.jobsParams.deliveryToDate) {
                    ctrl.jobsParams.deliveryToDate = new Date(ctrl.jobsParams.deliveryToDate).getTime();
                }
                ctrl.jobsParams.collectionDeliveryDate = new Date(ctrl.plannerDate).getTime();
                JobDao.query(ctrl.jobsParams).then(function (res) {
                    if (ctrl.jobsParams.skip === 0) {
                        ctrl.jobList = [];
                        ctrl.jobsParams.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allJobsRetrieved = true;
                    }
                    ctrl.jobList = ctrl.jobList.concat(res);
                    ctrl.jobList = ($filter("unique")(ctrl.jobList, "id"));
                    ctrl.jobsParams.skip = ctrl.jobList.length;
                }).then(function () {
                    ctrl.responseComplete = true;
                });
            }
        };
        this.filterJobs = function (columnName) {
            if (!ctrl.jobsParams) {
                ctrl.jobsParams = {sortBy: 'deliveryDateTime'};
            }
            ctrl.jobsParams.skip = 0;
            ctrl.jobsParams.limit = 20;
            if (columnName) {
                ctrl.jobsParams.sortBy = columnName;
            }
            if (ctrl.jobsParams.order == 'asc')
                ctrl.jobsParams.order = 'desc';
            else if (ctrl.jobsParams.order == 'desc')
                ctrl.jobsParams.order = 'asc';
            if (!ctrl.jobsParams.order) {
                ctrl.jobsParams.order = 'asc';
            }
            this.retrieveJobs();
        };
        ctrl.filterUnits = function () {
            if (!ctrl.unitSearchParams) {
                ctrl.unitSearchParams = {};
            }
            ctrl.unitSearchParams.skip = 0;
            ctrl.unitSearchParams.limit = 20;
            ctrl.unitSearchParams.sortBy = 'id';
            ctrl.unitSearchParams.order = 'asc';
            ctrl.unitSearchParams.unassignedUnits = new Date(ctrl.plannerDate).getTime();
            ctrl.retrieveUnits();
        };

        ctrl.retrieveUnits = function () {
            if (!(angular.isDefined(ctrl.unitList)) || ctrl.unitList.length < 1) {
                ctrl.unitList = [];
            }
            if (angular.isDefined(ctrl.unitSearchParams.skip)) {

                VehicleDao.query(ctrl.unitSearchParams).then(function (res) {
                    if (ctrl.unitSearchParams.skip === 0) {
                        ctrl.unitList = [];
                        ctrl.unitSearchParams.skip = res.length;
                    }
                    if (res.length < 1) {
                        ctrl.allUnitsRetrieved = true;
                    }
                    ctrl.unitList = ctrl.unitList.concat(res);
                    ctrl.unitList = ($filter("unique")(ctrl.unitList, "id"));
                    ctrl.unitSearchParams.skip = ctrl.unitList.length;
                });
            }
        };

        ctrl.nextPageForJobs = function () {
            if (!ctrl.allJobsRetrieved) {
                ctrl.retrieveJobs();
            }
        };
        ctrl.nextPageForStaffs = function () {
            if (!ctrl.allStaffsRetrieved) {
                ctrl.retrieveDrivers();
            }
        };
        ctrl.nextPageForUnits = function () {
            if (!ctrl.allUnitsRetrieved) {
                ctrl.retrieveUnits();
            }
        };

        ctrl.changeView = function (type) {
            ctrl.activeView = type;
            if (type === 'drivers') {
                ctrl.filterDrivers();
            }
            if (type === 'jobs') {
                ctrl.filterJobs();
            }
            if (type === 'units') {
                ctrl.filterUnits();
            }
        };
        ctrl.onDropped = function (droppedObj, targetObj) {
            if (ctrl.activeView === 'drivers') {
                ctrl.assignDriverToVehicle(droppedObj, targetObj);
            }
            if (ctrl.activeView === 'jobs') {
                ctrl.assignJobToVehicle(droppedObj, targetObj);
            }
            if (ctrl.activeView === 'units') {
                ctrl.assignUnitToVehicle(droppedObj, targetObj);
            }
        };
        ctrl.assignDriverToVehicle = function (droppedObj, targetObj) {
            var vehicleId;
            if (angular.isDefined(targetObj) && angular.isDefined(targetObj.id)) {
                vehicleId = targetObj.id;
            } else {
                vehicleId = ctrl.vehicleId;
            }
            var data = {
                date: ctrl.plannerDate ? new Date(ctrl.plannerDate).getTime() : '',
                vehicleId: vehicleId
            };
            var param = {
                staffId: droppedObj.id
            };
            PlanningDao.allocateDriverToVehicle(data, param).then(function () {
                if (ctrl.planningView) {
                    ctrl.changePlansOnDate();
                } else {
                    ctrl.getVehiclesWithPlan(ctrl.vehicleType, false);
                }
                ctrl.filterDrivers();
            });
        };
        ctrl.assignJobToVehicle = function (droppedObj, targetObj) {
            var vehicleId;
            if (angular.isDefined(targetObj) && angular.isDefined(targetObj.id)) {
                vehicleId = targetObj.id;
            } else {
                vehicleId = ctrl.vehicleId;
            }
            var data = {
                date: ctrl.plannerDate ? new Date(ctrl.plannerDate).getTime() : '',
                vehicleId: vehicleId
            };
            var param = {
                jobId: droppedObj.id
            };
            PlanningDao.assignJobsToVehicles(data, param).then(function (res) {
                ctrl.refreshData();
                ctrl.filterJobs();
            });
        };
        ctrl.assignUnitToVehicle = function (droppedObj, targetObj) {
            if (targetObj.artic == 'Trailer') {
                var vehicleId;
                if (angular.isDefined(targetObj) && angular.isDefined(targetObj.id)) {
                    vehicleId = targetObj.id;
                } else {
                    vehicleId = ctrl.vehicleId;
                }
                var data = {
                    plandate: ctrl.plannerDate ? new Date(ctrl.plannerDate).getTime() : '',
                    vehicleid: vehicleId
                };
                var param = {
                    unitId: droppedObj.id
                };
                PlanningDao.assignUnitToVehicles(data, param).then(function () {
                    if (ctrl.planningView) {
                        ctrl.changePlansOnDate();
                    } else {
                        ctrl.getVehiclesWithPlan(ctrl.vehicleType, false);
                    }
                    ctrl.filterUnits();
                });
            }
        };
        ctrl.changeView('jobs');
        this.setflag = function () {
            this.setFocus = !this.setFocus;
        }
        ctrl.checkDriverQualification = function (vehicleObj, color) {
            if (vehicleObj != undefined && color != undefined) {
                if (color == 'red') {
                    if (angular.isDefined(ctrl.sizeClassesMap) && angular.isDefined(ctrl.sizeClassesMap[vehicleObj.vehicleSize]) && ctrl.sizeClassesMap[vehicleObj.vehicleSize].length > 0
                            && vehicleObj.vehiclePlans[0] != null && vehicleObj.vehiclePlans[0].staff != null
                            && ctrl.sizeClassesMap[vehicleObj.vehicleSize].indexOf(vehicleObj.vehiclePlans[0].staff.licenceClass) < 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (color == 'green') {
                    if ((vehicleObj.vehiclePlans[0] != null && vehicleObj.vehiclePlans[0].staff != null
                            && (!angular.isDefined(ctrl.sizeClassesMap[vehicleObj.vehicleSize]) || ctrl.sizeClassesMap[vehicleObj.vehicleSize].length == 0 || ctrl.sizeClassesMap[vehicleObj.vehicleSize].indexOf(vehicleObj.vehiclePlans[0].staff.licenceClass) >= 0))) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (color == 'gray') {
                    if (vehicleObj.vehiclePlans[0] == undefined || vehicleObj.vehiclePlans[0].staff == null) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        };
        ctrl.refreshData = function () {
            ctrl.retrieveJobs();
            if (ctrl.planningView) {
                ctrl.changePlansOnDate();
            } else {
                ctrl.vehicleContentSearchParams.skip = 0;
                ctrl.vehicleContentSearchParams.limit = 20;
                ctrl.getVehicleContents(ctrl.vehicleId);
            }
        };
        ctrl.showJobModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/job/views/jobmodal.html',
                controller: 'JobModalController as jobModal',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    jobId: function () {
                        return id;
                    },
                    jobObj: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function () {
                ctrl.refreshData();
            });
        };
        $scope.$on('refresh-jobs', function (event, args) {
            ctrl.refreshData();
        });

        ctrl.unassignDriver = function (vehiclePlanObject) {
            PlanningDao.unassignDriver({id: vehiclePlanObject.id}).then(function () {
                vehiclePlanObject.staff = null;
                ctrl.changeView('drivers');

            });
        };

        ctrl.unassignJob = function (jobId, index) {
            PlanningDao.unassignJob({id: ctrl.vehicleObject.vehiclePlans[0].id, jobid: jobId}).then(function () {
                ctrl.changeView('jobs');
                ctrl.vehicleContentList.splice(index, 1);
                ctrl.refreshData();
            });
        };

        ctrl.unassignUnit = function (vehiclePlanObject) {
            PlanningDao.unassignUnit({id: vehiclePlanObject.id}).then(function () {
                vehiclePlanObject.unitName = null;
                ctrl.changeView('units');
                ctrl.refreshData();
            });
        };
        ctrl.initAccordian = function (index, vehilceType) {
            if (index == 0) {
                ctrl.getVehiclesWithPlan(vehilceType);
            }
        };
    };
    angular.module('tpc.controllers').controller('PlanningController', ['PlanningDao', 'VehicleDao', 'StaffDao', 'JobDao', '$filter', '$sce', '$uibModal', 'VehicleLicenceTypeDao', '$scope', PlanningController]);
})();
