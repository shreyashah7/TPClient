(function () {
    var VehicleLicenceTypeDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/licenceType/:action/:subaction/:id', null, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                isArray: true
            },
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
            get: function (params) {
                return api.get(params).$promise;
            }
        };
    };
    angular.module("tpc.service").factory('VehicleLicenceTypeDao', ['$resource', '$rootScope', VehicleLicenceTypeDao]);
})();