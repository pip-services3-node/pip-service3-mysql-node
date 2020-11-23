"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module build */
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const MySqlConnection_1 = require("../persistence/MySqlConnection");
/**
 * Creates MySql components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[MySqlConnection]]
 */
class DefaultMySqlFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultMySqlFactory.MySqlConnectionDescriptor, MySqlConnection_1.MySqlConnection);
    }
}
exports.DefaultMySqlFactory = DefaultMySqlFactory;
DefaultMySqlFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "mysql", "default", "1.0");
DefaultMySqlFactory.MySqlConnectionDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "connection", "mysql", "*", "1.0");
//# sourceMappingURL=DefaultMySqlFactory.js.map