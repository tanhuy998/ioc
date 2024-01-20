const AbstractReflection = require("reflectype/src/metadata/abstract/abstractReflection");
const { AUTOWIRED } = require("../utils/decorator/constant");


module.exports = class IDependencyDiscoverable {


    /**@type {WeakMap<Function, AbstractReflection>} */
    #reflectionPool = new WeakMap;

    /**@type {Set<Function>} */
    #blacklist = new Set();

    discover(_abstract) {

        this.cache(_abstract);

        if (!this.couldReflect(_abstract)) {

            return;
        }

        const reflection = this.#reflectionPool.get(_abstract);

        
    }

    _implementDiscovery(reflection) {


    }

    /**
     * @returns {typeof AbstractReflection}
     */
    _getReflectionClass() {


    }

    /**
     * 
     * @param {Function} _abstract 
     * @param {...any} extraOptions
     */
    cache(_abstract) {

        if (!isInstantiable(_abstract)) {

            throw new TypeError(`${_abstract?.name} is not instantiable`);
        }

        if (this.#reflectionPool.has(_abstract)) {

            return;
        }

        const ReflectionClass = this._getReflectionClass();
        const reflection = new ReflectionClass(_abstract);

        if (!reflection?.isValid) {

            this.#blacklist.add(_abstract);
            return;
        }

        this.#reflectionPool.set(_abstract, reflection);
    }

    couldReflect(_abstract) {

        if (this.#blacklist.has(_abstract)) {

            return false;
        }

        if (this.hasCache(_abstract)) {

            return true;
        }
    }

    hasCache(_abstract) {

        return this.#reflectionPool.has(_abstract)
    }

    getCache(_abstract) {

        return this.#reflectionPool.get(_abstract);
    }
}