(function () {
    var dropdownDir = function ($timeout) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    $(element).find("input,.input-group-addon,select,.chosen-container").click(function (e) {
                        e.stopPropagation();

                    });
                });
            }
        };
    };
    angular.module('tpc.directives').directive('tpcDropdown', ['$timeout',dropdownDir]);

})();