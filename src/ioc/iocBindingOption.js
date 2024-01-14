/**
 * @typedef {import('./iocNamespaceManager.js')} IocNamespaceMangager
 * @typedef {import('./iocNamespace.js') IocNamespace
 */

module.exports = class IocBindingOption {

    /** @type {IocNamespaceMangager}*/
    #global;
    /** @type {IocNamespace} */
    #namespace;
    #options;

    constructor(global, namespace, options = {}) {

        this.#global = global;
        this.#namespace = namespace;
    }

    tag() {

        const targetClass = this.#options?.tagFor;

        this.#global.setTagFor()
    }
}