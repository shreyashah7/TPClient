(function () {
    var CustomerDao = function (resource, rootScope) {
       var api = resource(rootScope.apiPath+'/customer/:action/:subaction/:id', null, {
           update: {
                method: 'PUT'
            },
           retrieveById: {
                method: 'GET',
                params: {
                    id: '@id'
                }
            }
        });
        return {
            query: function (filter) {
                return api.query(filter).$promise;
            },
            save: function(data) {
                return api.save(data).$promise;
            },
            update: function(data) {
                return api.update({id: data.id}, data).$promise;
            },
            retrieveById: function (params) {
                return api.retrieveById(params).$promise;
            }
        };
    };
    angular.module("tpc.service").factory('CustomerDao', ['$resource','$rootScope',CustomerDao]);
})();