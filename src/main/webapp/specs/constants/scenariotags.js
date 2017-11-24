var scenarioTags = function () {
    this.jobTags = {
        paging: 'job_paging',
        customerFilter: 'customer_filter',
        uniqueCustName: 'uniqueCustName',
        cancelCustname: 'cancelCustname',
        vehicleSize: 'vehicle_mini_12',
        poId: 'PO123',
        vehicleType: 'vehicle_type_12',
        palletQty: '12',
        weight: '345',
        collectionPostcode: '33566',
        collectionDateTime: '16/02/2016 12:00 AM',
        deliveryPostcode: '3455',
        deliveryDateTime: '16/02/2016 12:00 AM',
        priceJobd: '34',
        comments: 'comment_mini_12',
        default_comment: 'comment used to delete',
        planning_edit_job: 'planning_edit_job',
        job_sort: 'job_sort',
        unassignJob: 'unassign_job'
    };
    this.customerTags = {
        customerNames: 'customer_names',
        customerPaging: 'customer_paging',
        newCustomerScenario: 'new Customer 212',
        editCustomer: 'edit customer 232',
        editedCustomer: 'edited customer 232',
        address: 'NYC',
        cityTown: 'New Yorp',
        county: 'county12',
        postCode: '3214567',
        salesContact: '10230',
        genericEmail: 'b13technology@xyz.com',
        salesEmail: 'bespokeware@xyz.com',
        phoneNumber: '78965413230',
        fax: '852741',
        vatNo: '41526',
        companyNumber: '7412668',
        creditLimit: '412'
    };
    this.staffTags = {
        paging: 'staff_paging',
        driverName: 'uniqueDriverqw',
        driverName1: 'DriverName',
        newStaffScenario: 'new staff 212',
        editStaff: 'edit staff 232',
        filterStaff: 'filter Staff 232',
        editedStaff: 'edited staff 232',
        licenceClass: 'uniqueLicenceClass12',
        licenceNumber: '9087888123',
        filterLicenceClass: 'filter LC 2322',
        phoneNumber: '0987654321',
        mobile: '0987654321',
        dateOfBirth: '01/01/1990',
        address: 'NYC',
        cityTown: 'New Yorp',
        county: 'county12',
        postCode: '3214567',
        employmentDate: '01/01/2013',
        eyeTest: '01/01/2015',
        hourContract: '3',
        validLicenceDriver: 'validLicenceDriver',
        validLicenceVehicle: 'validLicenceVehicle',
        invalidLicenceVehicle: 'invalidLicenceVehicle',
        staffManifestDate: 'staffManifestDate'
    };
    this.vehicleTags = {
        paging: 'vehicle_paging',
        newVehicleScenario: 'new_Vehicle 212',
        editVehicle: 'edit vehicle 232',
        editedVehicle: 'edited vehicle 232',
        filterVehicle: 'filter vehicle 232',
        sortingVehicle: 'sorting vehicle 232',
        vehicleReg: 'uniqueVehicleqw',
        licenceClass: 'uniqueLicenceClass12',
        licenceNumber: '9087888123',
        phoneNumber: '0987654321',
        mobile: '0987654321',
        dateOfBirth: '01/01/1990',
        address: 'NYC',
        cityTown: 'New Yorp',
        county: 'county12',
        postCode: '3214567',
        employmentDate: '01/01/2013',
        eyeTest: '01/01/2015',
        hourContract: '3',
        vehicleSize: '12320',
        vehiclePlanDateForJob: '15/02/2019',
        vehiclePlanDateForUnassignJob: '18/02/2019',
        vehiclePlanDateForViewJob: '20/02/2019',
        vehiclePlanDateForInvalidLicence: '21/02/2019',
        articVehicles: 'articVehicles',
        unitVehicle: 'unitVehicle',
        trailerVehicle: 'trailerVehicle',
        rigidVehicle: 'rigidVehicle',
        unitTabVehicle: 'unitTabVehicle',
        vehiclePlanDateForUnit: '22/02/2019'
    };
    this.planningTags = {
        unAssignDriver: 'unassign_driver',
        unAssignJob: 'unassign_job',
        jobsForVehicle: 'jobs_for_vehicle',
        unAssignUnit: 'unassign_unit',
        planWithNoUnit : 'plan_with_no_unit'
    };

    this.vehicleTypeLicenceTags = {
        vehicleType: 'VType',
        licenceClass: 'Class',
        duplicateVehicleLicenceType: 'duplicateVehicleLicenceType',
        duplicateVehicleLicenceClass: 'duplicateVehicleLicenceClass'
    };
    this.userTags = {
        newEmailId: 'new21223@gmail.com',
        newFName: 'FName 212',
        newLName: 'LName 212',
        editFname: 'edited FName 33'
    };
    this.invoiceTags = {
        invoiceJobs: 'setUpNewCreateJob',
        newInvoice: 'newInvoice',
        jobCountInvoice: 'jobCountInvoice',
        selectedJobCounts: 'selectedJobCount',
        createdInvoices: 'createdInvoices'
    }
    this.loginTags = {
        invalidCredentials: 'invalidCredentials@gmail.com'
    };
};
module.exports = new scenarioTags();
