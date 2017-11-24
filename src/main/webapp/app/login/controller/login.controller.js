(function () {
    function LoginController($rootScope, $http, LoginDao) {
        this.isError = false;
        var ctrl = this;
        this.errorMessage = '';
        this.userObject = {};
        var data = localStorage.getItem('usera');
        data = JSON.parse(data);
        $rootScope.pingServer();
        if (data !== null) {
            if (!!data.rememberme) {
                this.userObject.rememberme = data.rememberme;
                this.userObject.emailId = data.emailId;
                this.userObject.password = $rootScope.encryptPass(data.password, false)
            }
        }
        this.doLogin = function (userObject, loginform) {
            this.loginSubmitted = true;
            this.isError = false;
            if (loginform.$valid) {
                console.log("run : login request event");
                var payload = $.param({
                    dsfkdsa: userObject.emailId,
                    ekwdhwe: userObject.password,
                    zxcewnm: userObject.rememberme
                });
                LoginDao.loginUser(payload).then(function (res) {
                    console.log("run : login request event : post sucess : ");
                    if (!!userObject.rememberme) {
                        var user = {
                            emailId: userObject.emailId,
                            password: $rootScope.encryptPass(userObject.password, true),
                            rememberme: userObject.rememberme
                        };
                        localStorage.setItem('usera', JSON.stringify(user));
                    } else {
                        localStorage.removeItem('usera');
                    }
                    $rootScope.pingServer();
                }).catch(function (data) {
                    console.log(data);
                    if (data != null) {
                        ctrl.errorMessage = data.data;
                    }
                    ctrl.isError = true;
                });
            }
        };
    }
    angular.module('tpc.controllers').controller('LoginController', ['$rootScope', '$http', 'LoginDao', LoginController]);
})();
