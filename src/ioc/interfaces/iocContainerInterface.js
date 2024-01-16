const IocInterface = require("./iocInterface");

module.exports = class iocContainerInterface extends IocInterface {

    bindArbitrary(tab, value) {}
    has() {}
    hasKey() {}
    getConcreteByKey() {}
    hasAbstract() {}
    getConcreteOf() {}
    getAbstractByKey() {}
    hasSingleton() {}
}