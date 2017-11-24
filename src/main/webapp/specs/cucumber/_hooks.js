var configFile = require("./../common/defaults");
var CommonDao = require("./../common/commondao");
var ScenarioTags = require("./../constants/scenariotags");
var JobMother = require("./../object-mothers/jobmother");
var VehicleMother = require("./../object-mothers/vehiclemother");
var StaffMother = require("./../object-mothers/staffmother");
var CustomerMother = require("./../object-mothers/customermother");
var CollectionPointMother = require("./../object-mothers/collectionpointmother");
var UserMother = require("./../object-mothers/usermother");

module.exports = function () {

    //beforefeatures hook to create testdata..
    this.registerHandler('BeforeFeatures', function (event, callback) {
        var customerNames = [];
        var customerEmails = [];
        var jobs = [];
        var staffs = [];
        var vehicles = [];
        var vehicleLicenceClass = [];
        var licenceNumber = [];
        var vehicleReg = [];
        var planDates = [];
        var emails = [];
        emails.push(ScenarioTags.userTags.newEmailId);
        emails.push(ScenarioTags.loginTags.invalidCredentials);
        vehicleReg.push(ScenarioTags.vehicleTags.editVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.editedVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.filterVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.sortingVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.newVehicleScenario);
        vehicleReg.push(ScenarioTags.vehicleTags.vehicleReg);
        vehicleReg.push(ScenarioTags.vehicleTags.unitVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.trailerVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.unitTabVehicle);
        vehicleReg.push(ScenarioTags.vehicleTags.rigidVehicle);
        vehicleReg.push(ScenarioTags.staffTags.validLicenceVehicle);
        vehicleReg.push(ScenarioTags.planningTags.unAssignUnit);
        licenceNumber.push(ScenarioTags.staffTags.licenceNumber);
        vehicleLicenceClass.push(ScenarioTags.vehicleTypeLicenceTags.licenceClass);
        vehicleLicenceClass.push(ScenarioTags.vehicleTags.licenceClass);
        vehicleLicenceClass.push(ScenarioTags.staffTags.validLicenceVehicle);
        vehicleLicenceClass.push(ScenarioTags.staffTags.invalidLicenceVehicle);
        vehicleLicenceClass.push(configFile.vehicleTypePrefix + "1");
        vehicleLicenceClass.push(configFile.vehicleTypePrefix + "2");
        vehicleLicenceClass.push(configFile.vehicleTypePrefix + "3");
        for (var i = configFile.dummyDataSize; i > 0; i--) {
            vehicleLicenceClass.push(configFile.licenceClassPrefix + i);
            vehicleLicenceClass.push(configFile.driverPrefix + i);
        }
        vehicles.push(ScenarioTags.vehicleTags.vehicleSize);
        staffs.push(ScenarioTags.staffTags.paging);
        staffs.push(ScenarioTags.staffTags.driverName);
        staffs.push(ScenarioTags.staffTags.driverName1);
        staffs.push(ScenarioTags.staffTags.newStaffScenario);
        staffs.push(ScenarioTags.staffTags.editStaff);
        staffs.push(ScenarioTags.staffTags.filterStaff);
        staffs.push(ScenarioTags.staffTags.editedStaff);
        staffs.push(ScenarioTags.staffTags.validLicenceDriver);
        staffs.push(ScenarioTags.staffTags.staffManifestDate);
        customerNames.push(ScenarioTags.jobTags.paging);
        customerNames.push(ScenarioTags.jobTags.customerFilter);
        customerNames.push(ScenarioTags.jobTags.uniqueCustName);
        customerNames.push(ScenarioTags.jobTags.cancelCustname);
        customerNames.push(ScenarioTags.jobTags.job_sort);
        for (var i = configFile.dummyDataSize; i > 0; i--) {
            customerNames.push(configFile.customerPrefix + i);
        }
        jobs.push(ScenarioTags.jobTags.paging);
        jobs.push(ScenarioTags.jobTags.customerFilter);
        jobs.push(ScenarioTags.jobTags.default_comment);
        jobs.push(ScenarioTags.jobTags.planning_edit_job);
        jobs.push(ScenarioTags.planningTags.unAssignDriver);
        jobs.push(ScenarioTags.staffTags.invalidLicenceDriver);
        jobs.push(ScenarioTags.jobTags.job_sort);
        jobs.push(ScenarioTags.planningTags.unAssignJob);
        jobs.push(ScenarioTags.planningTags.unAssignUnit);
        jobs.push(ScenarioTags.planningTags.jobsForVehicle);
        jobs.push(ScenarioTags.jobTags.uniqueCustName);
        jobs.push(ScenarioTags.jobTags.unassignJob);
        customerEmails.push(ScenarioTags.customerTags.genericEmail);
        planDates.push(configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForJob));
        planDates.push(configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnassignJob));
        planDates.push(configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForUnit));
        planDates.push(configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForViewJob));
        planDates.push(configFile.convertDateTimeFormat(ScenarioTags.vehicleTags.vehiclePlanDateForInvalidLicence));
        var createVehicles = function () {
            VehicleMother.generateVehicles(callback);
        };
        var createCollectionPoints = function () {
            CollectionPointMother.generateCollectionPoints(createVehicles);
        };
        var createCustomers = function () {
            CustomerMother.generateCustomers(createCollectionPoints);
        };
        var deleteVehicleswithReg = function () {
            CommonDao.deleteData(createCustomers, 'vehicle', {where: {vehicle_reg: vehicleReg}});
        };
        var createStaffs = function () {
            StaffMother.generateStaffs(deleteVehicleswithReg);
        };
        var deleteUsersByEmail = function () {
            CommonDao.deleteData(createStaffs, 'user', {where: {email: emails}});
        };
        var deleteVehiclePlansWithDate = function () {
            CommonDao.deleteData(deleteUsersByEmail, 'vehicle_plan', {where: {plan_date: planDates}});
        };
        var deleteStaffsWithLicence = function () {
            CommonDao.deleteData(deleteVehiclePlansWithDate, 'staff', {where: {licence_number: licenceNumber}});
        };
        var deleteVehicleTypes = function () {
            CommonDao.deleteData(deleteStaffsWithLicence, 'licence_type', {where: {licence_class: vehicleLicenceClass}});
        };
        var deleteVehicles = function () {
            CommonDao.deleteData(deleteVehicleTypes, 'vehicle', {where: {vehicle_size: vehicles}});
        };
        var deleteStaffs = function () {
            CommonDao.deleteData(deleteVehicles, 'staff', {where: {driver_name: staffs}});
        };
        var deleteCustomers = function () {
            CommonDao.deleteData(deleteStaffs, 'customer', {where: {generic_email: customerEmails}});
        };
        var deleteCustomersContainingJobs = function () {
            CommonDao.deleteData(deleteCustomers, 'customer', {where: {customer_name: customerNames}});
        };
        var deleteJobs = function () {
            CommonDao.deleteData(deleteCustomersContainingJobs, 'job', {where: {comments: jobs}});
        };
        var generateUsers = function () {
            UserMother.generateUsers(deleteJobs);
        };
        var dbInitialized = function () {
            generateUsers();
        };

        CommonDao.initDb(dbInitialized);

    });
};
