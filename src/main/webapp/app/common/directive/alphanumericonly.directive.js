(function () {
    var alphaNumericOnlyDir = function ($parse) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^0-9a-zA-Z ]+/g, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    }
    angular.module('tpc.directives').directive('alphanumericOnly', [alphaNumericOnlyDir]);
})();
