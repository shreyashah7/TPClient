(function () {
    var PlanningDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/planning/:id/:action/:jobid/:subaction', null, {
            update: {
                method: 'PUT'
            },
            retrieveById: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            getVehicleByPlanCriteria: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'vehiclePlans'
                }
            },
            retrieveHolidays: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'holidays'
                }
            },
            get: {
                method: 'GET',
                isArray: true
            },
            unassignDriver: {
                method: 'PUT',
                params: {
                    action: 'driver',
                    subaction: 'unassign'
                }
            },
            unassignJob: {
                method: 'PUT',
                params: {
                    action: 'job',
                    subaction: 'unassign'
                }
            },
            getVehicleTypeClasByVehicleType: {
                method: 'GET',
                params: {
                    action: 'vehicleTypeClass'
                }
            },
            unassignUnit: {
                method: 'PUT',
                params: {
                    action: 'unit',
                    subaction: 'unassign'
                }
            }

        });
        return {
            query: function (filter) {
                return api.query(filter).$promise;
            },
            save: function (data) {
                return api.save(data).$promise;
            },
            update: function (data) {
                return api.update({id: data.id}, data).$promise;
            },
            allocateDriverToVehicle: function (pathData, param) {
                var url = resource(rootScope.apiPath + '/planning/:date/vehicle/:vehicleId/driver',
                        {date: pathData.date, vehicleId: pathData.vehicleId}, {
                    allocateDriverToVehicle: {method: 'PUT', params: {staffId: '@staffId'}}
                });
                return url.allocateDriverToVehicle(param).$promise;
            },
            retrieveById: function (params) {
                return api.retrieveById(params).$promise;
            },
            getVehicleByPlanCriteria: function (params) {
                return api.getVehicleByPlanCriteria(params).$promise;
            },
            get: function (params) {
                return api.get(params).$promise;
            },
            retrieveHolidays: function (params) {
                return api.retrieveHolidays(params).$promise;
            },
            assignJobsToVehicles: function (pathData, params) {
                var url = resource(rootScope.apiPath + '/planning/:date/vehicle/:vehicleId/job',
                        {date: pathData.date, vehicleId: pathData.vehicleId}, {
                    assignJobsToVehicles: {method: 'PUT', params: {jobId: '@jobId'}}
                });
                return url.assignJobsToVehicles(params).$promise;
            },
            unassignDriver: function (data) {
                return api.unassignDriver(data, data).$promise;
            },
            unassignJob: function (data) {
                return api.unassignJob(data, data).$promise;
            },
            getVehicleTypeClasByVehicleType: function (data) {
                return api.getVehicleTypeClasByVehicleType(null, data).$promise;
            },
            assignUnitToVehicles: function (pathData, params) {
                var url = resource(rootScope.apiPath + '/planning/:date/vehicle/:vehicleId/unit',
                        {date: pathData.plandate, vehicleId: pathData.vehicleid}, {
                    assignUnitToVehicles: {method: 'PUT', params: {unitId: '@unitId'}}
                });
                return url.assignUnitToVehicles(params).$promise;
            },
            unassignUnit: function (data) {
                return api.unassignUnit(data, data).$promise;
            }
        };
    };
    angular.module("tpc.service").factory('PlanningDao', ['$resource', '$rootScope', PlanningDao]);
})();
