var UserMother = function () {
    var configFile = require('./../common/defaults');
    var CommonDao = require('./../common/commondao');
    var Schema = require('jugglingdb').Schema;
    var jugglingSchema = new Schema(require('jugglingdb-mysql'), configFile.getConfig());
    var mother = this;
    mother.UserJugglingSchema = jugglingSchema.define('user', {email: {type: String}});
    var mother = this;
    mother.generateUsers = function (callback) {
        var emailIds = [];
        emailIds.push(configFile.testUser.email);
        mother.UserJugglingSchema.all({where: {email: emailIds}}, function (err, users) {
            var createStaffs = [];
            if (users.length === 0) {
                var protractorUser = configFile.testUser;
                delete protractorUser.plainPassword;
                createStaffs.push(protractorUser);
            }
            var afterStaffCreation = function (staffsCreated) {
                callback();
            };
            if (createStaffs.length > 0) {
                CommonDao.createData(afterStaffCreation, 'user', createStaffs);
            } else {
                callback();
            }
        });
    };

    mother.createByJson = function (callback, data) {
        var method = this;
        if (data) {
            if (!data.active) {
                data.active = 1;
            }
            if (!data.deleted) {
                data.deleted = 0;
            }
            if (!data.password) {
                data.password = configFile.testUser.password;
            }
            method.finalCall = function (created_staff) {
                callback(created_staff);
            };
            method.createStaff = function () {
                CommonDao.createData(method.finalCall, 'user', data);
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
                mother.createByJson(method.callback, data_array[i]);
            }
        } else {
            callback();
        }
    }
};
module.exports = new UserMother();