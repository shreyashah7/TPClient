(function () {
    //Filter to format true false values
    angular.module("tpc.filters").filter('true_false', function () {
        return function (text) {
            if (text==true) {
                return 'Yes';
            }else if(text==false){
                return 'No';
            }
            
            return '';
        };
    });
})();
   