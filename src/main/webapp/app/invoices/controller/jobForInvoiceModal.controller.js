(function () {
    var JobInvoiceController = function ($uibModal, InvoiceDao, AlertService, $uibModalInstance, jobInvoiceParam) {
        var ctrl = this;
        ctrl.jobList = jobInvoiceParam.jobInvoiceList;
        ctrl.cusomterId = jobInvoiceParam.customerId;
        ctrl.totalJobValue = 0;
        ctrl.invoiceSubmitted = false;
        angular.forEach(ctrl.jobList, function (job) {
            delete job.checked;
            if (job.priceQuoted != undefined && job.priceQuoted != null) {
                ctrl.totalJobValue += job.priceQuoted;
            }
        });
        this.hideInvoiceModal = function () {
            $uibModalInstance.close();
        }

        ctrl.removeJob = function (indexId, jobobj) {
            ctrl.jobList.splice(indexId, 1);
            if (jobobj.priceQuoted != undefined && jobobj.priceQuoted != null) {
                ctrl.totalJobValue -= jobobj.priceQuoted;
            }
        }

        ctrl.saveInvoice = function () {
            ctrl.invoiceSubmitted = true;
            var invoiceObj = {amount: ctrl.totalJobValue, creationDate: new Date(),
                totalJobs: ctrl.jobList.length,
                customerId: ctrl.cusomterId,
                loadedInSage: false,
                jobList: ctrl.jobList
            };


            InvoiceDao.save(invoiceObj).then(function (res) {
                ctrl.invoiceSubmitted = false;
                $uibModalInstance.close(true);
                AlertService.addMessage({type: 'success', msg: 'Invoice has been created.'});
            }).catch(function () {
                AlertService.addMessage({type: 'danger', msg: 'Invoice could not be created.'});
            }).then(function () {
                ctrl.invoiceSubmitted = false;
            });
        }
    };
    angular.module('tpc.controllers').controller('JobInvoiceController', ['$uibModal', 'InvoiceDao', 'AlertService', '$uibModalInstance', 'jobInvoiceParam', JobInvoiceController]);
})();