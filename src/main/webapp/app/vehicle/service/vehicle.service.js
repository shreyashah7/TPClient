(function () {
    var VehicleDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/vehicle/:action/:subaction/:id', null, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                isArray: true
            },
            retrieveById: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            getVehicleTypes: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'vehicleTypes'
                }
            },
            getAgencies: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'agencies'
                }
            },
            getVehicleSize: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'vehicleSize'
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
            retrieveById: function (params) {
                return api.retrieveById(params).$promise;
            },
            get: function (params) {
                return api.get(params).$promise;
            },
            getVehicleTypes: function () {
                return api.getVehicleTypes().$promise;
            },
            getAgencies: function () {
                return api.getAgencies().$promise;
            },
            getVehicleSize: function () {
                return api.getVehicleSize().$promise;
            }
        };
    };
    angular.module("tpc.service").factory('VehicleDao', ['$resource', '$rootScope', VehicleDao]);
})();