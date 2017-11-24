(function () {
    var AlertService = function ($rootScope) {
        this.addMessage = function (alertMessage) {
            var alerts = [];
            alerts.push(alertMessage);
            $rootScope.alerts = alerts;

        };

        this.addUnautorizedMessage = function (alertMessage) {
            var alerts = [];
            alerts.push(alertMessage);
            $rootScope.unAuthorizedAlerts = alerts;

        };
    };
    angular.module("tpc.service").service('AlertService', ['$rootScope', AlertService]);
})();