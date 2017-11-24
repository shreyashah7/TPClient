(function () {
    var ConfirmationModalController = function ($uibModalInstance) {
        var ctrl = this;
        ctrl.cancelYes = function () {
            $uibModalInstance.close(true);
        };
        ctrl.cancelNo = function () {
            $uibModalInstance.close(false);
        };
    };
    angular.module('tpc.controllers').controller('ConfirmationModalController', ['$uibModalInstance', ConfirmationModalController]);
})();