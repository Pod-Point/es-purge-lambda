import { Context, SNSEvent, Callback } from 'aws-lambda';
import { Client } from 'elasticsearch';
import * as moment from 'moment';
import * as HttpAmazonESConnector from 'http-aws-es';

/**
 * Purge old ES indices.
 *
 * @param {SNSEvent} event
 * @param {Context} context
 * @param {Callback} callback
 */
export async function handler(event: SNSEvent, context: Context, callback: Callback): Promise<void> {
    const client = new Client({
        host: [process.env.ES_ENDPOINT],
        connectionClass: HttpAmazonESConnector,
    });

    const purgeDate: string = moment().subtract(process.env.DAYS_TO_KEEP, 'd').format(process.env.DATE_FORMAT);

    const results: IndexData[] = await client.cat.indices({
        format: 'json',
        index: `${process.env.INDEX_PREFIX}*`,
    });

    results.forEach((result: IndexData) => {
        const indexDate: string = moment(result.index.slice(process.env.INDEX_PREFIX.length)).format('YYYY-MM-DD');

        if (indexDate < purgeDate) {
            console.log(`Deleting: ${process.env.INDEX_PREFIX}${indexDate}`);
        }
    });

    callback();
}

interface IndexData {
    index: string;
}
