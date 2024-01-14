const IocInterface = require("./iocInterface");

/**
 * @typedef {import('./iocNamespaceManager')} IocNamespaceMangager
 */

module.exports = class IocNameSpaceProxy extends IocInterface {

    /**@type {IocNamespaceMangager} */
    #namespaceManager;
    #namespaceId;

    constructor(namespaceId, namespaceManager) {

        this.#namespaceId = namespaceId;
        this.#namespaceManager = namespaceManager;
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bind(abstract, concrete) {

        return this.#namespaceManager
            .getOrNew(this.#namespaceId)
            .bind(abstract, concrete);
    }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bindSingleton(abstract, concrete) {

        return this.#namespaceManager
        .getOrNew(this.#namespaceId)
        .bindSingleton(abstract, concrete);
    }
}