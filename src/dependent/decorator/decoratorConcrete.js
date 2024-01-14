const { matchType } = require("reflectype/src/libs/type");
const Any = require("reflectype/src/type/any");
const self = require("reflectype/src/utils/self");

module.exports = class DecoratorConcrete extends Any {

    static type = Any;

    #actualInstance;
    
    get actualInstance() {

        return this.#actualInstance;
    }

    constructor() {

        this.#init();
    }

    #init() {

        this._evaluate();

        const expectType = self(this).type;

        if (matchType(expectType, this.#actualInstance)) {

            const actualType = this.#actualInstance?.constructor;

            throw new ReferenceError(
                `DecoratorConcrete declared type and actual instance's type is mismatch, 
                expect [${expectType?.name || expectType}] but returned [${actualType?.name || expectType}]`
            );
        }
    }

    _evaluate() { }
}