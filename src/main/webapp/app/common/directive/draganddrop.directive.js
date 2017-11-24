(function () {
    var dragaableObject;
    var dragabbleDir = function () {
        return {
            restrict: 'A',
            scope: {
                draggableModelList: '=',
                droppableModelList: '=',
                onDropped: '=',
                accordian: "="
            },
            link: function (scope, element, attrs) {
                var image;
                if (attrs.image != null) {
                    image = attrs.image;
                }
                if (attrs.dragabble) {
                    $(element).find('td').each(function () {
                        $(this).attr('element-index', $(element).index());
                        $(this).draggable({
                            helper: function () {
                                return $("<img src='" + image + "' style='height:70px;width:70px'/>");
                            },
                            start: function (event, ui) {
                                dragaableObject = scope.draggableModelList[$(this).attr('element-index')];
                            },
                            cursorAt: {left: 35, top: 35},
                            appendTo: 'body',
                            refreshPositions :true
                        });
                    });
                }
                ;
                if (attrs.droppable) {
                    $(element).find('td').each(function () {
                        $(this).attr('element-index', $(element).index());
                        $(this).droppable(
                                {drop: function (event, ui) {
                                        if (scope.onDropped != null) {
                                            var targetObj;
                                            if (scope.droppableModelList != undefined && scope.droppableModelList != null) {
                                                targetObj = scope.droppableModelList[$(this).attr('element-index')];
                                            }
                                            $('.popover').popover('hide');
                                            scope.onDropped(dragaableObject, targetObj);
                                        }
                                    }
                                }
                        );
                    });
                }
                if (attrs.accordian != null) {
                    $(element).droppable({
                        over: function (event, ui) {
                            console.log("hovered")
                            console.log($(element).closest(".accordion-header").hasClass('panel-open'));
                            if (!$(element).closest(".accordion-header").hasClass('panel-open')) {
                                $(element).click();
                            }
                        }                        
                    });
                }
            }
        };
    };
    angular.module('tpc.directives').directive('dragdrop', [dragabbleDir]);
})();