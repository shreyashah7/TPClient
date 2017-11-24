(function () {
    var modalDir = function ($timeout) {
        return {
            restrict: "A",
            scope: {
                modalVisible: "="
            },
            link: function (scope, element, attrs) {

                $(element).modal({
                    backdrop: "static",
                    keyboard: false
                });
                //Hide or show the modal
                scope.showModal = function (visible) {
                    if (visible)
                    {
                        element.modal("show");
                        $timeout(function () {
                            $(element).find(".tcp-scrollable-modal").scrollTop(0);
                        }, 300)
                    }
                    else
                    {
                        element.modal("hide");
                        $('.modal-backdrop').remove();
                    }
                }
                //Check to see if the modal-visible attribute exists
                if (!attrs.modalVisible)
                {
                    //The attribute isn't defined, show the modal by default
                    scope.showModal(true);
                }
                else
                {
                    //Watch for changes to the modal-visible attribute
                    scope.$watch("modalVisible", function (newValue, oldValue) {
                        scope.showModal(newValue);
                    });
                    //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                    element.bind("hide.bs.modal", function () {
                        scope.modalVisible = false;
                        if (!scope.$$phase && !scope.$root.$$phase)
                            scope.$apply();
                    });
                }
            }
        };
    };
    angular.module('tpc.directives').directive('modalShow', ['$timeout', modalDir]);
})();