(function () {
    var JobDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/job/:id/:action/:subaction/', null, {
            update: {
                method: 'PUT'
            },
            changeStatus: {
                method: 'PUT'
            },
            getVehicleTypes: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'vehicleTypes'
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
            get: function (data) {
                return api.get(data).$promise;
            },
            update: function (data) {
                return api.update({id: data.id}, data).$promise;
            },
            changeStatus: function (data) {
                return api.changeStatus(data, null).$promise;
            },
            getVehicleTypes: function () {
                return api.getVehicleTypes().$promise;
            },
            getVehicleSize: function () {
                return api.getVehicleSize().$promise;
            }
        };
    };
    angular.module("tpc.service").factory('JobDao', ['$resource', '$rootScope', JobDao]);
})();