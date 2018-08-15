import { Context, SNSEvent, Callback } from 'aws-lambda';
import { Client } from 'elasticsearch';
import * as moment from 'moment';
import * as HttpAmazonESConnector from 'http-aws-es';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Purge old ES indices.
 *
 * @param {SNSEvent} event
 * @param {Context} context
 * @param {Callback} callback
 * @returns {Promise}
 */
export async function handler(event: SNSEvent, context: Context, callback: Callback): Promise<void> {
    const data: ConfigFile = yaml.safeLoad(fs.readFileSync(path.resolve('./config.yml'), 'utf8'));

    data.config.forEach((definition: ClusterDefinition) => {
        deleteIndices(definition.endpoint, definition.prefix, definition.days, definition.format);
    });

    callback();
}

/**
 * Delete old indices from an ES cluster.
 *
 * @param {string} endpoint
 * @param {string} prefix
 * @param {number} days
 * @param {string} format
 * @returns {Promise}
 */
async function deleteIndices(endpoint: string, prefix: string, days: number, format: string): Promise<void> {
    const client = new Client({
        host: [endpoint],
        connectionClass: HttpAmazonESConnector,
    });

    const purgeDate: string = moment().subtract(days, 'd').format(format);

    const results: IndexData[] = await client.cat.indices({
        format: 'json',
        index: `${prefix}*`,
    });

    const indices: string[] = [];

    results.sort((a: IndexData, b: IndexData) => a.index.localeCompare(b.index)).forEach((result: IndexData) => {
        const indexDate: string = moment(result.index.slice(prefix.length)).format(format);

        if (indexDate < purgeDate) {
            console.log(`Deleting: ${prefix}${indexDate}`);

            indices.push(`${prefix}${indexDate}`);
        }
    });

    if (indices.length > 0) {
        client.indices.delete({
            index: indices,
        });
    }
}

interface IndexData {
    index: string;
}

interface ConfigFile {
    config: ClusterDefinition[];
}

interface ClusterDefinition {
    endpoint: string;
    prefix: string;
    days: number;
    format: string;
}
