var StaffMother = function () {
    var configFile = require('./../common/defaults');
    var CommonDao = require('./../common/commondao');
    var Schema = require('jugglingdb').Schema;
    var jugglingSchema = new Schema(require('jugglingdb-mysql'), configFile.getConfig());
    var mother = this;
    mother.StaffJugglingSchema = jugglingSchema.define('staff', {driver_name: {type: String}});
    var mother = this;
    mother.generateStaffs = function (callback) {
        var drivers = [];
        for (var i = configFile.dummyDataSize; i > 0; i--) {
            drivers.push(configFile.driverPrefix + i);
        }
//        var StaffJugglingSchema = jugglingSchema.define('staff', {driver_name: {type: String}});
        mother.StaffJugglingSchema.all({where: {driver_name: drivers}}, function (err, staffs) {
            var staffExists = [];
            var map = {};
            if (staffs.length > 0) {
                for (var i = 0; i < staffs.length; i++) {
                    map[staffs[i].driver_name] = staffs[i].id;
                    staffExists.push(staffs[i].driver_name);
                }
            }
            var createStaffs = [];
            for (var i = configFile.dummyDataSize; i > 0; i--) {
                var driverName = configFile.driverPrefix + i;
                if (staffExists.indexOf(driverName) < 0) {
                    createStaffs.push({driver_name: configFile.driverPrefix + i, licence_class: configFile.driverPrefix + i});
                }
            }
            var afterStaffCreation = function (staffsCreated) {
                for (var i = 0; i < staffsCreated.length; i++) {
                    map[staffsCreated[i].driver_name] = staffsCreated[i].id;
                }
                configFile.setDriverNameIdMap(map);
                callback();
            };
            if (createStaffs.length > 0) {
                CommonDao.createData(afterStaffCreation, 'staff', createStaffs);
            } else {
                configFile.setDriverNameIdMap(map);
                callback();
            }
        });
    };
    
    mother.createByJson = function (callback, data) {
        var method = this;
        if (data) {
            method.finalCall = function (created_staff) {
                callback(created_staff);
            };
            method.createStaff = function () {
                CommonDao.createData(method.finalCall, 'staff', data);
            };
            method.createStaff();
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
module.exports = new StaffMother();