const {initMetadata} = require('reflectype/src/libs/propertyDecorator.js');
//const traps = require('../src/dependencies/proxyTraps/autowiredMethodTraps.js');
const { placeAutoWiredMetadata, isPropMetaAutowired } = require('../src/utils/decorator/autowire.util.js');

const traps = {
    /**
     * 
     * @param {Function} target 
     * @param {Object} _this 
     * @param {Iterable} args 
     * @returns 
     */
    apply: function(target, _this, args) {

        /**@type {Context?} */
        const context = _this.context;
        const DI = context?.global?.DI;
        
        if (args.length > 0 || typeof DI?.invoke !== 'function') {
            
            return target.call(_this, ...args);
        }
        
        return DI.invoke(_this, target, context);
    }
}

module.exports = autowiređ;

function autowiređ(_prop, _context) {

    const {kind} = _context;
    const propMeta = initMetadata(_prop, _context);

    if (isPropMetaAutowired(propMeta)) {

        return _prop;
    }

    if (kind === 'method') {

        _prop = wrappMethod(_prop);
    }

    placeAutoWiredMetadata(propMeta);

    return _prop;
}

function wrappMethod(_func) {

    if (typeof _func !== 'function') {

        throw new Error('invalid usage of @autowired');
    }

    return new Proxy(_func, traps);
}

