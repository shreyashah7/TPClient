(function () {
    var CollectionPointDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/collectionPoints/:id/:action/:subaction/', null, {
            update: {
                method: 'PUT'
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
            }
        };
    };
    angular.module("tpc.service").factory('CollectionPointDao', ['$resource', '$rootScope', CollectionPointDao]);
})();