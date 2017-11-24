var commonDao = function () {
    var configFile = require('./defaults');
    this.configFile = configFile;
    var Factory = require('./rosie').Factory;
    var Rosie2DB = require('./rosie2db');
    var VehicleFactory;
    var VehicleTypeFactory;
    var JobFactory;
    var StaffFactory;
    var dummyDataSize = configFile.dummyDataSize;
    var CustomerFactory;
    var overRideFactoryValues = function (factoryObj, mapObj) {
        for (var key in mapObj) {
            var attrName = key;
            var attrValue = mapObj[key];
            factoryObj = factoryObj.extend().with.attr(attrName, attrValue);
        }
        return factoryObj;
    };
    var ctrl = this;
    var Schema = require('jugglingdb').Schema;
    var jugglingSchema = new Schema(require('jugglingdb-mysql'), configFile.getConfig());
    var StaffJugglingSchema = jugglingSchema.define('staff', {driver_name: {type: String}});
    var VehicleTypeJugglingSchema = jugglingSchema.define('vehicle_type_licence', {vehicle_type: {type: String}});
    var VehicleJugglingSchema = jugglingSchema.define('vehicle', {vehicle_type: {type: String}, vehicle_reg: {type: String, length: 200}});
    ctrl.initDb = function (callback) {
        Rosie2DB.setFactory(Factory);
        //schemas defined(change configurations according to your databse connections)
        Rosie2DB.defineDBSchema('mysql', configFile.getConfig());
        console.log("DB schema defined  :: " + configFile.getConfig());
        Rosie2DB.createFactoryFromDB(function () {
            VehicleFactory = Factory.get('vehicle');
            VehicleTypeFactory = Factory.get('vehicle_type_licence');
//            VehicleTypeFactory.with.attr('vehicles').hasMany('vehicle', {foreignKey: 'vehicle_type_id'});
            VehicleFactory = VehicleFactory.extend().with.attr('vehicle_reg', "AB-1234");
            JobFactory = Factory.get('job');
            StaffFactory = Factory.get('staff');
            CustomerFactory = Factory.get('customer');
            callback();
        });
    }
    ctrl.createData = function (callback, factoryName, data_array) {
        if (data_array) {
            if (!Array.isArray(data_array)) {
                var temp_data_array = [];
                temp_data_array.push(data_array);
                data_array = temp_data_array;
            }
            var j = 0;
            var createdData = [];
            for (var i = 0; i < data_array.length; i++) {
                var factoryObj = Factory.get(factoryName);
                factoryObj = overRideFactoryValues(factoryObj, data_array[i]);
                Rosie2DB.save(factoryObj, null, function (err, obj) {
                    j++;
                    createdData.push(obj);
                    if (j === data_array.length) {
                        if (callback && callback !== null) {
                            callback(createdData);
                        }
                    }
                });
            }
        } else {
            if (callback && callback !== null) {
                callback();
            }
        }
    };
    ctrl.deleteData = function (callback, factoryName, criteria) {
        var factoryObj = Factory.get(factoryName);
        var Model = Rosie2DB.getDBModel(factoryObj);
        if (criteria) {
            if (criteria['where']) {
                var schema = {};
                for (var key in criteria.where) {
                    schema[key] = {type: String};
                }
                Model = jugglingSchema.define(factoryName, schema);
            }
        }
        Model.all(criteria, function (err, array) {
            if (err !== null) {
                console.log('Err in delete : ' + err)
            }
            if (array.length > 0) {
                var j = 0;
                for (var i = 0; i < array.length; i++) {
                    array[i].destroy(function (err) {
                        j++;
                        if (j === array.length) {
                            callback();
                        }
                    });
                }
            } else {
                callback();
            }
        });
    };

    ctrl.getDataByCriteria = function (callback, factoryName, criteria) {
        var factoryObj = Factory.get(factoryName);
        var Model = Rosie2DB.getDBModel(factoryObj);
        if (criteria) {
            if (criteria['where']) {
                var schema = {};
                for (var key in criteria.where) {
                    schema[key] = {type: String};
                }
                Model = jugglingSchema.define(factoryName, schema);
            }
        }
        Model.all(criteria, function (err, array) {
            callback(array);
        });
    };

};
module.exports = new commonDao();
