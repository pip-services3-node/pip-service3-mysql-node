import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IdentifiableJsonMySqlPersistence } from '../../src/persistence/IdentifiableJsonMySqlPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyJsonMySqlPersistence 
    extends IdentifiableJsonMySqlPersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies_json');
        this.ensureTable();
        this.autoCreateObject('ALTER TABLE `dummies_json` ADD `data_key` VARCHAR(50) AS (JSON_UNQUOTE(`data`->"$.key"))');
        this.ensureIndex('dummies_json_key', { "data_key": 1 }, { unique: true });
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<Dummy>) => void): void {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = "";
        if (key != null)
            filterCondition += "data->key='" + key + "'";

        super.getPageByFilter(correlationId, filterCondition, paging, null, null, callback);
    }

    public getCountByFilter(correlationId: string, filter: FilterParams, 
        callback: (err: any, count: number) => void): void {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = "";
        if (key != null)
            filterCondition += "data->key='" + key + "'";

        super.getCountByFilter(correlationId, filterCondition, callback);
    }
}