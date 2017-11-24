
(function () {
    var StaffDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/staff/:id/:action/:subaction', null, {
            update: {
                method: 'PUT'
            },
            retrieveById: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            },
            getLicenceClass: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'licenceClass'
                }
            },
            getHolidaysById: {
                method: 'GET',
                isArray: true,
                params: {
                    action: 'holidays',
                    id: '@id'
                }
            },
            saveHolidays: {
                method: 'PUT',
                params: {
                    action: 'holidays',
                    id: '@id'
                }
            },
            getAgencies: {
                method: 'GET',
                isArray: true,
                params: {
                    id: 'agencies'
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
            getLicenceClass: function (params) {
                return api.getLicenceClass(params).$promise;
            },
            getHolidaysById: function (params) {
                return api.getHolidaysById(params).$promise;
            },
            getAgencies: function () {
                return api.getAgencies().$promise;
            },
            saveHolidays: function (data) {
                return api.saveHolidays({id: data.id},data.data).$promise;
            }

        };
    };
    angular.module("tpc.service").factory('StaffDao', ['$resource', '$rootScope', StaffDao]);
})();