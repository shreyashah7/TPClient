var VehicleMother = function () {
    var configFile = require('./../common/defaults');
    var CommonDao = require('./../common/commondao');
    var ScenarioTags = require("./../constants/scenariotags");
    var StaffMother = require("./../object-mothers/staffmother");
    var Schema = require('jugglingdb').Schema;
    var jugglingSchema = new Schema(require('jugglingdb-mysql'), configFile.getConfig());
    var mother = this;
    mother.VehicleJugglingSchema = jugglingSchema.define('vehicle', {vehicle_type: {type: String}, vehicle_reg: {type: String, length: 200}});
    mother.generateVehicles = function (callback) {
        var vehicleTypes = [];
        for (var i = configFile.dummyDataSize; i > 0; i--) {
            vehicleTypes.push(configFile.vehicleTypePrefix.toString() + i);
        }
        mother.VehicleJugglingSchema.all({where: {'vehicle_reg': vehicleTypes}}, function (err, existingVehicle) {
            var vehicleExists = [];
            var map = {};
            if (existingVehicle.length > 0) {
                for (var i = 0; i < existingVehicle.length; i++) {
                    vehicleExists.push(existingVehicle[i].vehicle_type);
                }
            }
            var newVehicles = [];
            for (var i = configFile.dummyDataSize; i > 0; i--) {
                if (vehicleExists.indexOf(configFile.vehicleTypePrefix + i) < 0) {
                    newVehicles.push({vehicle_type: configFile.vehicleTypePrefix + i, vehicle_reg: configFile.vehicleTypePrefix + i, active: true, artic: configFile.defaultVehicleArtic, vehicle_size: configFile.vehicleTypePrefix + i});
                }
            }
            if (newVehicles.length > 0) {
                var afterVehicleCreation = function (vehicleCreated) {
                    for (var i = 0; i < vehicleCreated.length; i++) {
                        map[vehicleCreated[i].vehicle_reg] = vehicleCreated[i].id;
                    }
                    configFile.setVehicleNameIdMap(map);
                    callback();
                };
                CommonDao.createData(afterVehicleCreation, 'vehicle', newVehicles);
            } else {
                for (var i = 0; i < existingVehicle.length; i++) {
                    map[existingVehicle[i].vehicle_reg] = existingVehicle[i].id;
                }
                configFile.setVehicleNameIdMap(map);
                callback();
            }
        });
    };

    mother.createByJson = function (callback, data) {
        var method = this;
        if (data) {
            if (data.artic == null) {
                data.artic = configFile.defaultVehicleArtic;
            }
            method.finalCall = function (created_vehicle) {
                callback(created_vehicle);
            };
            method.createVehicle = function () {
                CommonDao.createData(method.finalCall, 'vehicle', data);
            };
            if (data.vehicleTypeLicence) {
                CommonDao.createData(method.createVehicle, 'licence_type', data.vehicleTypeLicence);
            } else {
                method.createVehicle();
            }
        }
    };

    mother.createVehicleWithVehiclePlan = function (callback, data) {
        var method = this;
        var createdVehicle;
        if (data) {
            method.vehiclePlanCreated = function (created_plan) {
                callback(created_plan);
            };
            method.staffCreated = function (createdStaff) {
                if (data.vehiclePlan) {
                    CommonDao.createData(method.vehiclePlanCreated, 'vehicle_plan', {vehicle_id: createdVehicle.id, staff_id: createdStaff[0].id, plan_date: data.vehiclePlan.plan_date, unit_id: null});
                } else {
                    callback(createdStaff);
                }
            };
            method.vehicleCreated = function (created_vehicle) {
                createdVehicle = created_vehicle[0];
                if (data.staff) {
                    StaffMother.createByJson(method.staffCreated, data.staff);
                } else {
                    callback();
                }
            };
            mother.createByJson(method.vehicleCreated, data);
        }
    };
    mother.createVehicleWithVehiclePlanForUnits = function (callback, data) {
        var method = this;
        var createdVehicle;
        if (data) {
            method.vehiclePlanCreated = function (created_plan) {
                console.log(created_plan);
                callback();
            };
            method.unitCreated = function (createdUnit) {
                if (data.vehiclePlan) {
                    CommonDao.createData(method.vehiclePlanCreated, 'vehicle_plan', {vehicle_id: createdVehicle.id, unit_id: createdUnit[0].id, plan_date: data.vehiclePlan.plan_date, staff_id: null});
                } else {
                    callback(createdUnit);
                }
            };
            method.vehicleCreated = function (created_vehicle) {
                createdVehicle = created_vehicle[0];
                if (data.unit) {
                    mother.createByJson(method.unitCreated, data.unit);
                } else if (data.vehiclePlan) {
                    CommonDao.createData(method.vehiclePlanCreated, 'vehicle_plan', {vehicle_id: createdVehicle.id, plan_date: data.vehiclePlan.plan_date, staff_id: null, unit_id:null});
                } else {
                    callback();
                }
            };
            mother.createByJson(method.vehicleCreated, data);
        }
    };
    mother.updateVehicleTypeByLicenceClass = function (callback, oldvalue, newvalue) {
        var dataUpdated = function () {
            callback();
        };
        var dataRetrieved = function (vehcileTypeLicence) {
            vehcileTypeLicence[0].updateAttribute('licence_class', newvalue, dataUpdated);
        };
        CommonDao.getDataByCriteria(dataRetrieved, 'licence_type', {where: {licence_class: oldvalue}})
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
module.exports = new VehicleMother();