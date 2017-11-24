(function() {
    var closeOnEnter = function($timeout, $compile) {
        return {
            restrict: 'A',
            scope: {
                flag: "="
            },
            link: function(scope, elem, attrs) {
                elem.bind('keydown', function(e) {
                    var code = e.keyCode || e.which;
                    if (code === 13) {
                        e.preventDefault();
                        document.getElementById(attrs.closeenter).click();
                    }
                });
                
                scope.$watch("flag", function(value) {
                    $timeout(function(){
                        elem.focus();
                    });
                });
            }
        };
    };
    angular.module('tpc.directives').directive('closeenter', ['$timeout', '$compile', closeOnEnter]);

})();