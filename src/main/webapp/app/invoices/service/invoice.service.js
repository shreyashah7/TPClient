(function () {
    var InvoiceDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/invoices/:id/:action/:subaction/', null, {
            update: {
                method: 'PUT'
            },
            loadInSage: {
                method: 'PUT',
                params: {
                    action: 'sage'
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
            loadInSage: function (data) {
                return api.loadInSage({id: data.id, loaded: data.loadedInSage},{}).$promise;
            }
        };
    };
    angular.module("tpc.service").factory('InvoiceDao', ['$resource', '$rootScope', InvoiceDao]);
})();