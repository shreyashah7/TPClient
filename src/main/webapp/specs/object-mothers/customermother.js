var CustomerMother = function () {
    var configFile = require('./../common/defaults');
    var CommonDao = require('./../common/commondao');
    var Schema = require('jugglingdb').Schema;
    var jugglingSchema = new Schema(require('jugglingdb-mysql'), configFile.getConfig());
    var mother = this;
    mother.CustomerJugglingSchema = jugglingSchema.define('customer', {customer_name: {type: String}});
    var mother = this;

    mother.generateCustomers = function (callback) {
        var customer_names = [];
        for (var i = configFile.dummyDataSize; i > 0; i--) {
            customer_names.push(configFile.customerPrefix + i);
        }
        mother.CustomerJugglingSchema.all({where: {customer_name: customer_names}}, function (err, customers) {
            var customerExists = [];
            var map = {};
            var collectionMap = {};
            if (customers.length > 0) {
                for (var i = 0; i < customers.length; i++) {
                    map[customers[i].customer_name] = customers[i].id;
                    customerExists.push(customers[i].customer_name);
                }
            }
            var createCustomers = [];
            var createCollectionList = [];
            for (var i = configFile.dummyDataSize; i > 0; i--) {
                var customerName = configFile.customerPrefix + i;
                if (customerExists.indexOf(customerName) < 0) {
                    createCustomers.push({customer_name: configFile.customerPrefix + i});
                }
            }
            var createCollection = function () {
                CommonDao.createData(callback, 'collection_point', createCollectionList);
            }
            var afterCustomerCreation = function (customerCreated) {
                for (var i = 0; i < customerCreated.length; i++) {
                    map[customerCreated[i].customer_name] = customerCreated[i].id;
                    createCollectionList.push({name: configFile.customerPrefix + i, customer_id: customerCreated[i].id, point_type: 'C'})
                    createCollectionList.push({name: configFile.customerPrefix + i, customer_id: customerCreated[i].id, point_type: 'D'})
                }
                configFile.setCustomerNameIdMap(map);
                createCollection();
            };
            if (createCustomers.length > 0) {
                CommonDao.createData(afterCustomerCreation, 'customer', createCustomers);
            } else {
                configFile.setCustomerNameIdMap(map);
                callback();
            }
        });
    };

    mother.createByJson = function (callback, data) {
        var method = this;
        if (data) {
            method.finalCall = function (created_customer) {
                callback(created_customer);
            };
            method.createCustomer = function () {
                CommonDao.createData(method.finalCall, 'customer', data);
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
};
module.exports = new CustomerMother();