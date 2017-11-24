(function () {
    var ChangePasswordModalController = function ($uibModalInstance, staffId, UserDao, AlertService) {
        var ctrl = this;
        ctrl.submittedFlag = false;
        
        ctrl.changePassword = function (form) {
            ctrl.submittedFlag = true;
            if (form.$valid) {
                if (ctrl.newPassword === ctrl.confirmPassword) {
                    UserDao.changePassword({id: staffId, newPassword: ctrl.newPassword, confirmPassword: ctrl.confirmPassword})
                            .then(function () {
                                $uibModalInstance.close(true);
                                AlertService.addMessage({type: 'success', msg: 'Password changed successfully.'});
                            })
                            .catch(function () {
                                AlertService.addUnautorizedMessage({type: 'danger', msg: 'Password could not be changed.'});
                            });
                }
            }
        };
        ctrl.cancel = function () {
            $uibModalInstance.close(false);
        };
    };
    angular.module('tpc.controllers').controller('ChangePasswordModalController', ['$uibModalInstance', 'staffId', 'UserDao', 'AlertService', ChangePasswordModalController]);
})();