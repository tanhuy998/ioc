//const { checkType } = require('../utils/iocType.util.js');
const isAbstract = require('reflectype/src/utils/isAbstract.js');

const Interface = require('reflectype/src/interface/interface.js');
const ObjectInjectorEngine = require('../injector/objectInjectorEngine.js');
//const IocContainerSetDefaultInstanceError = require('../errors/iocContainerSetDefaultInstanceError.js');
//const { hasPseudoConstructor, generateVirtualClass } = require('../dependent/virtual/virtualDependent.js');
const IocNamespaceMangager = require('./namespace/iocNamespaceManager.js');
const IocNamespace = require('./namespace/iocNamespace.js');
const { IOC_NAMESPACE_DEFAULT } = require('./constant.js');
const { isObjectKey } = require('reflectype/src/libs/type.js');
const iocContainerInterface = require('./interfaces/iocContainerInterface.js');
const IocInterface = require('./interfaces/iocInterface.js');
const IocBindingOption = require('./namespace/iocBindingOption.js');
const IocNameSpaceProxy = require('./iocNameSpaceProxy.js');
const { ioc_seed_t } = require('./namespace/iocSeed.js');


module.exports = class IocContainer extends IocInterface {

    #namespaceManager = new IocNamespaceMangager(this);
    #objectInjector;

    constructor() {

        this.#init();
    }

    #init() {

        this.#objectInjector = new ObjectInjectorEngine(this);
    }
    
    /**
     * 
     * @param {string|symbol|number} id 
     * @return {IocInterface}
     */
    namespace(id) {

        if (!isObjectKey(id)) {

            throw new Error('need a namespace');
        }

        return new IocNameSpaceProxy(id, this);
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {Object} namespaceId 
     * @returns {IocBindingOption}
     */
    bind(
        abstract, 
        concrete, 
        options = {
            namespace: IOC_NAMESPACE_DEFAULT
        }
    ) {

        const seed = this.#bind(...arguments);

    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bindSingleton(
        abstract, 
        concrete, 
        options = {
            namespace: IOC_NAMESPACE_DEFAULT
        }
    ) {

        this.#bind(...arguments).singleton = true;
    }

    bindArbitrary(tag, concrete) {


    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {Object} options 
     * 
     * @returns {ioc_seed_t}
     */
    #bind(abstract, concrete, options) {

        const namespace = this.#namespaceManager.getOrNew(options.namespace);
        const seed = new ioc_seed_t();

        seed.conrete = concrete;
        seed.constructArguments = options.constructorArgs;

        namespace.acquire(abstract, seed);

        return
    }

    /**
     * 
     * @param {Object} abstract 
     * @param {Object} _constructorArgs 
     * @returns {Object | undefined}
     */
    get(abstract, _constructorArgs = {}, namespaceId = IOC_NAMESPACE_DEFAULT) {

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

    // setDefaultInstanceFor(abstract, instance, namespaceId) {

    //     return this.#namespaceManager
    //     .get(namespaceId)
    //     .setDefaultInstanceFor(abstract, instance);
    // }

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

    // getConcreteOf(abstract, namespaceId) {

    //     return this.#namespaceManager
    //     .get(namespaceId)
    //     .getConcreteOf(abstract);
    // }

    // getConcreteByKey(key, namespaceId) {

    //     return this.#namespaceManager
    //     .get(namespaceId)
    //     .getConcreteByKey(key);
    // }

    // getAbstractByKey(key, namespaceId) {

    //     return this.#namespaceManager
    //     .get(namespaceId)
    //     .getAbstractByKey(key);
    // }

    // hasSingleton(abstract, namespaceId) {

        
    // }
}



