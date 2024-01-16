

module.exports = {
    ioc_seed_t
}

function ioc_seed_t() {

    /**
     * @type {Function}
     */
    this.conrete;

    /**
     * @type {boolean}
     */
    this.singleton = false;

    /**
     * If the dependency marked as single, 
     * singletonIndex indicate the index of the 
     * singleton instance that is stored in object pool
     * 
     * @type {number}
     */
    this.singletonIndex = undefined;

    /**
     * @type {Object}
     */
    this.constructArguments;
}