(function () {

    var chosenDirective = function (timeout) {
        return {
            restrict: 'A',
            scope: {ngModel: "=", ngDisabled: "=", chosenDirective: "=", chosenOpen: "=", chosenSearch: "="},
            link: function (scope, element, attrs) {
                timeout(function () {
                    scope.$watch("ngModel", function (value) {
                        if (value) {
                            timeout(function () {
                                $(element).trigger("chosen:updated");
                            });
                        }
                        else {
                            element.trigger("chosen:updated");
                        }
                    }, true);
                    if (attrs.chosenOpen != null) {
                        scope.$watch("chosenOpen", function (value) {
                            if (value) {
                                element.trigger('chosen:open');
                            }
                        });
                    }
                    $(element).on('chosen:hiding_dropdown', function (evt, params) {
                        $(".open").find(".filter-dropdown").dropdown("toggle");
                    });
                    if (attrs.chosenSearch != undefined && attrs.chosenSearch != null && (attrs.chosenSearch == true || attrs.chosenSearch == 'true')) {
                        $(element).chosen({disable_search_threshold: 0, disable_search: false});
                    } else {
                        $(element).chosen({disable_search_threshold: 10, disable_search: true});
                    }
                    scope.$watch("ngDisabled", function (value) {
                        element.trigger("chosen:updated");
                    });
                    scope.$watch("chosenDirective", function (value) {
                        if (value) {
                            timeout(function () {
                                element.trigger("chosen:updated");
                            });
                        }
                    }, true);
                    timeout(function () {
                        element.trigger("chosen:updated");
                    });

                });
            }
        };
    };
    angular.module('tpc.directives').directive('chosenDirective', ['$timeout', chosenDirective]);
})();