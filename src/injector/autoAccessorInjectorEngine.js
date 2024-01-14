const Injector = require("./injector");
//const {getTypeMetadata} = require('../../utils/metadata.js');
const { isPropMetaAutowired } = require("../utils/decorator/autowire.util.js");
const ReflectionClassPrototype = require("reflectype/src/metadata/prototypeReflection/reflectionClassPrototype.js");
const ReflectionPrototypeAttribute = require("reflectype/src/metadata/prototypeReflection/reflectionPrototypeAttribute.js");

/**
 * @typedef {import('reflectype/src/reflection/metadata.js').metadata_t} metadata_t
 * @typedef {import('reflectype/src/reflection/metadata.js').property_metadata_t} property_metadata_t
 * @typedef {import('reflectype/src/metadata/prototypeReflection/reflectionPrototypeAttribute.js')} ReflectionPrototypeAttribute
 */


// Inject dependenies to a particular object's field
module.exports = class AutoAccessorInjectorEngine extends Injector {

    constructor(_iocContainer) {

        super(...arguments);
    }

    #ableToInject(propMeta) {
        
        if (typeof propMeta !== 'object') {
                
            return false;
        }

        if (propMeta.isMethod) {

            return false;
        }

        if (typeof propMeta.type !== 'function') {

            return false;
        }

        return isPropMetaAutowired(propMeta);
    }

    /**
     * 
     * @param {*} _object 
     * @param {*} _scope 
     * @returns {boolean}
     */
    inject(_object, _scope) {

        const classReflection = new ReflectionClassPrototype(_object);

        if (!classReflection.isValid) {

            return false;
        }

        for (const /**@type {ReflectionPrototypeAttribute} */ attribute of classReflection.attributes) {

            if (!isPropMetaAutowired(attribute.metadata)) {

                continue;
            }

            const depInstance = this.resolveComponent(attribute.type, _scope);
            
            attribute.setValue(depInstance);
        }
        // /**@type {metadata_t} */
        // const meta = getTypeMetadata(_object);

        // const propertiesMeta = meta?.properties;
        
        // if (typeof propertiesMeta !== 'object') {

        //     return;
        // }

        // const propsName = Reflect.ownKeys(propertiesMeta);

        // for (const name of propsName) {
            
        //     /**@type {property_metadata_t} */
        //     const propMeta = propertiesMeta[name];
            
        //     if (!this.#ableToInject(propMeta)) {

        //         continue;
        //     }

        //     const propAccessor = propMeta.footPrint?.accessor;

        //     const {type} = propMeta;
        //     const isPrivate = propMeta.private;
        //     const setter = propAccessor?.set;
            
        //     //const theDependency = this.iocContainer.get(type, _scope);
        //     const theDependency = this.resolveComponent(type, _scope);

        //     if (typeof setter === 'function') {
                
        //         /**
        //          *  check if the setter of the field is bound with the object
        //          *  this operation happens because of changes
        //          *  after stage 3 of TC39 decorator proposal
        //          */
        //         if (typeof setter.prototype === 'object') {

        //             setter.call(_object, theDependency);
        //         }
        //         else {

        //             setter(theDependency)
        //         }

        //     }
        //     else if (isPrivate !== false) {
                
        //         _object[name] = theDependency;
        //     }
        // }
    }
}