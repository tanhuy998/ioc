/**
 * @typedef {import('../ioc/iocContainer.js')} IocContainer
 */

const AbstractReflection = require('reflectype/src/metadata/abstract/abstractReflection.js');
const DecoratorConcrete = require('../dependent/decorator/decoratorConcrete.js');
const { isInstantiable } = require('reflectype/src/libs/type.js');
const IDependencyDiscoverable = require('./IDependencyDicoverable.js');

module.exports = class Injector extends IDependencyDiscoverable {

    static #context;

    static setContext(_context) {


    }

    /**@type {IocContainer} */
    #iocContainer;

    get iocContainer() {

        return this.#iocContainer;
    }

    constructor(_iocContainer) {

        super();
        this.#iocContainer = _iocContainer;
    }

    resolveComponent(_abstract, _scope) {

        const instance =  this.iocContainer.get(_abstract, _scope);
    
        return instance instanceof DecoratorConcrete ? instance.actualInstance : instance;
    }

    /** default behavior */
    inject() {


    }
}