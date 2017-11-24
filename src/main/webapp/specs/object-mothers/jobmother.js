var CommonDao = require("./../common/commondao");
var JobElements = require("./../constants/jobelements");
var configFile = require('./../common/defaults');
var JobMother = function () {
    var mother = this;
    mother.createNumberOfJobs = function (callback, scenarioTag, numberOfJobs, dates) {
        var method = this;
        var customerId;
        var collecId;
        var delvieryId;
        method.finalCall = function (createdJob) {
            callback();
        };
        var createCollectionList = [];
        method.createJobs = function (data) {
            var jobs = [];
            collecId = data[0].id;
            delvieryId = data[1].id;
            for (var i = 0; i < numberOfJobs; i++) {
                var job = {vehicle_size: scenarioTag + (i + 1),
                    vehicle_type: null,
                    collection_point_id: collecId,
                    delivery_point_id: delvieryId,
                    customer_id: customerId,
                    comments: scenarioTag,
                    status: JobElements.deliveredStatus,
                    vehicle_plan_id: null};

                if (dates != null && dates[i]!=null) {
                    if (dates[i].collection_date_time) {
                        job.collection_date_time = dates[i].collection_date_time;
                    }
                    if (dates[i].delivery_date_time) {
                        job.delivery_date_time = dates[i].delivery_date_time;
                    }
                }
                jobs.push(job);
            }
            CommonDao.createData(method.finalCall, 'job', jobs);
        };
        method.createCollection = function () {

            CommonDao.createData(method.createJobs, 'collection_point', createCollectionList);
        }
        method.customerCreated = function (createdData) {
            if (createdData !== null && createdData.length > 0) {
                customerId = createdData[0].id;
                createCollectionList.push({name: scenarioTag, customer_id: customerId, point_type: 'C'})
                createCollectionList.push({name: scenarioTag, customer_id: customerId, point_type: 'D'})
            }
            method.createCollection();
        };
        CommonDao.createData(method.customerCreated, 'customer', {customer_name: scenarioTag});
    };

    mother.createJobByJson = function (callback, data) {
        var method = this;
        if (data) {
            if (!data.vehicle_plan_id) {
                data.vehicle_plan_id = null;
            }
            if (!data.collection_point_id) {
                data.collection_point_id = configFile.defaultCollectionPointId;
            }
            if (!data.delivery_point_id) {
                data.delivery_point_id = configFile.defaultDeliveryPointId;
            }
            method.finalCall = function (createdJob) {
                callback(createdJob);
            }
            method.createJob = function (createdCustomers) {
                if (createdCustomers) {
                    data.customer_id = createdCustomers[0].id;
                }
                CommonDao.createData(method.finalCall, 'job', data);
            }
            if (data.customer) {
                CommonDao.createData(method.createJob, 'customer', data.customer);
            } else {
                configFile.customerNameIdMap[configFile.customerPrefix + '1'];
                method.createJob();
            }
        }
    };

    mother.createJobByVehiclePlan = function (callback, data) {
        var method = this;
        if (data) {
            if (!data.vehicle_plan_id) {
                data.vehicle_plan_id = null;
            }
            if (!data.collection_point_id) {
                data.collection_point_id = configFile.defaultCollectionPointId;
            }
            if (!data.delivery_point_id) {
                data.delivery_point_id = configFile.defaultDeliveryPointId;
            }
            method.finalCall = function (createdJob) {
                callback(createdJob);
            };
            method.createJob = function (createdVehiclePlan) {
                if (createdVehiclePlan && createdVehiclePlan.length > 0) {
                    data.vehicle_plan_id = createdVehiclePlan[0].id;
                }
                CommonDao.createData(method.finalCall, 'job', data);
            };
            method.createVehiclePlan = function () {
                if (data.vehicle_plan) {
                    CommonDao.createData(method.createJob, 'vehicle_plan', data.vehicle_plan);
                } else {
                    method.createJob();
                }
            };
            method.createVehiclePlan();
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
                mother.createJobByJson(method.callback, data_array[i])
            }
        } else {
            callback();
        }
    }
};
module.exports = new JobMother();
