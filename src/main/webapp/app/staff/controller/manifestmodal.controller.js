(function () {
    var ManifestModalController = function ($uibModalInstance, staffId) {
        var ctrl = this;
        //date picker options
        ctrl.selectedStaffId = staffId;
        ctrl.manifestDate = new Date(new Date().setDate(new Date().getDate()+1 ));
        this.open = {
            dateOfBirth: false,
            employmentDate: false,
            eyeTest: false
        };
        ctrl.openCalendar = function (e, date) {
            ctrl.open[date] = true;
        };
        ctrl.closeCalendar = function (e, date) {
            ctrl.open[date] = false;
        };
        ctrl.hideManifestModal = function () {
            $uibModalInstance.close();
        };
    };
    angular.module('tpc.controllers').controller('ManifestModalController', ['$uibModalInstance', 'staffId', ManifestModalController]);
})();



