(function () {
    var LoginDao = function (resource, rootScope) {
        var api = resource(rootScope.apiPath + '/:action/:subaction', null, {
            loginUser: {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: {
                    action: 'authenticateUser'
                }
            },
            logoutUser: {
                method: 'POST',
                params: {
                    action: 'unauthenticateUser'
                }
            },
            getLoggedInUser: {
                method: "GET",
                params: {
                    action: 'common',
                    subaction: 'session'
                }
            }

        });
        return {
            loginUser: function (data) {
                return api.loginUser(data).$promise;
            },
            logoutUser: function (data) {
                return api.logoutUser(data).$promise;
            },
            getLoggedInUser: function () {
                return api.getLoggedInUser().$promise;
            }

        };
    };
    angular.module("tpc.service").factory('LoginDao', ['$resource', '$rootScope', LoginDao]);
})();
