(function () {
    var JobController = function (JobDao, $filter, $uibModal, $scope) {
        var ctrl = this;
        ctrl.acceptStatusChanged = false;
        this.allJobsRetrieved = false;
        var defaultSearchParams = {skip: 0, limit: 50};
        ctrl.orderColumn = {sortBy: 'id', order: 'desc'};
        ctrl.statusList = ['New', 'Assigned', 'Delivered', 'Invoiced', 'Quoting'];
        //date picker options
        ctrl.open = {
            collectionDateTime: false,
            deliveryDateTime: false,
            filterCollectionFromDateTime: false,
            filterCollectionToDateTime: false
        };
        ctrl.setFilterFlags = function (flag) {
            if (ctrl.searchParams[flag] == null || ctrl.searchParams[flag] == false) {
                ctrl.searchParams[flag] = true;
                if (flag == 'uninvoiced') {
                    ctrl.searchParams.undelivered = null;
                    ctrl.searchParams.expiredJob = null;
                }
                if (flag == 'expiredJob') {
                    ctrl.searchParams.undelivered = null;
                    ctrl.searchParams.uninvoiced = null;
                }
                if (flag == 'undelivered') {
                    ctrl.searchParams.uninvoiced = null;
                    ctrl.searchParams.expiredJob = null;
                }
            } else if (ctrl.searchParams[flag] == true) {
                ctrl.searchParams[flag] = null;
            }

            ctrl.searchJobs();
        };
        ctrl.searchParams = angular.copy(defaultSearchParams);
        ctrl.searchJobs = function () {
            ctrl.responseComplete = false;
            ctrl.allJobsRetrieved = false;
            ctrl.searchParams.skip = defaultSearchParams.skip;
            ctrl.jobList = [];
            angular.extend(ctrl.searchParams, ctrl.orderColumn);
            ctrl.retrieveResults();
        };
        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
        };
        ctrl.acceptStatus = function (id, jobObj) {
            ctrl.acceptStatusChanged = true;
            JobDao.changeStatus({id: id, action: 'accept'}).then(function () {
                jobObj.status = 'New';
                ctrl.searchJobs();
                ctrl.acceptStatusChanged = false;
            });
        };
        ctrl.unacceptStatus = function (id, jobObj) {
            ctrl.acceptStatusChanged = true;
            JobDao.changeStatus({id: id, action: 'unaccept'}).then(function () {
                jobObj.status = 'Quoting';
                ctrl.searchJobs();
                ctrl.acceptStatusChanged = false;
            });
        }
        ctrl.retrieveResults = function () {
            if (ctrl.searchParams.skip != null) {
                var searchParams = angular.copy(ctrl.searchParams);
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
                if (searchParams.expiredJob == null) {
                    searchParams.expiredJob = false;
                }
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
        };
        ctrl.nextPageForJobs = function () {
            if (!ctrl.allJobsRetrieved) {
                ctrl.retrieveResults();
            }
        };
        ctrl.showJobModal = function (id) {
            if (!ctrl.acceptStatusChanged) {
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
                });
            }
        };
        $scope.$on('refresh-jobs', function (event, args) {
            ctrl.searchJobs();
        });
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
            ctrl.searchJobs();
        };
        ctrl.setflag = function () {
            ctrl.setFocus = !ctrl.setFocus;
        };
        ctrl.searchJobs();
    };
    angular.module('tpc.controllers').controller('JobController', ['JobDao', '$filter', '$uibModal', '$scope', JobController]);
})();