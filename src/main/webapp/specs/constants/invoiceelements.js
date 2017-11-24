var invoiceElements = function () {
    this.invoiceMenuItem = element(by.id('menuInvoices'));
    this.titleSubHeader = element(by.id('titleSubHeader'));
    this.invoiceTab = element(by.id('invoiceTab'));
    this.btnSaveInvoice = element(by.id('btnSaveInvoice'));
    this.btnInvoiceList = element(by.id('btnInvoiceList'));
    this.filterCustomer = element(by.id('filterCustomer'));
    this.name = element(by.id('name'));
    this.createTab = element(by.id('createTab'));
    this.btnClearJobs = element(by.id('btnClearJobs'));
    this.jobCheckbox1 = element(by.id('job_checkbox1'));
    this.jobCheckbox2 = element(by.id('job_checkbox2'));
    this.repeaterJobList='jobObj in invoice.jobList';
    this.columnCustomerName='customer.customerName';
    this.customerChosen = "customer_chosen";

};
module.exports = new invoiceElements();
