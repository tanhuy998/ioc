module.exports = class IocInterface {

    bind() { return this;}
    bindSingleton() { return this;}
    bindArbitrary() { return this;}
    has() {}
    hasKey() {}
    getConcreteByKey() {}
    hasAbstract() {}
    getConcreteOf() {}
    getAbstractByKey() {}
    hasSingleton() {}
}