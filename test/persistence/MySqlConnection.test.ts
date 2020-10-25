const assert = require('chai').assert;
const process = require('process');

import { ConfigParams } from 'pip-services3-commons-node';
import { MySqlConnection } from '../../src/persistence/MySqlConnection';

suite('MySqlConnection', ()=> {
    let connection: MySqlConnection;

    let mysqlUri = process.env['MYSQL_URI'];
    let mysqlHost = process.env['MYSQL_HOST'] || 'localhost';
    let mysqlPort = process.env['MYSQL_PORT'] || 3306;
    let mysqlDatabase = process.env['MYSQL_DB'] || 'test';
    let mysqlUser = process.env['MYSQL_USER'] || 'mysql';
    let mysqlPassword = process.env['MYSQL_PASSWORD'] || 'mysql';
    if (mysqlUri == null && mysqlHost == null)
        return;

    setup((done) => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.uri', mysqlUri,
            'connection.host', mysqlHost,
            'connection.port', mysqlPort,
            'connection.database', mysqlDatabase,
            'credential.username', mysqlUser,
            'credential.password', mysqlPassword
        );

        connection = new MySqlConnection();
        connection.configure(dbConfig);

        connection.open(null, done);
    });

    teardown((done) => {
        connection.close(null, done);
    });

    test('Open and Close', (done) => {
        assert.isObject(connection.getConnection());
        assert.isString(connection.getDatabaseName());

        done();
    });
});