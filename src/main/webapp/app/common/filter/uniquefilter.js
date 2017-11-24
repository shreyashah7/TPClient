(function () {
    var eocFilters = angular.module("tpc.filters");
    //Filter to format program number
    eocFilters.filter('unique', function () {
        return function (items, filterOn) {
            if (filterOn === false) {
                return items;
            }
            if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
                var newItems = [];
                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                };
                angular.forEach(items, function (item) {
                    var isDuplicate = false;
                    for (var i = 0; i < newItems.length; i++) {
                        //This condition added to ignore null value for filter on for unique filter
                        if (item[filterOn] == null) {
                            isDuplicate = false;
                        } else if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) {
                        newItems.push(item);
                    }
                });
                items = newItems;
            }
            return items;
        };
    });

})();
   