const { IOC_NAMESPACE_DEFAULT } = require("./constant");
const IocInterface = require("./iocInterface");
const IocNamespace = require("./iocNamespace");

module.exports = class IocNamespaceMangager {

    /**
     *  @type {Map<string|Symbol|number, IocNamespace>}
     */
    #namespaces = new Map();

    constructor() {

        super();
        this.#init();
    }

    #init() {

        this.#_newNamespace(IOC_NAMESPACE_DEFAULT);
    }

    #_newNamespace(id) {

        if (this.#namespaces.has(id)) {

            return;
        }

        return this.#namespaces
                .set(id, new IocNamespace())
                .get(id);
    }

    /**
     * 
     * @param {string|symbol|number} id 
     * @returns {IocNamespace}
     */
    namespace(id = IOC_NAMESPACE_DEFAULT) {

        return this.get(id);
    }   

    /**
     * 
     * @param {string|symbol|number} namespaceId
     * @returns {IocNamespace}
     */
    get(namespaceId = IOC_NAMESPACE_DEFAULT) {

        namespaceId = this.#namespaces.has(namespaceId) ? namespaceId : IOC_NAMESPACE_DEFAULT;
        return this.#namespaces.get(namespaceId);
    }

    getOrNew(namespaceId) {

        return this.#namespaces.get(namespaceId) ?? 
                this.#_newNamespace(namespaceId);
    }
}