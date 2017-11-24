if (typeof exports == "undefined") {
    if (typeof faker == "undefined") {
        throw new Error('Missing faker');
    }
} else {
    var faker = require('faker');
}

/**
 * Define Random Utilities which is used to generate random data
 */
var RandomUtils = {
    random: function (items) {
        var randomIndex = Math.floor(Math.random() * items.length);
        return items[randomIndex];
    },
    randomString: function (length) {
        length = length || 10;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    randomRealNumber: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    randomNumber: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomDate: function (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    },
    faker: faker
};

/**
 * Creates a new factory with attributes, options, etc. to be used to build
 * objects. Generally you should use `Factory.define()` instead of this
 * constructor.
 *
 * @param {Function=} constructor
 * @class
 */
var Factory = function (name, constructor) {
    this.construct = constructor;
    this.attrs = {};
    this.opts = {};
    this.sequences = {};
    this.callbacks = [];
    this.tmpAttr = '';
    this.DBModelName = name || '';
    this.AutoDBModel = null;
    this.DBModel = null;
};

Factory.prototype = {
    /**
     * Define an attribute on this factory. Attributes can optionally define a
     * default value, either as a value (e.g. a string or number) or as a builder
     * function. For example:
     *
     *   // no default value for age
     *   Factory.define('Person').attr('age')
     *
     *   // static default value for age
     *   Factory.define('Person').attr('age', 18)
     *
     *   // dynamic default value for age
     *   Factory.define('Person').attr('age', function() {
     *      return Math.random() * 100;
     *   })
     *
     * Attributes with dynamic default values can depend on options or other
     * attributes:
     *
     *   Factory.define('Person').attr('age', ['name'], function(name) {
     *     return name === 'Brian' ? 30 : 18;
     *   });
     *
     * By default if the consumer of your factory provides a value for an
     * attribute your builder function will not be called. You can override this
     * behavior by declaring that your attribute depends on itself:
     *
     *   Factory.define('Person').attr('spouse', ['spouse'], function(spouse) {
     *     return Factory.build('Person', spouse);
     *   });
     *
     * As in the example above, this can be a useful way to fill in
     * partially-specified child objects.
     *
     * @param {string} attr
     * @param {Array.<string>=} dependencies
     * @param {*} value
     * @return {Factory}
     */
    attr: function (attr, dependencies, value) {
        var builder;
        this.tmpAttr = attr;
        if (arguments.length === 1) {
            return this;
        }

        if (arguments.length === 2) {
            value = dependencies;
            dependencies = null;
        }

        builder = typeof value === 'function' ? value : function () {
            return value;
        };
        if (this.attrs[attr]) {
            this.attrs[attr].dependencies = dependencies || [];
            this.attrs[attr].builder = builder;
        } else {
            this.attrs[attr] = {dependencies: dependencies || [], builder: builder};
        }
        return this;
    },

    /**
     * Define an option for this factory. Options are values that may inform
     * dynamic attribute behavior but are not included in objects built by the
     * factory. Like attributes, options may have dependencies. Unlike
     * attributes, options may only depend on other options.
     *
     *   Factory.define('Person')
     *     .option('includeRelationships', false)
     *     .attr(
     *       'spouse',
     *       ['spouse', 'includeRelationships'],
     *       function(spouse, includeRelationships) {
     *         return includeRelationships ?
     *           Factory.build('Person', spouse) :
     *           null;
     *       });
     *
     *   Factory.build('Person', null, { includeRelationships: true });
     *
     * Options may have either static or dynamic default values, just like
     * attributes. Options without default values must have a value specified
     * when building.
     *
     * @param {string} attr
     * @param {Array.<string>=} dependencies
     * @param {*=} value
     * @return {Factory}
     */
    option: function (opt, dependencies, value) {
        var builder;
        if (arguments.length === 2) {
            value = dependencies;
            dependencies = null;
        }
        if (arguments.length > 1) {
            builder = typeof value === 'function' ? value : function () {
                return value;
            };
        }
        this.opts[opt] = {dependencies: dependencies || [], builder: builder};
        return this;
    },

    /**
     * Defines an attribute that, by default, simply has an auto-incrementing
     * numeric value starting at 1. You can provide your own builder function
     * that accepts the number of the sequence and returns whatever value you'd
     * like it to be.
     *
     * Sequence values are inherited such that a factory derived from another
     * with a sequence will share the state of that sequence and they will never
     * conflict.
     *
     *   Factory.define('Person').sequence('id');
     *
     * @param {string} attr
     * @param {function(number): *=} builder
     * @return {Factory}
     */
    sequence: function (attr, builder) {
        var factory = this;

        if (arguments.length == 1 && typeof attr === 'function') {
            builder = attr;
            attr = this.tmpAttr;
        }

        builder = builder || function (i) {
            return i;
        };
        return this.attr(attr, function () {
            factory.sequences[attr] = factory.sequences[attr] || 0;
            return builder(++factory.sequences[attr]);
        });
    },

    /**
     * Sets a post-processor callback that will receive built objects and the
     * options for the build just before they are returned from the #build
     * function.
     *
     * @param {function(object, ?object)} callback
     * @return {Factory}
     */
    after: function (callback) {
        this.callbacks.push(callback);
        return this;
    },

    /**
     * Sets the constructor for this factory to be another factory. This can be
     * used to create more specific sub-types of factories.
     *
     * @param {Factory}
     * @return {Factory}
     */
    inherits: function (parentFactory) {
        this.construct = function (attributes, options) {
            return Factory.build(parentFactory, attributes, options);
        };
        return this;
    },

    /**
     * Builds a plain object containing values for each of the declared
     * attributes. The result of this is the same as the result when using #build
     * when there is no constructor registered.
     *
     * @param {object=} attributes
     * @param {object=} options
     * @return {object}
     */
    attributes: function (attributes, options) {
        attributes = Factory.util.extend({}, attributes);
        options = this.options(options);
        for (var attr in this.attrs) {
            this._attrValue(attr, attributes, options, [attr]);
        }
        return attributes;
    },

    /**
     * Generates a value for the given named attribute and adds the result to the
     * given attributes list.
     *
     * @private
     * @param {string} attr
     * @param {object} attributes
     * @param {object} options
     * @param {Array.<string>} stack
     * @return {*}
     */
    _attrValue: function (attr, attributes, options, stack) {
        if (!this._alwaysCallBuilder(attr) && Factory.util.hasOwnProp(attributes, attr)) {
            return attributes[attr];
        }

        var value = this._buildWithDependencies(this.attrs[attr], function (dep) {
            if (Factory.util.hasOwnProp(options, dep)) {
                return options[dep];
            } else if (dep === attr) {
                return attributes[dep];
            } else if (stack.indexOf(dep) >= 0) {
                throw new Error('detected a dependency cycle: ' + stack.concat([dep]).join(' -> '));
            } else {
                return this._attrValue(dep, attributes, options, stack.concat([dep]));
            }
        });

        if (attr.indexOf('.') != -1) {
            Factory.util.assign(attributes, attr, value);
        } else {
            attributes[attr] = value;
        }

        return value;
    },

    /**
     * Determines whether the given named attribute has listed itself as a
     * dependency.
     *
     * @private
     * @param {string} attr
     * @return {boolean}
     */
    _alwaysCallBuilder: function (attr) {
        var attrMeta = this.attrs[attr];
        return attrMeta.dependencies.indexOf(attr) >= 0;
    },

    /**
     * Generates values for all the registered options using the values given.
     *
     * @private
     * @param {object} options
     * @return {object}
     */
    options: function (options) {
        options = options || {};
        for (var opt in this.opts) {
            options[opt] = this._optionValue(opt, options);
        }
        return options;
    },

    /**
     * Generates a value for the given named option and adds the result to the
     * given options list.
     *
     * @private
     * @param {string}
     * @param {object} options
     * @return {*}
     */
    _optionValue: function (opt, options) {
        if (Factory.util.hasOwnProp(options, opt)) {
            return options[opt];
        }

        var optMeta = this.opts[opt];
        if (!optMeta.builder) {
            throw new Error('option `' + opt + '` has no default value and none was provided');
        }

        return this._buildWithDependencies(optMeta, function (dep) {
            return this._optionValue(dep, options);
        });
    },

    /**
     * Calls the builder function with its dependencies as determined by the
     * given dependency resolver.
     *
     * @private
     * @param {{builder: function(...[*]): *, dependencies: Array.<string>}} meta
     * @param {function(string): *} getDep
     * @return {*}
     */
    _buildWithDependencies: function (meta, getDep) {
        var deps = meta.dependencies;
        var self = this;
        var args = deps.map(function () {
            return getDep.apply(self, arguments);
        });
        return meta.builder.apply(this, args);
    },

    /**
     * Builds objects by getting values for all attributes and optionally passing
     * the result to a constructor function.
     *
     * @param {object} attributes
     * @param {object} options
     * @return {*}
     */
    build: function (attributes, options) {
        var self = this;
        if (Array.isArray(attributes)) {
            var results = [];
            attributes.forEach(function (attribute) {
                results.push(buildObject.call(self, attribute))
            });
            return results;
        } else {
            return buildObject.call(self, attributes, options);
        }

        function buildObject(attributes, options) {
            var result = this.attributes(attributes, options);
            var retval = null;

            if (this.construct) {
                if (typeof this.construct.create === 'function') {
                    retval = this.construct.create(result);
                } else {
                    retval = new this.construct(result);
                }
            } else {
                retval = result;
            }

            for (var i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i](retval, this.options(options));
            }
            return retval;
        }
    },

    /**
     * Extends a given factory by copying over its attributes, options,
     * callbacks, and constructor. This can be useful when you want to make
     * different types which all share certain attributes.
     *
     * @param {string} name The factory to extend.
     * @return {Factory}
     */
    extend: function (name) {
        var factory;
        if (!name) {
            return Factory.define().extend(this);
        } else if (typeof name == 'object') {
            var overrideAttributes = name;
            if (!Array.isArray(overrideAttributes)) {
                if (this instanceof Factory) {
                    factory = Factory.define()._extend(overrideAttributes);
                } else {
                    factory = Factory.define()._extend(this);
                    addAttributeToFactory(factory, overrideAttributes);
                }
                return factory;
            } else {
                var factories = [];
                overrideAttributes.forEach(function (attrs) {
                    if (this instanceof Factory) {
                        factory = Factory.define()._extend(attrs);
                    } else {
                        factory = Factory.define()._extend(this);
                        addAttributeToFactory(factory, attrs);
                    }
                    factories.push(factory);
                });

                return factories;
            }
        } else if (typeof name == 'string') {
            return this._extend(name);
        }

        function addAttributeToFactory(factory, attrs) {
            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    factory.attr(key, attrs[key]);
                }
            }
        }
    },

    _extend: function (name) {
        var factory = typeof name === 'string' ? Factory.factories[name] : name;
        // Copy the parent's constructor
        if (this.construct === undefined) {
            this.construct = factory.construct;
        }
        this.attrs = Factory.util.extend(true, {}, factory.attrs);
        this.opts = Factory.util.extend(true, {}, factory.opts);
        // Copy the parent's callbacks
        this.callbacks = factory.callbacks.slice();
        this.DBModelName = factory.DBModelName;
        this.DBModel = factory.DBModel;
        return this;
    },

    /**
     * Define type of the attribute. This type is use to generate random data and define data type in DB.
     * The type can be Boolean, String, Date, Number. Or you can get the type at Factory.type
     * This defined type is used to random data.
     *
     * @param {string} attribute
     * @param {object} type
     * @return Factory
     */
    type: function (attribute, type) {
        if (arguments.length === 1) {
            type = attribute;
            attribute = this.tmpAttr;
        } else {
            this.tmpAttr = attribute;
        }

        this.attrs[attribute] = this.attrs[attribute] || {
            dependencies: [], builder: function () {
            }
        };
        this.attrs[attribute].type = type;
        return this;
    },

    /**
     * Remove a defined attribute
     *
     * @param {string} attribute
     * @return Factory
     */
    remove: function (attribute) {
        if (arguments.length === 0) {
            attribute = this.tmpAttr;
        }
        this.tmpAttr = '';
        delete this.attrs[attribute];
        return this;
    },

    /**
     * Define relationship with other factory.
     *
     * e.g.
     *      var BookFactory = Factory.define('Book');
     *      var AuthorFactory = Factory.define('Author');
     *      AuthorFactory.ref('books', 'Book', {type: 'hasMany', foreignKey: 'authorId'});
     *      BookFactory.ref('author', 'Author', {type: 'belongsTo', foreignKey: 'authorId'});
     *      or
     *      AuthorFactory.attr('books').ref('Book', {type: 'hasMany', foreignKey: 'authorId'});
     *      BookFactory.attr('author').ref('Author', {type: 'belongsTo', foreignKey: 'authorId'});
     *
     * @param {string} attribute
     * @param {string} name of relational factory
     * @param {object} options
     * @return Factory
     */
    ref: function (attribute, name, options) {
        if (arguments.length <= 2) {
            options = name || {};
            name = attribute;
            attribute = this.tmpAttr;
        } else {
            this.tmpAttr = attribute;
        }

        this.attrs[attribute] = this.attrs[attribute] || {
            dependencies: [], builder: function () {
            }
        };
        this.attrs[attribute].ref = {name: name, options: options};

        return this;
    },

    /**
     * Short form of "ref" function, is used to define "has many" relationship
     *
     * e.g.
     *      var BookFactory = Factory.define('Book');
     *      var AuthorFactory = Factory.define('Author');
     *      AuthorFactory.hasMany('books', 'Book', {foreignKey: 'authorId'})
     *
     * @param {string} attribute
     * @param {string} name of relational factory
     * @param {object} options
     * @return Factory
     */
    hasMany: function (attribute, name, options) {
        if (arguments.length <= 2) {
            options = name || {};
            name = attribute;
            attribute = this.tmpAttr;
        } else {
            this.tmpAttr = attribute;
        }

        Factory.factories[name].remove(options.foreignKey);
        this.attrs[attribute] = this.attrs[attribute] || {
            dependencies: [], builder: function () {
            }
        };

        options = Factory.util.extend(options, {type: 'hasMany'});
        this.attrs[attribute].ref = {name: name, options: options};
        return this;
    },

    /**
     * Short form of "ref" function, is used to define "belong to" relationship
     *
     * e.g.
     *      var BookFactory = Factory.define('Book');
     *      var AuthorFactory = Factory.define('Author');
     *      BookFactory.belongsTo('author', 'Author', {foreignKey: 'authorId'});
     *      or
     *      BookFactory.attr('author').belongsTo('Author', {foreignKey: 'authorId'});
     *
     * @param {string} attribute
     * @param {string} name of relational factory
     * @param {object} options
     * @return Factory
     */
    belongsTo: function (attribute, name, options) {
        if (arguments.length <= 2) {
            options = name || {};
            name = attribute;
            attribute = this.tmpAttr;
        } else {
            this.tmpAttr = attribute;
        }

        this.remove(options.foreignKey);
        this.attrs[attribute] = this.attrs[attribute] || {
            dependencies: [], builder: function () {
            }
        };

        options = Factory.util.extend(options, {type: 'belongsTo'});
        this.attrs[attribute].ref = {name: name, options: options};
        this.attr(attribute, function () {
            return Factory.build(attribute);
        });
        return this;
    },

    /**
     * Set value for an attribute. Same as "attr" function but ONLY WORK when an attribute is defined in a chain
     *
     * e.g.
     *      var BookFactory = Factory.define('Book');
     *      BookFactory.attr('name').is('Harry Potter');
     *
     * @param {Array.<string>=} dependencies
     * @param {*} value
     * @return {Factory}
     */
    is: function (dependencies, value) {
        var builder;
        if (arguments.length === 1) {
            value = dependencies;
            dependencies = null;
        }

        builder = typeof value === 'function' ? value : function () {
            return value;
        };

        this.attrs[this.tmpAttr] = this.attrs[this.tmpAttr] || {
            dependencies: [], builder: function () {
            }
        };
        this.attrs[this.tmpAttr].dependencies = dependencies || [];
        this.attrs[this.tmpAttr].builder = builder;
        return this;
    },

    default: function () {
        return this.is.call(this, arguments);
    },

    /**
     * Flag attribute to be generate data when factory build object
     * This attribute must be defined the data type.
     *
     * e.g.
     *      var BookFactory = Factory.define('Book');
     *      BookFactory.with.attr('author').type(Factory.type.Name).random(); // this will generate a random name when building object
     *
     * For a specific type, you can give options for the randomization:
     * - "String" or "Factory.type.String" { length: { min: 10, max: 100 } }
     * - "Number" or "Factory.type.Number" { range: { min: 10, max: 100 } } // random integer
     * - "Factory.type.RealNumber" { range: { min: 1.5, max: 2.9 } } // random real number
     * - "Date" or "Factory.type.Date" { range: { min: new Date(1980, 0, 1), max: new Date(1995, 11, 31) } }
     *
     * @param {string} attribute
     * @param {object} options
     * @return {Factory}
     */
    random: function (attribute, options,overrideAttributes) {
        var builder, type, prefix, postfix,
            length, range, size, min = 0, max = 10,
            randomItems;
        if (arguments.length == 0) {
            options = {};
            attribute = this.tmpAttr;
        } else if (arguments.length == 1) {
            if (typeof attribute == 'string') {
                options = {};
            } else if (Array.isArray(attribute)) {
                randomItems = attribute;
                options = {};
                attribute = this.tmpAttr;
            } else {
                options = attribute || {};
                attribute = this.tmpAttr;
            }
        } else {
            this.tmpAttr = attribute;
        }

        if (!attribute) {
            function isExcept(attr, options) {
                if (Array.isArray(options.except)) {
                    return options.except.indexOf(attr) != -1;
                } else {
                    return attr == options.except;
                }
            }

            for (var attr in this.attrs) {
                if (this.attrs.hasOwnProperty(attr) && !isExcept(attr, options)) {
                    this.random.call(this, attr);
                }
            }

            return this;
        }

        if (Array.isArray(options.in)) {
            randomItems = options.in;
        }

        if (randomItems) {
            builder = function () {
                return RandomUtils.random(randomItems);
            }

        } else {
            options = options || {};
            type = options.type || this.attrs[attribute].type;
            prefix = options.prefix || '';
            postfix = options.postfix || '';
            length = options.length || 10;
            range = options.range;
            size = options.size || 1;

            if (!type) {
                var ref = this.attrs[attribute].ref;
                if (!ref) {
                    throw new Error('missing define type for attribute : ' + attribute);
                } else {
                    var name = ref.name;
                    var refOptions = ref.options || {};

                    if (refOptions.type == 'hasMany') {
                        builder = function () {
                            var output = [];
                            for (var i = 0; i < size; i++) {
                                 var obj = Factory.build(name);
                                 if(overrideAttributes && overrideAttributes[i]){
                                    for(var ele in overrideAttributes[i]){
                                        if(ele in obj){
                                            obj[ele] = overrideAttributes[i][ele];
                                        }
                                     }
                                 }
                                 
                                output.push(obj);
                            }
                            return output;
                        }
                    } else {
                        builder = function () {
                            // return Factory.define().extend(Factory.factories[name]).random().build();
                            var obj = Factory.build(name);
                             if(overrideAttributes && overrideAttributes[0]){
                                for(var ele in overrideAttributes[0]){
                                    if(ele in obj){
                                        obj[ele] = overrideAttributes[0][ele];
                                    }
                                 }
                             }
                            return obj;
                        }
                    }
                }
            } else if (type === String || type === Factory.type.String) {
                if (isNaN(length)) {
                    min = length.min || min;
                    max = length.max || max;

                    length = RandomUtils.randomString(min, max);
                }
                builder = function () {
                    return prefix + RandomUtils.randomString(length) + postfix;
                }

            } else if (type === Number || type === Factory.type.Number) {
                if (range) {
                    min = range.min || min;
                    max = range.max || max;
                }
                builder = function () {
                    return RandomUtils.randomNumber(min, max);
                }
            } else if (type === Factory.type.RealNumber) {
                if (range) {
                    min = range.min || min;
                    max = range.max || max;
                }
                builder = function () {
                    return RandomUtils.randomRealNumber(min, max);
                }
            } else if (type === Date || type === Factory.type.Date) {
                min = new Date(2012, 0, 1);
                max = new Date();
                if (range) {
                    min = range.min || min;
                    max = range.max || max;
                }
                builder = function () {
                    return RandomUtils.randomDate(min, max);
                }
            } else if (type === Factory.type.DatePast) {
                builder = function () {
                    return faker.date.past();
                }
            } else if (type === Factory.type.DateFuture) {
                builder = function () {
                    return faker.date.future();
                }
            } else if (type === Factory.type.DateRecent) {
                builder = function () {
                    return faker.date.recent();
                }
            } else if (type === Boolean || type === Factory.type.Boolean) {
                builder = function () {
                    return ((Math.random() * 10) & 1) == 1;
                };
            } else if (type == Factory.type.Name) {
                builder = function () {
                    return prefix + faker.name.findName() + postfix;
                }
            } else if (type == Factory.type.FirstName) {
                builder = function () {
                    return prefix + faker.name.firstName() + postfix;
                }
            } else if (type == Factory.type.LastName) {
                builder = function () {
                    return prefix + faker.name.lastName() + postfix;
                }
            } else if (type == Factory.type.CompanyName) {
                builder = function () {
                    return prefix + faker.company.companyName() + postfix;
                }
            } else if (type == Factory.type.Email) {
                builder = function () {
                    return faker.internet.email();
                }
            } else if (type == Factory.type.PhoneNumber) {
                builder = function () {
                    return faker.phone.phoneNumber();
                }
            } else if (type == Factory.type.Paragraph) {
                builder = function () {
                    return faker.lorem.paragraph();
                }
            } else if (type == Factory.type.StreetAddress) {
                builder = function () {
                    return faker.address.streetAddress();
                }
            } else if (type == Factory.type.City) {
                builder = function () {
                    return faker.address.city();
                }
            } else if (type == Factory.type.ZipCode) {
                builder = function () {
                    return faker.address.zipCode();
                }
            }

        }

        if (!builder) {
            throw new Error('invalid type for attribute : ' + attribute);
        } else {
            this.attrs[attribute] = this.attrs[attribute] || {
                dependencies: [], builder: function () {
                }
            };
            this.attrs[attribute].dependencies = [];
            this.attrs[attribute].builder = builder;
        }

        return this;
    }

};

