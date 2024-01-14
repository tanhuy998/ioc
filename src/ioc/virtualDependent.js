const { isInstantiable } = require("reflectype/src/libs/type");
const { CONSTRUCTOR } = require("../constants");
const { ioc_seed_t } = require("./iocSeed");
const self = require("reflectype/src/utils/self");
const ReflectionPrototypeMethod = require("reflectype/src/metadata/prototypeReflection/reflectionPrototypeMethod");

module.exports = {
    hasPseudoConstructor,
    generateVirtualClass,
    isVirtualClass,
};

const IS_VIRTUAL_CLASS = '__virtual_class';

function isVirtualClass(_class) {

    return _class?.[IS_VIRTUAL_CLASS] === true;
}

/**
 * Check if aparticular class hsa defined a pseudo constructor except base class.
 * Base class's pseudo constructor would be skipped.
 * 
 * @param {Function} _class 
 * @returns {boolean}
 */
function hasPseudoConstructor(_class) {

    if (typeof _class !== 'function') {

        return false;
    }

    const methodReflection = new ReflectionPrototypeMethod(_class, CONSTRUCTOR);

    if (
        !methodReflection.isValidReflection ||
        !methodReflection.isValid
    ) {

        return checkPseudoConstructorOnPrototypeChain(_class);
    }

    return methodReflection.ownerClass === _class;    
}

/**
 * Check if aparticular class hsa defined a pseudo constructor except base class.
 * Base class's pseudo constructor would be skipped.
 * 
 * @param {Function} _class 
 * @returns {boolean}
 */
function checkPseudoConstructorOnPrototypeChain(_class) {

    const pseudoConstruct = _class.prototype[CONSTRUCTOR];

    if (typeof _class !== 'function') {

        return false;
    }

    if (typeof pseudoConstruct !== 'function') {

        return false;
    }

    let proto = _class.__proto__;

    while (proto) {

        if (
            proto[CONSTRUCTOR] === pseudoConstruct
        ) {
            return false;
        }

        proto = proto.__proto__;
        pseudoConstruct = proto.prototype[CONSTRUCTOR];
    }

    return true;
}

function generateVirtualClass(_originClass) {

    if (!isInstantiable(_originClass)) {

        throw new TypeError('_originClass is not instantiable');
    }

    if (!hasPseudoConstructor(_originClass)) {

        throw new TypeError('could not generate virtual class from _originClass');
    }

    return class extends _originClass {

        [IS_VIRTUAL_CLASS] = true;

        constructor(...args) {

            const last = args.length > 0 ? args.length -1 : 0;
            const hasSeed = args[last] instanceof ioc_seed_t;
            let seed;

            if (hasSeed) {
                seed = args[last];
                args.pop();
            }

            super(...args);
            this.#init(seed);
        }

        #init(seed) {

            if (iocSeed?.constructor !== ioc_seed_t) {

                return;
            }

            this.#_initializeAccessorProperties(seed);
            this.#_invokePseudoContructor(seed);
        }

        /**
         * 
         * @param {ioc_seed_t} seed 
         */
        #_initializeAccessorProperties(seed) {

            const {context, scope} = seed;
        }

        /**
         * 
         * @param {ioc_seed_t} iocSeed 
         */
        #_invokePseudoContructor(iocSeed) {

            if (!hasPseudoConstructor(self(this))) {

                return;
            }

            const {context, scope} = iocSeed;
        }
    }
}