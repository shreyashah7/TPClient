(function () {
    var toggle = function () {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (attrs.toggle == "tooltip") {
                    $(element).tooltip();
                }
                if (attrs.toggle == "popover") {
                    $(element).popover({
                        delay: {show: 50, hide: 100}
                    });
                }
            }
        };
        ;
    };
    angular.module('tpc.directives').directive('toggle', [toggle]);

})();