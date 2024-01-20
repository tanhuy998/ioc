const IocInterface = require("./interfaces/iocInterface");

/**
 * @typedef {import('./iocContainer')} IocContainer
 */

/**
 * IocNamespaceProxy class prevents ioc namespace manager from initiating 
 * inaction namespace that is not declared.
 */
module.exports = class IocNameSpaceProxy extends IocInterface {

    /**@type {IocContainer} */
    #iocContainer;
    #namespaceId;

    constructor(namespaceId, iocContainer) {

        this.#namespaceId = namespaceId;
        this.#iocContainer = iocContainer;
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bind(
        abstract, 
        concrete, 
        options = {
            namespace: this.#namespaceId
        }
    ) {

        this.#initOptions(options);
        this.#iocContainer.bind(...arguments);
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
            namespace: this.#namespaceId    
        }
    ) {

        this.#initOptions(options);
        this.iocContainer.bindSingleton(...arguments);
    }

    get(abstract, _constructorArgs = {}, namespaceId = IOC_NAMESPACE_DEFAULT) {

        
    }

    builđ(_class) {


    }

    setSingletonDefaultInstance() {

        
    }

    #initOptions(options) {

        const optionNamspace = options.namespace;
        options.namespace = optionNamspace === this.#namespaceId ? optionNamspace : this.#namespaceId;
    }
}