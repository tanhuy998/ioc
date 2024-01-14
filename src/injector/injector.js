/**
 * @typedef {import('../ioc/iocContainer.js')} IocContainer
 */

const DecoratorConcrete = require('../dependent/decorator/decoratorConcrete.js');

module.exports = class Injector {

    static #context;

    static setContext(_context) {


    }

    /**@type {IocContainer} */
    #iocContainer;

    get iocContainer() {

        return this.#iocContainer;
    }

    constructor(_iocContainer) {

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