/**
 * Define attribute "with" and "and" for Factory to return Factory itself.
 * This will be used in chained function
 *
 * e.g.
 *     BookFactory.with.attr('name').is('Harry Potter').and.attr('author').is('JK Rowling');
 */
Object.defineProperty(Factory.prototype, 'with', {
    get: function () {
        return this;
    }
});

Object.defineProperty(Factory.prototype, 'and', {
    get: function () {
        return this;
    }
});

/**
 * @private
 */
Factory.util = (function () {
    var hasOwnProp = Object.prototype.hasOwnProperty;

    return {
        /**
         * Determines whether `object` has its own property named `prop`.
         *
         * @private
         * @param {object} object
         * @param {string} prop
         * @return {boolean}
         */
        hasOwnProp: function (object, prop) {
            return hasOwnProp.call(object, prop);
        },

        extend: function extend() {
            var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false,
                toString = Object.prototype.toString,
                hasOwn = Object.prototype.hasOwnProperty,
                push = Array.prototype.push,
                slice = Array.prototype.slice,
                trim = String.prototype.trim,
                indexOf = Array.prototype.indexOf,
                class2type = {
                    "[object Boolean]": "boolean",
                    "[object Number]": "number",
                    "[object String]": "string",
                    "[object Function]": "function",
                    "[object Array]": "array",
                    "[object Date]": "date",
                    "[object RegExp]": "regexp",
                    "[object Object]": "object"
                },
                jQuery = {
                    isFunction: function (obj) {
                        return jQuery.type(obj) === "function"
                    },
                    isArray: Array.isArray ||
                    function (obj) {
                        return jQuery.type(obj) === "array"
                    },
                    isWindow: function (obj) {
                        return obj != null && obj == obj.window
                    },
                    isNumeric: function (obj) {
                        return !isNaN(parseFloat(obj)) && isFinite(obj)
                    },
                    type: function (obj) {
                        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
                    },
                    isPlainObject: function (obj) {
                        if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
                            return false
                        }
                        try {
                            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                                return false
                            }
                        } catch (e) {
                            return false
                        }
                        var key;
                        for (key in obj) {
                        }
                        return key === undefined || hasOwn.call(obj, key)
                    }
                };
            if (typeof target === "boolean") {
                deep = target;
                target = arguments[1] || {};
                i = 2;
            }
            if (typeof target !== "object" && !jQuery.isFunction(target)) {
                target = {}
            }
            if (length === i) {
                target = this;
                --i;
            }
            for (i; i < length; i++) {
                if ((options = arguments[i]) != null) {
                    for (name in options) {
                        src = target[name];
                        copy = options[name];
                        if (target === copy) {
                            continue
                        }
                        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                            if (copyIsArray) {
                                copyIsArray = false;
                                clone = src && jQuery.isArray(src) ? src : []
                            } else {
                                clone = src && jQuery.isPlainObject(src) ? src : {};
                            }
                            // WARNING: RECURSION
                            target[name] = extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
        },

        random: RandomUtils,

        assign: function (obj, path, value) {
            var attributes = path.split('.');
            if (attributes.length > 0) {
                var tmpObj = obj, tmpAttr;
                for (var i = 0; i < attributes.length; i++) {
                    tmpAttr = attributes[i];

                    var isArray = false, index = 0;
                    if (tmpAttr.match(/\[.+]/)) {
                        isArray = true;
                        index = +tmpAttr.match(/\[(.+)]/)[1];
                        tmpAttr = tmpAttr.replace(/\[(.+)]/, '');
                    }

                    if (isArray) {
                        if (typeof tmpObj[tmpAttr] == 'undefined') {
                            tmpObj[tmpAttr] = [];

                        }

                        if (i == attributes.length - 1) {
                            tmpObj[tmpAttr][index] = value;
                        } else {
                            tmpObj[tmpAttr][index] = {};
                            tmpObj = tmpObj[tmpAttr][index];
                        }
                    } else {
                        if (typeof tmpObj[tmpAttr] == 'undefined') {
                            if (i == attributes.length - 1) {
                                tmpObj[tmpAttr] = value;
                            } else {
                                tmpObj[tmpAttr] = {};
                                tmpObj = tmpObj[tmpAttr];
                            }

                        } else {
                            tmpObj = tmpObj[tmpAttr];
                        }
                    }
                }

            }
        }

    };
})();

Factory.factories = {};

/**
 * Defines a factory by name and constructor function. Call #attr and #option
 * on the result to define the properties of this factory.
 *
 * @param {!string} name
 * @param {function(object): *=} constructor
 * @return {Factory}
 */
Factory.define = function (name, constructor) {
    var factory = new Factory(name, constructor);
    if (name) {
        this.factories[name] = factory;
    }
    return factory;
};

/**
 * Locates a factory by name and calls #build on it.
 *
 * @param {string} name
 * @param {object} attributes
 * @param {object} options
 * @return {*}
 */
Factory.build = function (name, attributes, options) {
    if (!this.factories[name])
        throw new Error('The "' + name + '" factory is not defined.');
    return this.factories[name].build(attributes, options);
};

/**
 * Builds a collection of objects using the named factory.
 *
 * @param {string} name
 * @param {number} size
 * @param {object} attributes
 * @param {object} options
 * @return {Array.<*>}
 */
Factory.buildList = function (name, size, attributes, options) {
    var objs = [];
    for (var i = 0; i < size; i++) {
        objs.push(Factory.build(name, attributes, options));
    }
    return objs;
};

/**
 * Locates a factory by name and calls #attributes on it.
 *
 * @param {string} name
 * @param {object} attributes
 * @param {object} options
 * @return {object}
 */
Factory.attributes = function (name, attributes, options) {
    return this.factories[name].attributes(attributes, options);
};

/**
 * Get a factory in factory pool by its name
 *
 * e.g.
 *      Factory.define('Book')...
 *      Factory.define('Author')...
 *      var bookFactory = Factory.get('Book');
 *      var authorFactory = Factory.get('Author');
 *
 * @param {string} name of factory
 * @return {object} factory
 */
Factory.get = function (name) {
    if (!this.factories[name])
        throw new Error('The "' + name + '" factory is not defined.');
    return this.factories[name];
};

Factory.type = {
    Boolean: 1,
    String: 2,
    Number: 3,
    RealNumber: 4,
    Date: 5,
    DatePast: 6,
    DateFuture: 7,
    DateRecent: 8,
    Name: 9,
    FirstName: 9,
    LastName: 9,
    CompanyName: 10,
    Email: 11,
    PhoneNumber: 12,
    Paragraph: 13,
    StreetAddress: 14,
    City: 15,
    ZipCode: 16
};

if (typeof exports != "undefined") {
    exports.Factory = Factory;
}

Factory.randomeUtils = RandomUtils;