/**
 * Check rosie running in NodeJS or web browser
 * - The feature connecting to DB just run on NodeJS environment
 */
if (typeof exports == "undefined") {
    throw new Error('This function just only run in NodeJS');
} else {
    var faker = require('faker');
    var Schema = require('jugglingdb').Schema;
    var dbmeta = require('../../db-meta');
}

var Rosie2DB = {
    setFactory: function (Factory) {
        this.Factory = Factory;

        this.DBType = {};
        this.DBType[this.Factory.type.Boolean] = Boolean;
        this.DBType[this.Factory.type.String] = String;
        this.DBType[this.Factory.type.Number] = Number;
        this.DBType[this.Factory.type.RealNumber] = Number;
        this.DBType[this.Factory.type.Date] = Date;
        this.DBType[this.Factory.type.DatePast] = Date;
        this.DBType[this.Factory.type.DateFuture] = Date;
        this.DBType[this.Factory.type.DateRecent] = Date;
        this.DBType[this.Factory.type.Name] = String;
        this.DBType[this.Factory.type.FirstName] = String;
        this.DBType[this.Factory.type.LastName] = String;
        this.DBType[this.Factory.type.CompanyName] = String;
        this.DBType[this.Factory.type.Email] = String;
        this.DBType[this.Factory.type.PhoneNumber] = String;
        this.DBType[this.Factory.type.Paragraph] = String;
        this.DBType[this.Factory.type.StreetAddress] = String;
        this.DBType[this.Factory.type.City] = String;
        this.DBType[this.Factory.type.ZipCode] = String;
    },

    /**
     * Define Juggling DBSchema
     * Reference at https://github.com/1602/jugglingdb
     *
     * @param {object} DB configuration
     * @return {object} options
     */
    defineDBSchema: function (db, options) {
        this.schema = new Schema(db, options);
    },

    /**
     * This method will make a connection to DB, read the meta data for tables, columns
     * and create corresponding factories which have the name of the table and attributes of columns.
     * Attributes also have type that matching which the column data type and therefore factory can random data.
     *
     * Support generate sample data automatically for column which has name contains:
     *  - first name
     *  - last name
     *  - company
     *  - name
     *  - email
     *  - phone
     *  - date
     *  - street
     *  - city
     *  - zip code
     *
     * @param {function} callback
     */
    createFactoryFromDB: function (callback) {
        var driver = this.schema.name;
        var settings = this.schema.settings;

        if (driver == 'postgres') {
            driver = 'pg';
            settings.user = settings.username;
        } else if (driver == 'sqlite3') {
            settings = settings.database;
        }

        dbmeta(driver, settings, function (err, meta) {
            meta.getTables(function (err, tables) {
                var totalTable = tables.length;
                var i = 0;
                tables.forEach(function (table) {
                    var tableName = table.getName();
                    var newFactory = Rosie2DB.Factory.define(tableName);
                    var schemaOptions = {};
                    meta.getColumns(tableName, function (err, columns) {
                        columns.forEach(function (column) {
                            addFactoryAttribute(driver, newFactory, column, schemaOptions);
                        });

//                    newFactory.AutoDBModel = Factory.schema.define(tableName, schemaOptions);
                        if (++i == totalTable) {
                            callback.call();
                        }
                    });
                });
            });

            function addFactoryAttribute(driver, factory, column, schemaOptions) {
                if (column.isAutoIncrementing()) {
                    return;
                }
                var columnName = column.getName();
                var columnDataType = column.getDataType();
                var columnNullable = column.isNullable();
                var columnMaxLength = column.getMaxLength() ? column.getMaxLength() : 15;

                if (driver === 'sqlite3') {
                    columnDataType = columnDataType.replace(/\(.*\)/, '').trim();
                }

                var tmp = columnName.replace(/_|\s/, '').toLowerCase();
                var randomValueFunction;
                if (tmp.indexOf('firstname') != -1) {
                    randomValueFunction = buildFunction(faker.name.firstName, columnNullable, columnMaxLength);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('lastname') != -1) {
                    randomValueFunction = buildFunction(faker.name.lastName, columnNullable, columnMaxLength);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('company') != -1) {
                    randomValueFunction = buildFunction(faker.company.companyName, columnNullable, columnMaxLength);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('name') != -1) {
                    randomValueFunction = buildFunction(faker.name.findName, columnNullable, columnMaxLength);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('email') != -1) {
                    randomValueFunction = buildFunction(faker.internet.email, columnNullable, columnMaxLength);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('phone') != -1 || tmp.indexOf('phonenumber') != -1) {
                    randomValueFunction = buildFunction(faker.phone.phoneNumber, columnNullable, columnMaxLength);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('date') != -1) {
                    randomValueFunction = buildFunction(faker.date.past, columnNullable);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('street') != -1 || tmp.indexOf('address') != -1) {
                    randomValueFunction = buildFunction(faker.address.streetAddress, columnNullable);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp==='city') {
                    randomValueFunction = buildFunction(faker.address.city, columnNullable);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else if (tmp.indexOf('zipcode') != -1) {
                    randomValueFunction = buildFunction(faker.address.zipCode, columnNullable);
                    schemaOptions[columnName] = {type: String, length: columnMaxLength};
                } else {
                    randomValueFunction = buildRandomValueFunction(driver, columnDataType, columnMaxLength, columnNullable, columnName, schemaOptions);
                }
                factory.with.attr(columnName).is(randomValueFunction);
            }

            function buildFunction(generateValueFunction, nullable, maxLength) {
                return function () {
                    if (nullable) {
                        if (Math.random() < 0.5) {
                            return generate();
                        } else {
                            return null;
                        }
                    } else {
                        return generate();
                    }

                    function generate() {
                        var value = generateValueFunction.call();
                        if (typeof value === 'string' && maxLength && value.length > maxLength) {
                            return value.substring(0, maxLength);
                        }
                        return value;
                    }
                }
            }

            function buildRandomValueFunction(driver, dataType, maxLength, nullable, columnName, schemaOptions) {
                switch (driver) {
                    case 'mysql':
                        switch (dataType.toUpperCase()) {
                            case 'INT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 2147483647);
                                }, nullable);
                            case 'TINYINT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 127);
                                }, nullable);
                            case 'SMALLINT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 32767);
                                }, nullable);
                            case 'MEDIUMINT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 8388607);
                                }, nullable);
                            case 'BIGINT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 9223372036854775807);
                                }, nullable);
                            case 'FLOAT':
                            case 'DOUBLE':
                            case 'DECIMAL':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomRealNumber(0, 100);
                                }, nullable);
                            case 'DATE':
                            case 'DATETIME':
                            case 'TIMESTAMP':
                            case 'TIME':
                            case 'YEAR':
                                schemaOptions[columnName] = Date;
                                return buildFunction(function () {
                                    return faker.date.past();
                                }, nullable);
                            case 'CHAR':
                            case 'VARCHAR':
                            case 'BLOB':
                            case 'TEXT':
                            case 'TINYBLOB':
                            case 'TINYTEXT':
                            case 'MEDIUMBLOB':
                            case 'MEDIUMTEXT':
                            case 'LONGBLOB':
                            case 'LONGTEXT':
                            case 'ENUM':
                                schemaOptions[columnName] = {type: String, length: maxLength};
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomString(maxLength);
                                }, nullable);
                        }
                        break;
                    case 'pg':
                        switch (dataType.toUpperCase()) {
                            case 'BOOLEAN':
                                schemaOptions[columnName] = Boolean;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.random([true, false]);
                                }, nullable);
                            case 'SMALLINT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 32767);
                                }, nullable);
                            case 'INTEGER':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 2147483647);
                                }, nullable);
                            case 'BIGINT':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 9223372036854775807);
                                }, nullable);
                            case 'DECIMAL':
                            case 'NUMERIC':
                            case 'REAL':
                            case 'DOUBLE PRECISION':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomRealNumber(0, 100);
                                }, nullable);
                            case 'SERIAL':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(1, 2147483647);
                                }, nullable);
                            case 'BIGSERIAL':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(1, 9223372036854775807);
                                }, nullable);
                            case 'CHARACTER VARYING':
                            case 'VARCHAR':
                            case 'CHARACTER':
                            case 'CHAR':
                            case 'TEXT':
                                schemaOptions[columnName] = {type: String, length: maxLength};
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomString(maxLength);
                                }, nullable);
                            case 'TIMESTAMP':
                            case 'TIMESTAMP WITHOUT TIME ZONE':
                            case 'TIMESTAMP WITH TIME ZONE':
                            case 'INTERVAL':
                            case 'DATE':
                            case 'TIME':
                            case 'TIME WITHOUT TIME ZONE':
                            case 'TIME WITH TIME ZONE':
                                schemaOptions[columnName] = Date;
                                return buildFunction(function () {
                                    return faker.date.past();
                                }, nullable);
                        }
                        break;
                    case 'sqlite3':
                        switch (dataType.toUpperCase()) {
                            case 'BOOLEAN':
                                schemaOptions[columnName] = Boolean;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.random([true, false]);
                                }, nullable);
                            case 'INT':
                            case 'INTEGER':
                            case 'TINYINT':
                            case 'SMALLINT':
                            case 'MEDIUMINT':
                            case 'BIGINT':
                            case 'UNSIGNED BIG INT':
                            case 'INT2':
                            case 'INT8':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 9223372036854775807);
                                }, nullable);
                            case 'REAL':
                            case 'DOUBLE':
                            case 'DOUBLE PRECISION':
                            case 'FLOAT':
                            case 'NUMERIC':
                            case 'DECIMAL':
                                schemaOptions[columnName] = Number;
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomNumber(0, 100);
                                }, nullable);
                            case 'DATE':
                            case 'DATETIME':
                                schemaOptions[columnName] = Date;
                                return buildFunction(function () {
                                    return faker.date.past();
                                }, nullable);
                            case 'CHARACTER':
                            case 'VARCHAR':
                            case 'VARYING CHARACTER':
                            case 'NCHAR':
                            case 'NATIVE CHARACTER':
                            case 'NVARCHAR':
                            case 'TEXT':
                            case 'CLOB':
                                schemaOptions[columnName] = {type: String, length: maxLength};
                                return buildFunction(function () {
                                    return Rosie2DB.Factory.util.random.randomString(maxLength);
                                }, nullable);
                        }
                        break;
                    default:
                        schemaOptions[columnName] = {type: String, length: maxLength};
                        return buildFunction(function () {
                            return Rosie2DB.Factory.util.random.randomString(maxLength);
                        }, nullable);
                }
            }
        });
    },

    /**
     * Describe JugglingDB model manually
     *
     * @param {Factory} factory
     * @param {string} name
     * @param {object} options
     * @return Factory
     */
    describeDBModel: function (factory, name, options) {
        describeDBModel.call(factory, name, options);
    },

    /**
     * Retrieve JugglingDB model
     *
     * @param {Factory} factory
     * @return JugglingDBModel
     */
    getDBModel: function (factory) {
        return getDBModel.call(factory);
    },

    /**
     * Define JugglingDB table name, if the table name is not defined. The name of the factory will be treated as table name
     *
     * @param {Factory} factory
     * @param {string} tableName
     * @return Factory
     */
    DBTable: function (factory, tableName) {
        DBTable.call(factory, name, options);
    },

    /**
     * Automatically build an object and save to DB or pass object to be saved to DB by using JugglingDB Model.
     *
     * There are 3 ways to define JugglingDB Model:
     * 1. Manually define DBModel by "describeDBModel" method
     * 2. Connect to DB an automatically create Factory and DBModel by "createFactoryFromDB" method
     * 3. If there is no DBModel defined, DBModel will be create automatically by "_autoCreateDBModel" method when execute saving data to DB
     *
     * @param {Factory} factory
     * @param {object} data
     * @param {function} callback
     * @return {Factory}
     */
    save: function (factory, data, callback) {
        save.call(factory, data, callback);
    },

    delete: function (factory, data, callback) {
      if(data.id instanceof Array){
        deleteArrayIds.call(factory, data.id,true,callback);
      }else{
        deleteDB.call(factory, data,callback);
      }
    }
};

