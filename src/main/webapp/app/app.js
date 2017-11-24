(function () {
    var
            //Define the main module.
            as = angular.module("tpc", ["ngRoute", "tpc.controllers", "tpc.directives", "tpc.service", "tpc.filters", "ui.bootstrap", "infinite-scroll", "ui.bootstrap.datetimepicker", "gm.datepickerMultiSelect"]);

    as.config(function ($provide, $httpProvider) {
        // added for handling httpRequest
        var httpRequests = new Array();
        $provide.factory('HttpRequestResponseInterceptor', ['$rootScope', '$q', '$location', 'AlertService', function (rootScope, q, $location, AlertService) {
                rootScope.apiPath = "api";
                rootScope.angularDateFormat = 'dd/MM/yy';
                rootScope.angularDateTimeFormat = 'dd/MM/yy hh:mm a';
                rootScope.emailFormat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
                var DUPLICATED_REQUEST_STATUS_CODE = 499; // I just made it up - nothing special
                var EMPTY_BODY = '';
                var EMPTY_HEADERS = {};

                // previous stuff here

                function buildRejectedRequestPromise(requestConfig) {
                    var dfd = q.defer();
                    // build response for duplicated request
                    var response = {data: EMPTY_BODY, headers: EMPTY_HEADERS, status: DUPLICATED_REQUEST_STATUS_CODE, config: requestConfig};
                    // reject promise with response above
                    dfd.reject(response);
                    return dfd.promise;
                }
                return {
                    // On request success
                    request: function (config) {
                        //return for template requests
                        if (config.url.indexOf("views/") >= 0) {
                            if (!config.params) {
                                config.params = {};
                            }
                            config.params['version'] = 'v$VERSION$';
                        }
                        if (config.url.indexOf("template") >= 0) {
                            return config;
                        }
                        // Contains the data about the request before it is sent.
                        if ((!!httpRequests[config.url + JSON.stringify(config.params)]))
                        {
                            return buildRejectedRequestPromise(config);
                        } else {
                            httpRequests[config.url + JSON.stringify(config.params)] = config;
                        }
                        // Return the config or wrap it in a promise if blank.
                        return config || q.when(config);
                    },
                    // On request failure
                    requestError: function (rejection) {
                        // Return the promise rejection.
                        return q.reject(rejection);
                    },
                    // On response success
                    response: function (response, headers) {
                        httpRequests[response.config.url + JSON.stringify(response.config.params)] = undefined;
                        // Return the response or promise.
                        return response || q.when(response);
                    },
                    // On response failture
                    responseError: function (response) {
                        httpRequests[response.config.url + JSON.stringify(response.config.params)] = undefined;
                        var status = response.status;
                        var deferred = q.defer();
                        if (status !== DUPLICATED_REQUEST_STATUS_CODE) // if request rejected by our duplication handler 
                        {
                            httpRequests[response.config.url + response.config.params] = undefined;
                        }
                        if (response.config.url.indexOf(rootScope.apiPath + "/authenticateUser") < 0) {
                            if (status === 401) {
                                rootScope.isLogin = false;
                                rootScope.showLogin();
                                return deferred.promise;
                            }
                        }
                        if (response.config.url.indexOf("api/") >= 0 && (status === 404 || status === 503)) {
                            AlertService.addUnautorizedMessage({type: 'danger', msg: 'Server Connection lost, try again.'});
                            return deferred.promise;
                        }
                        // Return the promise rejection.
                        return q.reject(response);
                    }
                };
            }]);

        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('HttpRequestResponseInterceptor');
        $httpProvider.interceptors.push(['$rootScope', '$window', function ($rootScope, $window) {
                return {
                    request: function (config) {
                        config.headers = config.headers || {};
                        config.withCredentials = true;
                        $httpProvider.defaults.useXDomain = true;
                        delete $httpProvider.defaults.headers.common['X-Requested-With'];
                        return config;
                    }
                }
            }]);
    });
    as.run(['$rootScope', '$uibModalStack', function ($rootScope, $uibModalStack) {
            $rootScope.$on('$routeChangeStart', function (event, next, current) {
                $uibModalStack.dismissAll();
            });

        }]);
}());
