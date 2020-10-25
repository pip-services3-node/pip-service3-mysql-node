const process = require('process');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { MySqlConnection } from '../../src/persistence/MySqlConnection';
import { DummyPersistenceFixture } from '../fixtures/DummyPersistenceFixture';
import { DummyMySqlPersistence } from './DummyMySqlPersistence';

suite('DummyMySqlConnection', ()=> {
    let connection: MySqlConnection;
    let persistence: DummyMySqlPersistence;
    let fixture: DummyPersistenceFixture;

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

        persistence = new DummyMySqlPersistence();
        persistence.setReferences(References.fromTuples(
            new Descriptor("pip-services", "connection", "mysql", "default", "1.0"), connection
        ));

        fixture = new DummyPersistenceFixture(persistence);

        connection.open(null, (err: any) => {
            if (err) {
                done(err);
                return;
            }

            persistence.open(null, (err: any) => {
                if (err) {
                    done(err);
                    return;
                }
    
                persistence.clear(null, (err) => {
                    done(err);
                });
            });
        });
    });

    teardown((done) => {
        connection.close(null, (err) => {
            persistence.close(null, done);
        });
    });

    test('Connection', (done) => {
        assert.isObject(connection.getConnection());
        assert.isString(connection.getDatabaseName());

        done();
    });

    test('Crud Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Batch Operations', (done) => {
        fixture.testBatchOperations(done);
    });
});