/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { MySqlConnection } from '../persistence/MySqlConnection';

/**
 * Creates MySql components by their descriptors.
 * 
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[MySqlConnection]]
 */
export class DefaultMySqlFactory extends Factory {
	public static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "mysql", "default", "1.0");
    public static readonly MySqlConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "mysql", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultMySqlFactory.MySqlConnectionDescriptor, MySqlConnection);
    }
}
