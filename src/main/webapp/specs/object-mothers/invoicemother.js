var CommonDao = require("./../common/commondao");
var InvoiceElements = require("./../constants/invoiceelements");
var configFile = require('./../common/defaults');
var InvoiceMother = function () {
    var mother = this;
    mother.createInvoices = function (callback, scenarioTag ,numberofJobs) {
        var method = this;
        var customerId;
        method.finalCall = function (createdJob) {
            callback();
        };
        var createInvoiceList = [];
        method.createInvoice = function () {

            CommonDao.createData(method.finalCall, 'invoice', createInvoiceList);
        }
        method.customerCreated = function (createdData) {
            if (createdData !== null && createdData.length > 0) {
                customerId = createdData[0].id;
                createInvoiceList.push({creation_date: '2029-02-02 06:58:01', customer_id: customerId, amount: 6, total_jobs: 2, loaded_in_sage: false})
                createInvoiceList.push({creation_date: '2029-02-03 06:58:01', customer_id: customerId, amount: 10, total_jobs: 3, loaded_in_sage: false})
            }
            method.createInvoice();
        };
        CommonDao.createData(method.customerCreated, 'customer', {customer_name: scenarioTag});
    };
    
    mother.createByJson = function (callback, data) {
        var method = this;
        if (data) {
            method.finalCall = function (created_customer) {
                callback(created_customer);
            };
            method.createCustomer = function () {
                CommonDao.createData(method.finalCall, 'invoice', data);
            };
            method.createCustomer();
        }
    };
    
    mother.createListByJson = function (callback, data_array) {
        var method = this;
        var j = 0;
        var createdData = [];
        method.callback = function (data_created) {
            j++;
            if (j === data_array.length) {
                callback(createdData);
            } else {
                createdData.push(data_created);
            }
        };
        if (data_array) {
            for (var i = 0; i < data_array.length; i++) {
                mother.createByJson(method.callback, data_array[i])
            }
        } else {
            callback();
        }
    }
}
module.exports = new InvoiceMother();


