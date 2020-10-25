const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { MySqlConnectionResolver } from '../../src/connect/MySqlConnectionResolver';

suite('MySqlConnectionResolver', ()=> {

    test('Connection Config', (done) => {
        let dbConfig = ConfigParams.fromTuples(
            'connection.host', 'localhost',
            'connection.port', 3306,
            'connection.database', 'test',
            'connection.ssl', false,
            'credential.username', 'mysql',
            'credential.password', 'mysql',
        );

        let resolver = new MySqlConnectionResolver();
        resolver.configure(dbConfig);

        resolver.resolve(null, (err, uri) => {
            assert.isNull(err);

            assert.isString(uri);
            assert.equal('mysql://mysql:mysql@localhost:3306/test?ssl=false', uri);

            done(err);
        });
    });
});