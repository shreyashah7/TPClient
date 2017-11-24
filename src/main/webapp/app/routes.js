(function () {
    var
            as = angular.module("tpc");
    as.config(function ($routeProvider, $provide, $httpProvider) {
        $routeProvider.when('/', {
            templateUrl: 'app/login/views/login.html',
            controller: 'LoginController as login'
        });
        $routeProvider.when('/planning', {
            templateUrl: 'app/planning/views/planning.html',
            controller: 'PlanningController as planning'
        });
        $routeProvider.when('/customers', {
            templateUrl: 'app/customer/views/customer.html',
            controller: 'CustomerController as customers'
        });
        $routeProvider.when('/staff', {
            templateUrl: 'app/staff/views/staff.html',
            controller: 'StaffController as staff'
        });
        $routeProvider.when('/vehicle', {
            templateUrl: 'app/vehicle/views/vehicle.html',
            controller: 'VehicleController as vehicle'
        });
        $routeProvider.when('/jobs', {
            templateUrl: 'app/job/views/job.html',
            controller: 'JobController as job'
        });
        $routeProvider.when('/invoicing', {
            templateUrl: 'app/invoices/views/invoicing.html',
            controller: 'InvoiceController as invoice'
        });
        $routeProvider.when('/admin/licencetypes', {
            templateUrl: 'app/admin/views/licencetype.html',
            controller: 'LicenceTypeController as licenceType'
        });
        $routeProvider.when('/admin/users', {
            templateUrl: 'app/admin/views/user.html',
            controller: 'UserController as userCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    });
}());
