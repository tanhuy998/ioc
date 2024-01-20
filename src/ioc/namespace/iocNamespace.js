const { checkType } = require('../../utils/iocType.util.js');
//const isAbstract = require('reflectype/src/utils/isAbstract.js');

//const Interface = require('reflectype/src/interface/interface.js');
const ObjectInjectorEngine = require('../../injector/objectInjectorEngine.js');
const IocContainerSetDefaultInstanceError = require('../../errors/iocContainerSetDefaultInstanceError.js');
const { hasPseudoConstructor, generateVirtualClass, isVirtualClass } = require('../../dependent/virtual/virtualDependent.js');
const IocInterface = require("../interfaces/iocInterface.js");
const IocBindingOption = require('./iocBindingOption.js');
const iocContainerInterface = require('../interfaces/iocContainerInterface.js');
const DecoratorConcrete = require('../../dependent/decorator/decoratorConcrete.js');
const OptionalConcrete = require('../../dependent/option/optionalConcrete.js');
const { ioc_seed_t } = require('./iocSeed.js');
const IocTagManager = require('../tag/iocTagManager.js');
const { matchType, matchTypeOrFail, isInstantiable } = require('reflectype/src/libs/type.js');

/**
 * @typedef {import('../iocContainer.js')} IocContainer
 */

class Empty {}

const SINGLETON_NOT_INSTANTIATED = 0;

module.exports = class IocNamespace {

    #id;

    /**
     * the first offest of the objects pool is an empty object
     */
    #objectsPool = [new Empty()];

    // /**@type {ObjectInjectorEngine} */
    // #objectInjector;

    /**@type {WeakMap<Function, ioc_seed_t>} */
    #seeds = new WeakMap();

    /** @type {IocContainer}*/
    #global;

    #tagManager = new IocTagManager();

    get id() {

        return this.#id;
    }

    constructor(id, global) {

        this.#id = id;
        this.#global = global;
        this.#init();
    }

    #init() {

        //this.#objectInjector = new ObjectInjectorEngine(this);
    }

    /**
     * @param {Function} abstract
     * @param {ioc_seed_t} seed 
     * @param {boolean} overide 
     */
    acquire(abstract, seed, overide = false) {

        if (!(seed instanceof ioc_seed_t)) {

            throw new Error('seed is not instance of ioc_seed_t');
        }

        this.#bind(...arguments);
        this.#setupIfSingleton(seed);
    }


    markSingleton(abstract) {

        if (!this.#seeds.has(abstract)) {

            throw new Error(`could not mark unregistered [${abstract.name}] as singleton`);
        }

        const seed = this.#seeds.get(abstract);
        this.#setupIfSingleton(seed);
    }

    /**
     * 
     * @param {ioc_seed_t} seed 
     */
    #setupIfSingleton(seed) {

        if (seed.singleton !== true) {

            return;
        }

        if (seed.singletonIndex > -1) {

            return;
        }

        seed.singletonIndex = SINGLETON_NOT_INSTANTIATED;
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {ioc_seed_t} seed 
     * @param {boolean} overide
     * @returns 
     */
    #bind(abstract, seed, overide) {

        this.#validateConcrete(seed.conrete);

        this.#_bind(...arguments);

        return new IocBindingOption(
            this.#global, 
            this, 
            {
                tagFor: abstract
            }
        );
    }

    #validateConcrete(concrete) {

        if (!isInstantiable(concrete)) {

            throw new Error();
        }
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {ioc_seed_t} seed 
     * @param {boolean} overide
     */
    #_bind(abstract, seed, overide) {

        checkType(abstract, seed.conrete);

        if (this.#seeds.has(abstract) && overide === true) {

            this.#seeds.delete(abstract);
        }
        else if (!overide) {

            throw new Error(`could not bind [${abstract.name}] because it it is bound before`);
        }

        this.#seeds.set(abstract, seed);
    }

    /**
     * 
     * @param {Object} _abstract 
     * @returns {boolean} 
     */
    has(_abstract) {

        return this.#seeds.has(_abstract);
    }

    hasAbstract(abstract) {

        return this.#seeds.has(abstract);
    }

    getSeed(abstract) {

        return this.#seeds.get(abstract);
    }

    /**
     * 
     * @param {Object} abstract 
     * @returns {Object | undefined}
     */
    getConcreteOf(abstract) {

        return this.#seeds.get(abstract)?.conrete;
    }

    /**
     * 
     * @param {Object} _abstract 
     * @returns {boolean}
     */
    hasSingleton(_abstract) {

        return this.#seeds.get(_abstract)?.singleton === true ? true : false;
    }

    isSingletonInstantiated(abstract) {

        const seed = this.#seeds.get(abstract);

        if (seed.singleton === false) {

            return undefined;
        }

        return seed.singletonIndex > 0 ? true : false;
    }

    getSingletonObjectOf(abstract) {

        const index = this.#seeds.get(abstract).singletonIndex;

        return index > SINGLETON_NOT_INSTANTIATED ? this.#objectsPool[index] : undefined;
    }

    setSingletonObject(abstract, instance) {

        const seed = this.#seeds.get(abstract);

        if (seed.singleton === false) {

            throw new Error(`could not set singleton object for non singleton on namespace '${this.id}'`);
        }

        if (seed.singletonIndex !== SINGLETON_NOT_INSTANTIATED) {

            throw new Error(`singleton object of [${abstract.name}] has been instantiated on namespace '${this.id}'`);
        }

        matchTypeOrFail(abstract, instance);

        this.#objectsPool.push(instance);
        seed.singletonIndex = this.#objectsPool.length - 1;
    }

    linkTag(tag, ) {

        this.#tagManager;
    }

    #_retrieveSingletonObject(abstract) {

        const index =  this.#seeds.get(abstract).singletonIndex;

        if (typeof index !== 'number') {

            return undefined;
        }

        return this.#objectsPool[index];
    }
}