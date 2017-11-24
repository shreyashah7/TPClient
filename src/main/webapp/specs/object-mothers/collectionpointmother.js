var CollectionPointMother = function () {
    var configFile = require('./../common/defaults');
    var CommonDao = require('./../common/commondao');
    var Schema = require('jugglingdb').Schema;
    var jugglingSchema = new Schema(require('jugglingdb-mysql'), configFile.getConfig());
    var mother = this;
    mother.CollectionPointSchema = jugglingSchema.define('collection_point', {name: {type: String}});
    mother.generateCollectionPoints = function (callback) {
        var names = [];
        for (var i = configFile.collectionPoints.length; i > 0; i--) {
            names.push(configFile.collectionPoints[i - 1].name);
        }
        mother.CollectionPointSchema.all({where: {'name': names}}, function (err, existingCollectionPoints) {
            var pointNameExists = [];
            if (existingCollectionPoints.length > 0) {
                for (var i = 0; i < existingCollectionPoints.length; i++) {
                    pointNameExists.push(existingCollectionPoints[i].name);
                }
            }
            var newCollectionPoints = [];
            for (var i = configFile.collectionPoints.length; i > 0; i--) {
                if (pointNameExists.indexOf(configFile.collectionPoints[i - 1].name) < 0) {
                    configFile.collectionPoints[i - 1].customer_id = configFile.customerNameIdMap[configFile.customerPrefix + '1'];
                    newCollectionPoints.push(configFile.collectionPoints[i - 1]);
                }
            }
            if (newCollectionPoints.length > 0) {
                var afterDataCreation = function (dataCreated) {
                    for (var i = 0; i < dataCreated.length; i++) {
                        if (dataCreated[i].point_type === 'C') {
                            configFile.defaultCollectionPointId = dataCreated[i].id;
                        } else if (dataCreated[i].point_type === 'D') {
                            configFile.defaultDeliveryPointId = dataCreated[i].id;
                        }
                    }
                    console.log('------'+dataCreated)
                    callback();
                };
                CommonDao.createData(afterDataCreation, 'collection_point', newCollectionPoints);
            } else {
                for (var i = 0; i < existingCollectionPoints.length; i++) {
                    if (existingCollectionPoints[i].point_type === 'C') {
                        configFile.defaultCollectionPointId = existingCollectionPoints[i].id;
                    } else if (existingCollectionPoints[i].point_type === 'D') {
                        configFile.defaultDeliveryPointId = existingCollectionPoints[i].id;
                    }
                }
                callback();
            }
        });
    };

    mother.createJobByJson = function (callback, data) {
        var method = this;
        if (data) {
            method.finalCall = function (createdCollectionPoint) {
                callback(createdCollectionPoint);
            }
            method.createCollectionPoint = function (createdCustomers) {
                if (createdCustomers) {
                    data.customer_id = createdCustomers[0].id;
                }
                CommonDao.createData(method.finalCall, 'collection_point', data);
            }
            if (data.customer) {
                CommonDao.createData(method.createCollectionPoint, 'customer', data.customer);
            } else {
                method.createCollectionPoint();
            }
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
module.exports = new CollectionPointMother();