//const { checkType } = require('../utils/iocType.util.js');
const isAbstract = require('reflectype/src/utils/isAbstract.js');

const Interface = require('reflectype/src/interface/interface.js');
const ObjectInjectorEngine = require('../injector/objectInjectorEngine.js');
//const IocContainerSetDefaultInstanceError = require('../errors/iocContainerSetDefaultInstanceError.js');
//const { hasPseudoConstructor, generateVirtualClass } = require('../dependent/virtual/virtualDependent.js');
const IocNamespaceMangager = require('./iocNamespaceManager.js');
const IocNamespace = require('./iocNamespace.js');
const { IOC_NAMESPACE_DEFAULT } = require('./constant.js');
const { isObjectKey } = require('reflectype/src/libs/type.js');
const iocContainerInterface = require('./iocContainerInterface.js');
const IocInterface = require('./iocInterface.js');
const IocBindingOption = require('./iocBindingOption.js');
const IocNameSpaceProxy = require('./iocNameSpaceProxy.js');


module.exports = class IocContainer extends iocContainerInterface {

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

        return new IocNameSpaceProxy(id, this.#namespaceManager);
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bind(abstract, concrete, namespaceId = IOC_NAMESPACE_DEFAULT) {

        return this.#namespaceManager
        .get(namespaceId)
        .bind(abstract, concrete);
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bindSingleton(abstract, concrete, namespaceId = IOC_NAMESPACE_DEFAULT) {

        return this.#namespaceManager
        .getOrNew(namespaceId)
        .bindSingleton(abstract, concrete);
    }

    bindArbitrary(tag, concrete) {

        return this.#namespaceManager
        .get(IOC_NAMESPACE_DEFAULT)
        .bindArbitrary();
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



