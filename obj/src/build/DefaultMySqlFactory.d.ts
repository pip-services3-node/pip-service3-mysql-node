/** @module build */
import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';
/**
 * Creates MySql components by their descriptors.
 *
 * @see [[https://rawgit.com/pip-services-node/pip-services3-components-node/master/doc/api/classes/build.factory.html Factory]]
 * @see [[MySqlConnection]]
 */
export declare class DefaultMySqlFactory extends Factory {
    static readonly Descriptor: Descriptor;
    static readonly MySqlConnectionDescriptor: Descriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
