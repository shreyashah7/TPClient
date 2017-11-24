(function () {
    var AbsenceModalController = function ($uibModalInstance, staffId, StaffDao, AlertService) {
        var ctrl = this;
        //date picker options
        ctrl.selectedStaffId = staffId;
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
        ctrl.hideAbsenceModal = function () {
            $uibModalInstance.close();
        };
        ctrl.selectedDates = [];
        ctrl.getHolidaysById = function () {
            StaffDao.getHolidaysById({id: staffId}).then(function (res) {
                if (res.length > 0) {
                    angular.forEach(res, function (obj) {
                        ctrl.selectedDates.push(new Date(obj).setHours(0, 0, 0, 0));
                    });
                }
            });
        };
        ctrl.saveHolidays = function () {
            StaffDao.saveHolidays({id: staffId, data: ctrl.selectedDates}).then(function (res) {
                AlertService.addMessage({type: 'success', msg: 'Absent recorded successfully.'});
                ctrl.hideAbsenceModal();
            }).catch(function () {
                AlertService.addMessage({type: 'error', msg: 'Absent cannot be recorded.'});
            });
        };
        ctrl.getHolidaysById();

    };
    angular.module('tpc.controllers').controller('AbsenceModalController', ['$uibModalInstance', 'staffId', 'StaffDao', 'AlertService', AbsenceModalController]);
})();



