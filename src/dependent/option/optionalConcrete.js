const self = require("reflectype/src/utils/self");
const DecoratorConcrete = require("../decorator/decoratorConcrete");
//const { hasPseudoConstructor } = require("../virtual/virtualDependent");
const ReflectionPrototypeMethod = require("reflectype/src/metadata/prototypeReflection/reflectionPrototypeMethod");
const { CONSTRUCTOR } = require("../../constant");
const { isObjectLike, isInstantiable } = require("reflectype/src/libs/type");

module.exports = class OptionalConcrete {

    static constructorParams = {};
    static constructorParams = {
        1: 'asdasd',
        2: Function, // pass a typeof Function to tell ioc container to inject this param
        3: {
            value: Function // pass a class/function as exactly a value
        },
        4: {
            tag: 'sometag', // tell io container this param must be a 
        }

    }
    static type;
}