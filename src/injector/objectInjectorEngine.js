const Injector = require("./injector");
const AutoAccessorInjectorEngine = require('./autoAccessorInjectorEngine');
const CouldNotInjectError = require('../errors/couldNotInjectError.js');
const {CONSTRUCTOR} = require('../constants.js');
const MethodInjectorEngine = require("./methodInjectorEngine.js");

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
     * @param {Object} _object 
     */
    #traceProtoPseudoConstructorChain(_object, _scope) {

        //const protoStack = this.#resolvePrototypeStack(_object);

        //const functionInjector = new FunctionInjectorEngine(this.iocContainer);
        const methodInjector = new MethodInjectorEngine(this.iocContainer);
        const fieldInjector = new AutoAccessorInjectorEngine(this.iocContainer);

        fieldInjector.inject(_object, _scope);
        methodInjector.inject()

        // the order of psudo constructor injection must be from base class to derived class
        // to insure the consitence and integrity of data
        // const pseudoConstructorStack = new Set();

        // for (const pair of protoStack || []) {

        //     const {classProto, objectProto} = pair;
        //     const pseudoConstructor = typeof classProto.prototype === 'object'? classProto.prototype[CONSTRUCTOR] : undefined;
            
        //     if (typeof pseudoConstructor !== 'function') {

        //         continue;       
        //     }

        //     const args = methodInjector.resolveComponentsFor({target: classProto, methodName: CONSTRUCTOR}, _scope);

        //     pseudoConstructor.call(_object, ...(args ?? []));

        //     // if (!pseudoConstructorStack.has(pseudoConstructor)) {

        //     //     const args = methodInjector.resolveComponentsFor({target: classProto, methodName: CONSTRUCTOR}, _scope);

        //     //     pseudoConstructor.call(_object, ...(args ?? []));
        //     //     pseudoConstructorStack.add(pseudoConstructor);
        //     // }
        //     //fieldInjector.inject(_object, _scope);
        // }
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