function describeDBModel(name, options) {
    if (!Factory.schema) {
        throw new Error('Database schema is not defined in Factory. Factory.defineDBSchema(opts)');
    }
    if (typeof name === 'object') {
        options = name;
        name = this.DBModelName;
    }
    if (!name) {
        throw new Error('Missing name of DBModel');
    }

    this.DBModel = Factory.schema.define(name, options);
    return this;
}

function getDBModel() {
    if (this.DBModel) {
        return this.DBModel;
    }
    if (this.AutoDBModel) {
        return this.AutoDBModel;
    } else {
        _autoCreateDBModel.call(this, removeNestedObject(this.build()));
        return this.AutoDBModel;
    }
}

function DBTable(tableName) {
    this.DBModelName = tableName;

    return this;
}

function save(data, callback) {

    if (arguments.length === 1) {
        if (typeof data === 'function') {
            callback = data;
            data = undefined;
        }
    }

    if (!data) {
        data = this.build();
    }

    var DBModel;
    if (this.DBModel) {
        DBModel = this.DBModel;
    } else {
        _autoCreateDBModel.call(this, removeNestedObject(data));
        DBModel = this.AutoDBModel;
    }
    var model = new DBModel(removeNestedObject(data));

    saveModel(model, this, data, function (err, savedModel) {
        executeCallback(callback, err, savedModel);
    });
    function saveModel(model, factory, data, callback) {
        var belongToRefs = getRefs(factory);
        var hasManyRefs = getRefs(factory);
        var totalBelongToRefs = belongToRefs.length;
        var totalHasManyRefs = hasManyRefs.length;
        processBelongToRef(function () {
//            console.log(model);
            model.save(function (err, savedModel) {
                if (err) {
                    console.log(err);
                    executeCallback(callback, err);
                    return;
                }
                if (hasManyRefs.length > 0) {
                    processHasManyRef();
                    function processHasManyRef() {
                        var ref = hasManyRefs.pop();
                        if (ref && ref.relation.options.type == 'hasMany') {
                            var modelData = data[ref.attr];
                            var totalModels = modelData.length;
                            saveModels();
                            function saveModels() {
                                var data = modelData.pop();
                                var relationalModel = model[ref.attr].build(removeNestedObject(data));
                                saveModel(relationalModel, Rosie2DB.Factory.factories[ref.relation.name], data, function (err) {
                                    if (err) {
                                        executeCallback(callback, err);
                                        return;
                                    }
                                    if (--totalModels) {
                                        saveModels();
                                    } else {
                                        processNextHasManyRef();
                                    }
                                });
                            }
                        } else {
                            processNextHasManyRef();
                        }
                    }

                    function processNextHasManyRef() {
                        if (--totalHasManyRefs) {
                            processHasManyRef();
                        } else {
                            executeCallback(callback, null, savedModel)
                        }
                    }
                } else {
                    executeCallback(callback, err, savedModel);
                }
            });
        });

        function processBelongToRef(callback) {
            if (belongToRefs.length == 0) {
                executeCallback(callback);
                return;
            }
            var ref = belongToRefs.pop();
            if (ref && ref.relation.options.type == 'belongsTo') {
                var modelData = data[ref.attr];
                var DBModel = Rosie2DB.Factory.factories[ref.relation.name].DBModel || Rosie2DB.Factory.factories[ref.relation.name].AutoDBModel;
                var relationalModel = new DBModel(removeNestedObject(modelData));
                saveModel(relationalModel, Rosie2DB.Factory.factories[ref.relation.name], modelData, function (err, savedModel) {
                    if (err) {
                        executeCallback(callback, err);
                        return;
                    }
                    model[ref.attr](savedModel.id);
                    processNextBelongToRef();
                });
            } else {
                processNextBelongToRef();
            }


            function processNextBelongToRef() {
                if (--totalBelongToRefs) {
                    processBelongToRef(callback);
                } else {
                    executeCallback(callback)
                }
            }
        }
    }

    function getRefs(factory) {
        var refs = [];
        for (var attr in factory.attrs) {
            if (factory.attrs.hasOwnProperty(attr)) {
                if (factory.attrs[attr].ref) {
                    refs.push({attr: attr, relation: factory.attrs[attr].ref});
                }
            }
        }

        return refs;
    }

    function executeCallback(callback) {
        if (callback && typeof callback == 'function') {
            callback.apply(null, Array.prototype.slice.call(arguments, 1));
        }
    }

}
function deleteArrayIds(data,status,callback) {
  _data = data.shift();
  var factory = this;
  deleteDB.call(factory,{id:_data},function (res) {
      var _status = status && res;
      if(data.length>0){
        deleteArrayIds.call(factory,data,_status,callback);
      }else{
        callback(_status);
      }
  });
}
function deleteDB(data, callback) {
    if (arguments.length === 1) {
        if (typeof data === 'function') {
            callback = data;
            data = undefined;
        }
    }

    if (!data) {
        data = this.build();
    }

    var DBModel,FactoryhasMany,FactorybelongsTo,hasManyRelation,belongsToRelation, factoryModel;
    if (this.DBModel) {
        DBModel = this.DBModel;
    } else {
        _autoCreateDBModel.call(this, removeNestedObject(data));
        DBModel = this.AutoDBModel;
        factoryModel = this;
    }
    var refs = getRefs(this);
    for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];
        var factory = Rosie2DB.Factory.factories[ref.relation.name];
        _autoCreateDBModel.call(factory, removeNestedObject(factory.build()),ref.relation.options.foreignKey);
        if (ref.relation.options.type == 'hasMany') {
            hasManyRelation = ref;
            FactoryhasMany = factory;
        }
    }
    query = {where:removeNestedObject(data)};
    DBModel.all(query,function (err,response) {
        if(err){
          callback(false);
        }else if(response.length>0){
          destroy(response,function (res) {
            callback(res);
          });
        }else{
          callback(false);
        }

    });
    function destroy (array,callback) {
        var _data = array.shift();
        if(_data){
            var obj = {};
            obj[hasManyRelation.relation.options.foreignKey] = _data.id;
            var queryHasMany = {where:removeNestedObject(obj)};
            FactoryhasMany.AutoDBModel.all(queryHasMany,function (err,response) {
                if(err){
                  callback(false);
                }else{
                  if(response.length>0)
                    destroyHasMany(response,_data,array,callback);
                  else{
                    _data.destroy(function (err) {
                      if(err){
                        callback(false);
                      }else{
                        if(array.length>0){
                            destroy(array, callback);
                        }else{
                          callback(true);
                        }
                      }
                    });
                  }
                }
            });
        }
    }
    function destroyHasMany (arrayHasMany,model,arrayData,callback) {
        var _data = arrayHasMany.shift();
        if(_data){
            _data.destroy(function (err) {
                if(err){
                  callback(false);
                }else{
                  if(arrayHasMany.length>0){
                      destroyHasMany(arrayHasMany,model,arrayData,callback);
                  }else{
                      model.destroy(function () {
                        if(arrayData.length>0)
                            destroy(arrayData,callback);
                        else{
                          callback(true);
                        }
                      });
                  }
                }
            });
        }else{
          callback(false);
        }
    }
    function getRefs(factory) {
        var refs = [];
        for (var attr in factory.attrs) {
            if (factory.attrs.hasOwnProperty(attr)) {
                if (factory.attrs[attr].ref) {
                    refs.push({attr: attr, relation: factory.attrs[attr].ref});
                }
            }
        }

        return refs;
    }
}
/**
 * Automatically build jugglingDB model if user not defined.
 * This method will be trigger when save model to DB.
 *
 * @private
 * @param {object} sample data
 */
