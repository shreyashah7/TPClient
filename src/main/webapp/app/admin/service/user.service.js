(function () {
    var UserDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/users/:id/:action/:subaction', null, {
            update: {
                method: 'PUT'
            },
            get: {
                method: 'GET',
                isArray: true
            },
            changePassword: {
                method: 'PUT',
                params: {
                    action: 'changepassword',
                    id: '@id'
                }
            },
            checkAvailability: {
                method: 'POST',
                params: {
                    action: 'available',
                },
                transformResponse: function (response) {
                    response = {"count": response};
                    return response;
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
            get: function (params) {
                return api.get(params).$promise;
            },
            changePassword: function (data) {
                return api.changePassword({id: data.id}, data).$promise;
            },
            checkAvailability: function (data) {
                return api.checkAvailability({email:data.email},data.ids).$promise;
            }
        };
    };
    angular.module("tpc.service").factory('UserDao', ['$resource', '$rootScope', UserDao]);
})();