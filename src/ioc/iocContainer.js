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

        const namespace = this.#bind(...arguments);

        return new IocNameSpaceProxy(namespace.id, this);
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

        const namespace = this.#bind(...arguments);
        namespace.markSingleton(abstract);
        
        return new IocNameSpaceProxy(namespace.id, this);
    }

    bindArbitrary(tag, concrete, options) {


    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {Object} options 
     * 
     * @returns {IocNamespace}
     */
    #bind(abstract, concrete, options) {

        const namespace = this.#namespaceManager.getOrNew(options.namespace);
        const seed = new ioc_seed_t();

        seed.conrete = concrete;
        seed.constructArguments = options.constructorArgs;

        namespace.acquire(abstract, seed);

        return namespace;
    }

    /**
     * 
     * @param {Object} abstract 
     * @param {Object} _constructorArgs 
     * @returns {Object | undefined}
     */
    get(abstract, _constructorArgs = {}, namespaceId = IOC_NAMESPACE_DEFAULT) {

        if (this.#namespaceManager.has(namespaceId)) {

            throw new Error(`could not get() from unregistered namespace ${namespaceId}`);
        }

        const namespace = this.#namespaceManager.namespace(namespaceId);

        if (!namespace.has(abstract)) {

            return this.#build(abstract, namespaceId, {args: _constructorArgs});
        }

        const seed = namespace.getSeed(abstract);

        if (
            seed.singleton &&
            namespace.isSingletonInstantiated(abstract)
        ) {

            return namespace.getSingletonObjectOf(abstract);
        }

        const instance = this.#build(seed.conrete, namespaceId, {args: _constructorArgs});

        if (seed.singleton) {

            namespace.setSingletonObject(abstract, instance);
        }

        return instance;
    }

    setSingletonDefaultInstance(abstract, instance, namespaceId = IOC_NAMESPACE_DEFAULT) {

        const namespace = this.#namespaceManager.get(namespaceId);

        if (!namespace) {

            throw new Error();
        }

        namespace.setSingletonObject(abstract, instance);
    }

    build(concrete, namespaceId, options) {


    }

    #build(_concrete, namespaceId, options) {

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



