const Injector = require("./injector");
const AutoAccessorInjectorEngine = require('./autoAccessorInjectorEngine');
const CouldNotInjectError = require('../errors/couldNotInjectError.js');
const {CONSTRUCTOR} = require('../constant.js');
const MethodInjectorEngine = require("./methodInjectorEngine.js");
const ReflectionClassPrototype = require("reflectype/src/metadata/prototypeReflection/reflectionClassPrototype.js");
const ReflectionQuerySubject = require("reflectype/src/metadata/query/reflectionQuerySubject.js");
const { FOOTPRINT } = require("reflectype/src/libs/constant.js");
const { AUTOWIRED } = require("../utils/decorator/constant.js");

/**
 * @typedef {Object} prototype_pair_t
 * @property {Object} classProto
 * @property {Object} objectProto
 */

module.exports = class ObjectInjectorEngine extends Injector {

    

    constructor(_iocContainer) {

        super(...arguments);
    }
    
    /**
     * 
     * @param {ReflectionClassPrototype} reflection 
     * @returns 
     */
    _implementDiscovery(reflection) {

        if (!reflection.isValid) {

            return;
        }

        this.#iterateAutowiredProperties(reflection);
        this.#iteratePseudoConstructorParams(reflection)
    }

    /**
     * 
     * @param {ReflectionClassPrototype} reflection 
     */
    #iterateAutowiredProperties(reflection) {

        const propMeta = reflection.mirror()
                            .from(ReflectionQuerySubject.PROTOTYPE)
                            .where({
                                isMethod: false,
                                FOOTPRINT: {
                                    AUTOWIRED: true
                                },
                            });

        
    }

    #iteratePseudoConstructorParams(reflection) {


    }

    _getReflectionClass() {

        return ReflectionClassPrototype;
    }

    /**
     * 
     * @param {Object} _object 
     */
    #traceProtoPseudoConstructorChain(_object, _scope) {

        

        const methodInjector = new MethodInjectorEngine(this.iocContainer);
        const fieldInjector = new AutoAccessorInjectorEngine(this.iocContainer);

        fieldInjector.inject(_object, _scope);
        methodInjector.inject()
    }

    /**
     * 
     * @param {Object} _object 
     * @returns {Array<prototype_pair_t>}
     */
    #resolvePrototypeStack(_object) {

        let classProto = _object.constructor;
        let objectProto = _object;
        const protoOrder = [];
        
        while (classProto !== null && classProto !== undefined && classProto?.constructor !== Object) {
            
            protoOrder.push({classProto, objectProto});

            classProto = classProto.__proto__;
            objectProto = objectProto.__proto__;
        }

        return protoOrder.reverse();
    }

    inject(_object, _scope) {

        if (!isObjectLikeq(_object)) {

            throw new CouldNotInjectError();
        }

        this.#traceProtoPseudoConstructorChain(_object, _scope);
    }
}