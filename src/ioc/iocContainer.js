const { checkType } = require('../../utils/type.js');
const isAbstract = require('reflectype/src/utils/isAbstract.js');

const Interface = require('reflectype/src/interface/interface.js');
const ObjectInjectorEngine = require('../injector/objectInjectorEngine.js');
const IocContainerSetDefaultInstanceError = require('../errors/iocContainerSetDefaultInstanceError.js');
const { hasPseudoConstructor, generateVirtualClass } = require('./virtualDependent.js');
const IocNamespaceMangager = require('./iocNamespaceManager.js');
const IocNamespace = require('./iocNamespace.js');
const IocInterface = require('./iocInterface.js');
const { IOC_NAMESPACE_DEFAULT } = require('./constant.js');

class Empty {

    constructor() {

    };
}


const EMPTY = 0;

module.exports = class IocContainer extends IocInterface {

    // /**
    //  * the first offest of the objects pool is an empty object
    //  */
    // #objectsPool = [new Empty()];

    // /**
    //  * mapping table between abstracts and concretes
    //  */
    // #container = new WeakMap();
    // #stringKeys = new Map();

    // /**
    //  * singleton objects
    //  */
    // #singleton = new WeakMap();

    // /**@type {ObjectInjectorEngine} */
    // #objectInjector;
    // #virtualConretes = new WeakMap();

    // constructor() {

    //     this.#init();
    // }

    // #init() {

    //     this.#objectInjector = new ObjectInjectorEngine(this);
    // }

    // bindArbitrary(key, value) {

    //     if (this.#stringKeys.has(key)) {

    //         this.#stringKeys.delete(key);
    //     }

    //     this.#stringKeys.set(key, value);
    // }

    // /**
    //  * 
    //  * @param {Object} abstract 
    //  * @param {Object} concrete 
    //  * @param {boolean} override 
    //  */
    // bind(abstract, concrete, override = false) {

    //     checkType(abstract, concrete);

    //     if (this.#container.has(abstract) && override) {

    //         this.#container.delete(abstract);
    //     }

    //     this.#container.set(abstract, concrete);
    //     // this.#_buildVirtualConcrete(abstract, concrete);
    // }

    // #_buildVirtualConcrete(concrete) {

    //     if (!hasPseudoConstructor(concrete)) {

    //         return;
    //     }

    //     const virtualConcrete = generateVirtualClass(_class);

    //     this.#virtualConretes.set(concrete, virtualConcrete);
    // }

    // /**
    //  * 
    //  * @param {Object} abstract 
    //  * @param {Object} concrete 
    //  * @param {boolean} override 
    //  */
    // bindSingleton(abstract, concrete, override = false) {

    //     this.bind(abstract, concrete, override);

    //     if (this.#singleton.has(abstract) && override) {

    //         this.#singleton.delete(abstract);
    //     }

    //     const empty = this.#objectsPool[EMPTY];

    //     this.#singleton.set(abstract, empty);
    // }

    // /**
    //  * 
    //  * @param {Object} _abstract 
    //  * @returns {boolean} 
    //  */
    // has(_abstract) {

    //     return this.#container.has(_abstract);
    // }

    // /**
    //  * 
    //  * @param {string} key 
    //  * @returns {boolean}
    //  */
    // hasKey(key) {

    //     return this.#stringKeys.has(key);
    // }

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

    // /**
    //  * 
    //  * @param {Object} abstract 
    //  * @returns {Object | undefined}
    //  */
    // getConcreteOf(abstract) {

    //     return this.#container.get(abstract);
    // }

    // #_getConcreteOf(abstract) {

    //     const actualConcrete = this.getConcreteOf(abstract);

    //     return this.#virtualConretes.get(actualConcrete) ?? actualConcrete;
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
    //  * @param {Object} _abstract 
    //  * @returns {boolean}
    //  */
    // hasSingleton(_abstract) {

    //     return this.#singleton.has(_abstract);
    // }

    // /**
    //  * 
    //  * @param {Object} abstract 
    //  * @param {Object} _constructorArgs 
    //  * @returns {Object | undefined}
    //  */
    // get(abstract, _constructorArgs = {}) {

    //     if (!this.#container.has(abstract)) {

    //         return undefined;
    //     }

    //     if (this.#singleton.has(abstract)) {

    //         return this.#resolveSingpleton(abstract);
    //     }
    //     else {

    //         //const concrete = this.#container.get(abstract);
    //         const concrete = this.#_getConcreteOf(abstract);

    //         return this.build(concrete);
    //     }
    // }

    // #resolveSingpleton(abstract) {

    //     const obj = this.#singleton.get(abstract);

    //     if (obj.constructor === Empty) {

    //         //const concrete = this.#container.get(abstract);
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
    //  * @param {string} key 
    //  * @param {Object} _constructorArgs 
    //  * @returns {Object | undefined} 
    //  */
    // getByKey(key, _constructorArgs = {}) {

    //     if (!this.#stringKeys.has(key)) return undefined;

    //     const abstract = this.#stringKeys.get(key);
    //     const concrete =  this.get(abstract, _constructorArgs);

    //     if (concrete) {

    //         return concrete;
    //     } 
    //     else {

    //         return this.build(abstract);
    //     }
    // }

    #namespaceManager = new IocNamespaceMangager();
    #objectInjector;

    constructor() {

        this.#init();
    }

    #init() {

        this.#objectInjector = new ObjectInjectorEngine(this);
    }

    bind(abstract, concrete, namespaceId = IOC_NAMESPACE_DEFAULT) {

        this.#namespaceManager
        .get(namespaceId)
        .bind(abstract, concrete);
        
        return super.bind();
    }

    bindSingleton(abstract, concrete, namespaceId = IOC_NAMESPACE_DEFAULT) {

        this.#namespaceManager
        .getOrNew(namespaceId)
        .bindSingleton(abstract, concrete);

        return super.bindSingleton();
    }

    bindArbitrary(tag, concrete) {

        this.#namespaceManager
        .get(IOC_NAMESPACE_DEFAULT)
        .bindArbitrary()
    }

    getConcreteOf(abstract, namespaceId) {

        return this.#namespaceManager
        .get(namespaceId)
        .getConcreteOf(abstract);
    }

    getConcreteByKey(key, namespaceId) {

        return this.#namespaceManager
        .get(namespaceId)
        .getConcreteByKey(key);
    }

    getAbstractByKey(key, namespaceId) {

        return this.#namespaceManager
        .get(namespaceId)
        .getAbstractByKey(key);
    }

    hasSingleton(abstract, namespaceId) {

        
    }

    /**
     * 
     * @param {Object} abstract 
     * @param {Object} _constructorArgs 
     * @returns {Object | undefined}
     */
    get(abstract, _constructorArgs = {}, namespaceId) {

        const namespace = this.#namespaceManager.namespace(namespaceId);

        if (!namespace.has(abstract)) {

            return this.build(abstract);
        }

        if (namespace.hasSingleton(abstract)) {

            return this.#resolveSingpleton(abstract, namespace);
        }
        else {

            //const concrete = this.#container.get(abstract);
            const concrete = namespace.getConcreteOf(abstract);
            return this.build(concrete);
        }
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {IocNamespace} namespace 
     */
    #resolveSingpleton(abstract, namespace) {

        if (!namespace.hasSingleton(abstract)) {

            throw new Error(`${namespace.id} has never bound ${abstract.name} as singleton`);
        }

        if (
            namespace.hasSingletonObjectOf(abstract)
        ) {

            return namespace.getSingletonObjectOf(abstract);
        }

        const concrete = namespace.getConcreteOf(abstract);
        const instance = this.build(concrete);

        namespace.setDefaultInstanceFor(abstract, instance);

        return instance;
    }

    setDefaultInstanceFor(abstract, instance, namespaceId) {

        return this.#namespaceManager
        .get(namespaceId)
        .setDefaultInstanceFor(abstract, instance);
    }

    build(concrete) {

        if (concrete instanceof Interface) {

            throw new TypeError('iocContainer refused to build instance of [Interface]');
        }

        if (!isAbstract(concrete)) {

            throw new Error(`cannot build [${concrete?.name ?? concrete}]`);
        }

        const instance = new concrete();
        this.#objectInjector.inject(instance);

        return instance;
    }
}



