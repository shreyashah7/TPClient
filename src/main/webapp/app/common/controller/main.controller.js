(function () {
    var mainController = function ($scope, $location, $rootScope, $timeout, LoginDao) {
        // added for pass encryption 
        $rootScope.printableChars = '~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?`1234567890-=qwertyuiop[]\\asdfghjkl;\'zxcvbnm,./';
        $scope.isCurrent = function (path, strictMatch) {
            if ((path === '/home') && $location.path() === "/") {
                return true;
            } else {
                if (strictMatch != null && strictMatch) {
                    var currentPath = $location.path();
                    if ($location.path().lastIndexOf("/") != 0) {
                        currentPath = $location.path().substr(0, $location.path().lastIndexOf("/"));
                    }
                    if (currentPath == path) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if ($location.path().substr(0, path.length) === path) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        $scope.$watch("alerts", function (alerts) {
            if (alerts != null && alerts.length > 0) {
                $timeout(function () {
                    alerts[0].expired = true;
                    $timeout(function () {
                        $rootScope.alerts = [];
                    }, 3000);
                }, 3000);
            }
        }, true);
        $scope.$watch("unAuthorizedAlerts", function (alerts) {
            if (alerts != null && alerts.length > 0) {
                $timeout(function () {
                    alerts[0].expired = true;
                    $timeout(function () {
                        $rootScope.unAuthorizedAlerts = [];
                    }, 3000);
                }, 3000);
            }
        }, true);
        $rootScope.encryptPass = function (password, isEnctrypt) {
            if (password !== null && password !== undefined && password !== "")
            {
                var passLength = password.length;
                var newPass = "";
                for (var i = 0; i < passLength; i++)
                {
                    var temp = password.charAt(i);
                    var index = $rootScope.printableChars.indexOf(temp);
                    if (index !== -1) {
                        if (isEnctrypt) {
                            index += (i + passLength);
                            if (index >= ($rootScope.printableChars.length)) {
                                index -= ($rootScope.printableChars.length);
                            }
                        } else {
                            index -= (i + passLength);
                            if (index < 0) {
                                index += ($rootScope.printableChars.length);
                            }
                        }
                        temp = $rootScope.printableChars.charAt(index);
                        newPass += temp;
                    } else {
                        newPass += temp;
                    }
                }
                return newPass;
            } else {
                return password;
            }
        };
        $rootScope.logout = function () {
            LoginDao.logoutUser().then(function (res) {
                $rootScope.isLogin = false;
                $rootScope.currentUser = undefined;
                document.cookie = "companyId" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                $rootScope.showLogin();
            });
        };

        /**
         * On 'event:loginConfirmed', resend all the 401 requests.
         */
        $rootScope.$on('event:loginConfirmed', function () {
            console.log("run : login confirmed event");
            $rootScope.isLogin = true;
            $rootScope.goHome(); // if you want to redirect to home page
        });
        $rootScope.goHome = function ()
        {
            if ($location.path() === "/") {
                $location.path('/planning');
            }
        };
        $rootScope.pingServer = function () {
            if ($location.$$path !== '/recoverpwd') {
                LoginDao.getLoggedInUser().then(function (data) {
                    $rootScope.currentUser = data.currentUser;
                    $rootScope.$broadcast('event:loginConfirmed');
                }).catch(function (data) {
                    console.log('error')
                });
            }
            ;
        };
        $rootScope.showLogin = function () {
            $timeout(function () {
                $rootScope.isLogin = undefined;
                $rootScope.currentUser = null;
                $location.path('/');
            });
        };
        $rootScope.pingServer();
    };

    angular.module('tpc.controllers').controller('MainController', ['$scope', '$location', '$rootScope', '$timeout', 'LoginDao', mainController]);
})();
