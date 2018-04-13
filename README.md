# slack-relay-lambda

Lambda script written in TypeScript that cleans up old indices from AWS ES

### Lambda functions

* `purge` - Deletes old indices every day at 1:00 am

### Config

Edit your `.env.yml`. For example:

```env
INDEX_PREFIX: logstash-
DAYS_TO_KEEP: 30
DATE_FORMAT: YYYY-MM-DD
```

### Deploy

This function can be deployed with Serverless.

* `npm run deploy`

### Thanks

Heavily based on [aws-lambda-es-cleanup](https://github.com/cloudreach/aws-lambda-es-cleanup).
