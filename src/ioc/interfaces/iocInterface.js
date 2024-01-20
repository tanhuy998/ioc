const IocBindingOption = require("../namespace/iocBindingOption");

module.exports = class IocInterface {
    
    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bind(abstract, concrete) { }

    /**
     * 
     * @param {Function} abstract 
     * @param {Function} concrete 
     * @param {string|symbol|number} namespaceId 
     * @returns {IocBindingOption}
     */
    bindSingleton(abstract, concrete) { }
    get() {}
    setSingletonDefaultInstance() {}
    build() {}
}