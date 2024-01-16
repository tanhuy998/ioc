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

/**
 * @typedef {import('../iocContainer.js')} IocContainer
 */

class Empty {}

const EMPTY = 0;

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

        super();
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

    /**
     * 
     * @param {ioc_seed_t} seed 
     */
    #setupIfSingleton(seed) {

        if (seed.singleton !== true) {

            return;
        }

        seed.singletonIndex = seed.singleton === true ? 0 : undefined;
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {ioc_seed_t} seed 
     * @param {boolean} overide
     * @returns 
     */
    #bind(abstract, seed, overide) {

        this.#_bind(...arguments);

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

        return index > 0 ? this.#objectsPool[index] : undefined;
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

    // /**
    //  * 
    //  * @param {string} key 
    //  * @returns {Object | undefined}
    //  */
    // getConcreteByKey(key) {

    //     const abstract = this.getAbstractByKey(key);

    //     if (abstract) {

    //         return this.getConcreteOf(abstract);
    //     }
    //     else {

    //         return undefined;
    //     }
    // }

    // #_getConcreteOf(abstract) {

    //     const actualConcrete = this.getConcreteOf(abstract);

    //     return this.#seeds.get(actualConcrete) ?? actualConcrete;
    // }

    // // will overide the instantiated singleton instance
    // setDefaultInstanceFor(_abstract, _instance) {

    //     if (!this.has(_abstract)) {

    //         throw new Error('');
    //     }

    //     const instancePrototype = _instance.constructor;

    //     checkType(_abstract, instancePrototype);

    //     if (this.#singleton.has(_abstract)) {

    //         this.#singleton.delete(_abstract);
    //         this.#singleton.set(_abstract, _instance);
    //     }
    //     else {

    //         throw new IocContainerSetDefaultInstanceError();
    //     }
    // }

    // /**
    //  * 
    //  * @param {Object} abstract 
    //  * @param {ioc_seed_t} seed 
    //  * @param {boolean} override 
    //  */
    // #bindSingleton(abstract, seed, override = false) {

    //     this.#bind(abstract, concrete, override);

    //     if (this.#singleton.has(abstract) && override) {

    //         this.#singleton.delete(abstract);
    //     }

    //     const empty = this.#objectsPool[EMPTY];

    //     this.#singleton.set(abstract, empty);

    //     return super.bindSingleton();
    // }

    // #resolveSingpleton(abstract) {

    //     const obj = this.#singleton.get(abstract);

    //     if (obj.constructor === Empty) {

    //         //const concrete = this.#seeds.get(abstract);
    //         const concrete = this.#_getConcreteOf(abstract);
    //         const instance = this.build(concrete);

    //         this.#singleton.delete(abstract);
    //         this.#singleton.set(abstract, instance);

    //         return instance;
    //     }
    //     else {

    //         return obj;
    //     }
    // }


    // /**
    //  * 
    //  * @param {string} key 
    //  * @returns {Object | undefined}
    //  */
    // getAbstractByKey(key) {

    //     if (!this.#stringKeys.has(key)) return undefined;

    //     return this.#stringKeys.get(key);
    // }

    // /**
    //  * 
    //  * @param {string} key 
    //  * @returns {boolean}
    //  */
    // hasKey(key) {

    //     return this.#stringKeys.has(key);
    // }

    // #_buildVirtualConcrete(concrete) {

    //     if (!hasPseudoConstructor(concrete)) {

    //         return;
    //     }

    //     const virtualConcrete = generateVirtualClass(_class);

    //     this.#seeds.set(concrete, virtualConcrete);
    // }

    // bindArbitrary(key, value) {

    //     if (this.#stringKeys.has(key)) {

    //         this.#stringKeys.delete(key);
    //     }

    //     this.#stringKeys.set(key, value);
    // }

    // /**
    //  * 
    //  * @param {Function} abstract 
    //  * @param {Function} concrete 
    //  */
    // #_setupVirtualDependent(abstract, concrete) {

    //     const isVirtualDependent = concrete instanceof OptionalConcrete;

    //     concrete = isVirtualDependent ? concrete.type : concrete;
    //     checkType(abstract, concrete);

    //     const virtualClass = !isVirtualDependent ? 
    //                 generateVirtualClass(concrete)
    //                 : concrete;

    //     this.#seeds.set(concrete, virtualClass);
    // }
}