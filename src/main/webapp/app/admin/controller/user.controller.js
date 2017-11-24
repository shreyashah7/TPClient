(function () {
    var UserController = function (UserDao, AlertService, $scope, $location, $filter, $uibModal) {
        var ctrl = this;
        ctrl.userList = [];
        ctrl.searchParams = {skip: 0, limit: 20};
        ctrl.allDateRetrieved = false;
        //To add new row
        ctrl.addNewRow = function (form) {
            if (ctrl.userList.length > 0) {
                ctrl.userFormSubmitted = true;
                if (form.$valid) {
                    ctrl.userFormSubmitted = false;
                    ctrl.userList.unshift({active: true});
                }
            } else {
                ctrl.userFormSubmitted = false;
                ctrl.userList.unshift({active: true});
            }
            ctrl.scrollFlag = true;
        };
        ctrl.retrieveAllUsers = function () {
            UserDao.get(ctrl.searchParams).then(function (data) {
                if (data.length < 1) {
                    ctrl.allDateRetrieved = true;
                }
                ctrl.userList = ctrl.userList.concat(data);
                ctrl.userList = ($filter("unique")(ctrl.userList, "id"));
                ctrl.searchParams.skip = ctrl.userList.length;
            }).catch(function (e) {
                console.log("Failed to retrieve users");
            });
        }
        ctrl.nextPage = function () {
            if (!ctrl.allDateRetrieved) {
                ctrl.retrieveAllUsers();
            }
        };
        ctrl.initialRetrieval = function () {
            ctrl.allDateRetrieved = false;
            ctrl.userList = [];
            ctrl.searchParams.skip = 0;
            ctrl.retrieveAllUsers();
        };
        ctrl.userChange = function (user) {
            user.dirty = true;
        }
        //To save users
        ctrl.saveUsers = function (form) {
            ctrl.formObj = form;
            ctrl.userFormSubmitted = true;
            if (form.$valid) {
                var usersToSave = [];
                angular.forEach(ctrl.userList, function (user) {
                    if(!!user.emailIdUnavailable){
                        return;
                    }
                    if (!!user.dirty) {
                        var userToSave = angular.copy(user);
                        delete userToSave.emailIdUnavailable;
                        delete userToSave.conflictedUserId;
                        delete userToSave.dirty;
                        usersToSave.push(userToSave);
                    }
                });
                if (usersToSave.length > 0) {
                    ctrl.saveDisabled = true;
                    UserDao.update(usersToSave).then(function (res) {
                        AlertService.addMessage({type: 'success', msg: 'Users have been saved.'});
                        ctrl.initialRetrieval();
                    }).catch(function (response) {
                        AlertService.addUnautorizedMessage({type: 'danger', msg: 'Users cannot be saved.'});
                    }).then(function () {
                        ctrl.saveDisabled = false;
                    });
                }
            }
        };

        //confirmation modal logic
        ctrl.showConfirmation = true;
        $scope.$on('$locationChangeStart', function (event, newURL) {
            var locationToMove;
            if (newURL.lastIndexOf("#/") >= 0) {
                locationToMove = newURL.substring(newURL.lastIndexOf("#/") + 1);
            } else {
                locationToMove = "/";
            }
            var formDirty = false;
            angular.forEach(ctrl.userList, function (user) {
                if (!!user.dirty) {
                    formDirty = true;
                }
            });
            if (formDirty && ctrl.showConfirmation) {
                ctrl.showConfirmationModal(locationToMove);
                event.preventDefault();
            }
        });

        ctrl.showConfirmationModal = function (locationToMove) {
            var modalInstance = $uibModal.open({
                animation: true,
                keyboard: false,
                templateUrl: 'app/common/views/confirmationmodal.html',
                controller: 'ConfirmationModalController as confirmationModal',
                backdrop: 'static',
                size: 'confirmation'
            });
            modalInstance.result.then(function (ok) {
                ctrl.showConfirmation = !ok;
                if (ok) {
                    $location.path(locationToMove);
                }
            });
        };

        ctrl.showChangePasswordModal = function (staffId) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/admin/views/changepasswordmodal.html',
                controller: 'ChangePasswordModalController as changePasswordModal',
                backdrop: 'static',
                size: 'confirmation',
                resolve: {
                    staffId: function () {
                        return staffId;
                    }
                }
            });
            modalInstance.result.then(function (ok) {
                if (ok) {
                    ctrl.initialRetrieval();
                }
            });
        };
        ctrl.checkEmailIdAvailability = function (changedUser, index) {
            changedUser.dirty = true;
            if (changedUser.email && changedUser.email !== '') {
                var dirtyUserIds = [];
                for (var i = 0; i < ctrl.userList.length; i++) {
                    var user = ctrl.userList[i];
                    if (!!user.dirty) {
                        if (index !== i && changedUser.id === user.conflictedUserId && changedUser.email !== user.email) {
                            user.emailIdUnavailable = false;
                            delete user.conflictedUserId;
                        }
                    }
                }
                for (var i = 0; i < ctrl.userList.length; i++) {
                    var user = ctrl.userList[i];
                    if (!!user.dirty) {
                        if (user.id) {
                            dirtyUserIds.push(Number(user.id));
                        }
                    }
                    if (index !== i && changedUser.email === user.email) {
                        changedUser.emailIdUnavailable = true;
                        changedUser.conflictedUserId = user.id;
                        return;
                    }
                }
                if (dirtyUserIds.length > 0) {
                    var data = {ids: dirtyUserIds, email: changedUser.email}
                    UserDao.checkAvailability(data).then(function (res) {
                        if (res.count > 0) {
                            changedUser.emailIdUnavailable = true;
                        } else {
                            changedUser.emailIdUnavailable = false;
                        }
                    });
                } else {
                    changedUser.emailIdUnavailable = false;
                }
            } else {
                changedUser.emailIdUnavailable = false;
            }
        };
    };
    angular.module('tpc.controllers').controller('UserController', ['UserDao', 'AlertService', '$scope', '$location', '$filter', '$uibModal', UserController]);
})();
