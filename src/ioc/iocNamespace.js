const { checkType } = require('../utils/iocType.util.js');
//const isAbstract = require('reflectype/src/utils/isAbstract.js');

//const Interface = require('reflectype/src/interface/interface.js');
const ObjectInjectorEngine = require('../injector/objectInjectorEngine.js');
const IocContainerSetDefaultInstanceError = require('../errors/iocContainerSetDefaultInstanceError.js');
const { hasPseudoConstructor, generateVirtualClass, isVirtualClass } = require('../dependent/virtual/virtualDependent.js');
const IocInterface = require("./iocInterface.js");
const IocBindingOption = require('./iocBindingOption.js');
const iocContainerInterface = require('./iocContainerInterface.js');
const DecoratorConcrete = require('../dependent/decorator/decoratorConcrete.js');

/**
 * @typedef {import('./iocContainer')} IocContainer
 */

class Empty {}

const EMPTY = 0;

module.exports = class IocNamespace extends iocContainerInterface {

    #id;

    /**
     * the first offest of the objects pool is an empty object
     */
    #objectsPool = [new Empty()];

    /**
     * mapping table between abstracts and concretes
     */
    #container = new WeakMap();
    #stringKeys = new Map();

    /**
     * singleton objects
     */
    #singleton = new WeakMap();

    /**@type {ObjectInjectorEngine} */
    #objectInjector;
    #virtualConretes = new WeakMap();

    /** @type {IocContainer}*/
    #global;

    get id() {

        return this.#id;
    }

    constructor(id, global) {

        super();
        this.#id = id;
        this.#global = global;
        this.#init();
    }

    #init() {

        this.#objectInjector = new ObjectInjectorEngine(this);
    }

    bindArbitrary(key, value) {

        if (this.#stringKeys.has(key)) {

            this.#stringKeys.delete(key);
        }

        this.#stringKeys.set(key, value);
    }

    /**
     * 
     * @param {Object} abstract 
     * @param {Object} concrete 
     * @param {boolean} override 
     */
    bind(abstract, concrete, override = false) {

        this.#_setupVirtualDependent(abstract, concrete);
        this.#_bind(
            abstract, 
            concrete instanceof DecoratorConcrete ? concrete.type : concrete
        );

        return new IocBindingOption(
            this.#global, 
            this, 
            {
                tagFor: abstract
            }
        );
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     */
    #_setupVirtualDependent(abstract, concrete) {

        const isVirtualDependent = concrete instanceof DecoratorConcrete;

        concrete = isVirtualDependent ? concrete.type : concrete;
        checkType(abstract, concrete);

        const virtualClass = !isVirtualDependent ? 
                    generateVirtualClass(concrete)
                    : concrete;

        this.#virtualConretes.set(concrete, virtualClass);
    }

    #_bind(abstract, actualConcrete) {

        checkType(abstract, actualConcrete);

        if (this.#container.has(abstract) && override) {

            this.#container.delete(abstract);
        }

        this.#container.set(abstract, actualConcrete);
    }

    // #_buildVirtualConcrete(concrete) {

    //     if (!hasPseudoConstructor(concrete)) {

    //         return;
    //     }

    //     const virtualConcrete = generateVirtualClass(_class);

    //     this.#virtualConretes.set(concrete, virtualConcrete);
    // }

    /**
     * 
     * @param {Object} abstract 
     * @param {Object} concrete 
     * @param {boolean} override 
     */
    bindSingleton(abstract, concrete, override = false) {

        this.bind(abstract, concrete, override);

        if (this.#singleton.has(abstract) && override) {

            this.#singleton.delete(abstract);
        }

        const empty = this.#objectsPool[EMPTY];

        this.#singleton.set(abstract, empty);

        return super.bindSingleton();
    }

    /**
     * 
     * @param {Object} _abstract 
     * @returns {boolean} 
     */
    has(_abstract) {

        return this.#container.has(_abstract);
    }

    /**
     * 
     * @param {string} key 
     * @returns {boolean}
     */
    hasKey(key) {

        return this.#stringKeys.has(key);
    }

    /**
     * 
     * @param {string} key 
     * @returns {Object | undefined}
     */
    getConcreteByKey(key) {

        const abstract = this.getAbstractByKey(key);

        if (abstract) {

            return this.getConcreteOf(abstract);
        }
        else {

            return undefined;
        }
    }

    hasAbstract(abstract) {

        return this.#container.has(abstract);
    }

    /**
     * 
     * @param {Object} abstract 
     * @returns {Object | undefined}
     */
    getConcreteOf(abstract) {

        return this.#container.get(abstract);
    }

    #_getConcreteOf(abstract) {

        const actualConcrete = this.getConcreteOf(abstract);

        return this.#virtualConretes.get(actualConcrete) ?? actualConcrete;
    }

    /**
     * 
     * @param {string} key 
     * @returns {Object | undefined}
     */
    getAbstractByKey(key) {

        if (!this.#stringKeys.has(key)) return undefined;

        return this.#stringKeys.get(key);
    }

    /**
     * 
     * @param {Object} _abstract 
     * @returns {boolean}
     */
    hasSingleton(_abstract) {

        return this.#singleton.has(_abstract);
    }

    #resolveSingpleton(abstract) {

        const obj = this.#singleton.get(abstract);

        if (obj.constructor === Empty) {

            //const concrete = this.#container.get(abstract);
            const concrete = this.#_getConcreteOf(abstract);
            const instance = this.build(concrete);

            this.#singleton.delete(abstract);
            this.#singleton.set(abstract, instance);

            return instance;
        }
        else {

            return obj;
        }
    }

    hasSingletonObjectOf(abstract) {

        return !(this.#singleton.get(abstract) instanceof Empty); 
    }

    getSingletonObjectOf(abstract) {

        return this.#singleton.get(abstract);
    }

    // will overide the instantiated singleton instance
    setDefaultInstanceFor(_abstract, _instance) {

        if (!this.has(_abstract)) {

            throw new Error('');
        }

        const instancePrototype = _instance.constructor;

        checkType(_abstract, instancePrototype);

        if (this.#singleton.has(_abstract)) {

            this.#singleton.delete(_abstract);
            this.#singleton.set(_abstract, _instance);
        }
        else {

            throw new IocContainerSetDefaultInstanceError();
        }
    }
}