function _autoCreateDBModel(data) {
    if (!Rosie2DB.schema) {
        throw new Error('Database schema is not defined in Factory. Factory.defineDBSchema(opts)');
    }
    if (!this.DBModelName) {
        throw new Error('Missing define DBModelName');
    }
    var schemaOptions = {};
    var refs = [];
    for (var attr in this.attrs) {
        if (this.attrs.hasOwnProperty(attr)) {
            schemaOptions[attr] = Rosie2DB.DBType[this.attrs[attr].type] || this.attrs[attr].type;
            if (!schemaOptions[attr]) {
                if (!data) {
                    delete schemaOptions[attr];
                } else {
                    if (typeof data[attr] === 'boolean') {
                        schemaOptions[attr] = Boolean;
                    } else if (typeof data[attr] === 'string') {
                        schemaOptions[attr] = String;
                    } else if (typeof data[attr] === 'number') {
                        schemaOptions[attr] = Number;
                    } else if (data[attr] instanceof Date) {
                        schemaOptions[attr] = Date;
                    } else {
                        delete schemaOptions[attr];
                    }
                }
            }
            if (this.attrs[attr].ref) {
                refs.push({attr: attr, relation: this.attrs[attr].ref});
            }
        }
    }

    this.AutoDBModel = Rosie2DB.schema.define(this.DBModelName, schemaOptions);

    for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];
        var factory = Rosie2DB.Factory.factories[ref.relation.name];
        _autoCreateDBModel.call(factory, removeNestedObject(factory.build()));
        var relationOptions = {};
        relationOptions.as = ref.attr;
        if (ref.relation.options.foreignKey) {
            relationOptions.foreignKey = ref.relation.options.foreignKey;
        }
        if (ref.relation.options.type == 'hasMany') {
            this.AutoDBModel.hasMany(factory.AutoDBModel, relationOptions);
        } else {
            this.AutoDBModel.belongsTo(factory.AutoDBModel, relationOptions);
        }
    }

    return this;
}

function removeNestedObject(obj) {
    var output = {};
    for (var key in obj) {
        if (typeof obj[key] !== 'object' || obj[key] instanceof Date) {
            output[key] = obj[key];
        }else if(obj[key] instanceof Array){
            for(var i in obj[key]){
              var ele = obj[key][i];
              output[key] = ele;
          }
        }
    }
    return output;
}

module.exports = Rosie2DB;
