"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module persistence */
const _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
const MySqlConnectionResolver_1 = require("../connect/MySqlConnectionResolver");
/**
 * MySQL connection using plain driver.
 *
 * By defining a connection and sharing it through multiple persistence components
 * you can reduce number of used database connections.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:             (optional) a key to retrieve the connection from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]]
 *   - host:                      host name or IP address
 *   - port:                      port number (default: 27017)
 *   - uri:                       resource URI or connection string with all parameters in it
 * - credential(s):
 *   - store_key:                 (optional) a key to retrieve the credentials from [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/auth.icredentialstore.html ICredentialStore]]
 *   - username:                  user name
 *   - password:                  user password
 * - options:
 *   - connect_timeout:      (optional) number of milliseconds to wait before timing out when connecting a new client (default: 0)
 *   - idle_timeout:         (optional) number of milliseconds a client must sit idle in the pool and not be checked out (default: 10000)
 *   - max_pool_size:        (optional) maximum number of clients the pool should contain (default: 10)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/interfaces/connect.idiscovery.html IDiscovery]] services
 * - <code>\*:credential-store:\*:\*:1.0</code> (optional) Credential stores to resolve credentials
 *
 */
class MySqlConnection {
    /**
     * Creates a new instance of the connection component.
     */
    constructor() {
        this._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples(
        // connections.*
        // credential.*
        "options.connect_timeout", 0, "options.idle_timeout", 10000, "options.max_pool_size", 3);
        /**
         * The logger.
         */
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        /**
         * The connection resolver.
         */
        this._connectionResolver = new MySqlConnectionResolver_1.MySqlConnectionResolver();
        /**
         * The configuration options.
         */
        this._options = new pip_services3_commons_node_1.ConfigParams();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        config = config.setDefaults(this._defaultConfig);
        this._connectionResolver.configure(config);
        this._options = this._options.override(config.getSection("options"));
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._connection != null;
    }
    composeUriSettings(uri) {
        let maxPoolSize = this._options.getAsNullableInteger("max_pool_size");
        let connectTimeoutMS = this._options.getAsNullableInteger("connect_timeout");
        let idleTimeoutMS = this._options.getAsNullableInteger("idle_timeout");
        let settings = {
            multipleStatements: true,
            connectionLimit: maxPoolSize,
            connectTimeout: connectTimeoutMS,
        };
        let params = '';
        for (let key in settings) {
            if (params.length > 0)
                params += '&';
            params += key;
            let value = settings[key];
            if (value != null)
                params += '=' + value;
        }
        if (uri.indexOf('?') < 0)
            uri += '?' + params;
        else
            uri += '&' + params;
        return uri;
    }
    /**
     * Opens the component.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    open(correlationId, callback) {
        this._connectionResolver.resolve(correlationId, (err, uri) => {
            if (err) {
                if (callback)
                    callback(err);
                else
                    this._logger.error(correlationId, err, 'Failed to resolve MySql connection');
                return;
            }
            this._logger.debug(correlationId, "Connecting to mysql");
            try {
                uri = this.composeUriSettings(uri);
                let mysql = require('mysql');
                let pool = mysql.createPool(uri);
                // Try to connect
                pool.getConnection((err, connection) => {
                    if (err != null || connection == null) {
                        err = new pip_services3_commons_node_2.ConnectionException(correlationId, "CONNECT_FAILED", "Connection to mysql failed").withCause(err);
                    }
                    else {
                        this._connection = pool;
                        this._databaseName = connection.config.database;
                        connection.release();
                    }
                    if (callback)
                        callback(err);
                });
            }
            catch (ex) {
                let err = new pip_services3_commons_node_2.ConnectionException(correlationId, "CONNECT_FAILED", "Connection to mysql failed").withCause(ex);
                callback(err);
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param correlationId 	(optional) transaction id to trace execution through call chain.
     * @param callback 			callback function that receives error or null no errors occured.
     */
    close(correlationId, callback) {
        if (this._connection == null) {
            if (callback)
                callback(null);
            return;
        }
        this._connection.end((err) => {
            if (err)
                err = new pip_services3_commons_node_2.ConnectionException(correlationId, 'DISCONNECT_FAILED', 'Disconnect from mysql failed: ').withCause(err);
            else
                this._logger.debug(correlationId, "Disconnected from mysql database %s", this._databaseName);
            this._connection = null;
            this._databaseName = null;
            if (callback)
                callback(err);
        });
    }
    getConnection() {
        return this._connection;
    }
    getDatabaseName() {
        return this._databaseName;
    }
}
exports.MySqlConnection = MySqlConnection;
//# sourceMappingURL=MySqlConnection.js.map