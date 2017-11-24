(function () {
    var CollectionController = function ($uibModal, CollectionPointDao, AlertService, $uibModalInstance, collectionParam) {
        var ctrl = this;
        ctrl.collectionObj = {};
        ctrl.collectionObj.pointType = collectionParam.type;
        ctrl.collectionObj.customerId = collectionParam.company;
        this.hideCollectionModal = function () {
            $uibModalInstance.close(collectionParam.jobObj, ctrl.collectionObj.pointType);
            if (collectionParam.jobId == undefined || collectionParam.jobId == null) {
                ctrl.showJobModal();
            } else {
                ctrl.showJobModal(collectionParam.jobId)
            }
        }

        ctrl.saveCollection = function (form) {
            ctrl.collectionSubmitted = true;
            if (form.$valid) {
                ctrl.saveDisabled = true;
                CollectionPointDao.save(ctrl.collectionObj).then(function (res) {
                    if (res.pointType == 'C') {
                        collectionParam.jobObj.collectionPointId = res.id;
                    } else {
                        collectionParam.jobObj.deliveryPointId = res.id;
                    }
                    ctrl.showJobModal(collectionParam.jobId);
                    $uibModalInstance.close(collectionParam.jobObj, res.pointType, res.id);
                    AlertService.addMessage({type: 'success', msg: 'Collection has been created.'});
                }).catch(function () {
                    AlertService.addMessage({type: 'danger', msg: 'Collection could not be created.'});
                }).then(function () {
                    ctrl.saveDisabled = false;
                });
            }

        }

        ctrl.showJobModal = function (id) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/job/views/jobmodal.html',
                controller: 'JobModalController as jobModal',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    jobObj: function () {
                        return collectionParam.jobObj;
                    },
                    jobId: function () {
                        return null;
                    }
                }
            });
            modalInstance.result.then(function () {
            });
        };

    };
    angular.module('tpc.controllers').controller('CollectionController', ['$uibModal', 'CollectionPointDao', 'AlertService', '$uibModalInstance', 'collectionParam', CollectionController]);
})();