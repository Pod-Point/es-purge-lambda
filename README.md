# es-purge-lambda

Lambda script written in TypeScript that cleans up old indices from AWS ES

### Lambda functions

* `purge` - Deletes old indices every day at 1:00 am

### Config

Edit your `.env.yml` to set AWS environment details and also copy `config.example.yml` to `config.yml`
to define the clusters to purge.

```env
config:
  - endpoint: https://search-domain-dhuid78.region.es.amazonaws.com/
    prefix: logstash-
    days: 30
    format: YYYY-MM-DD
```

### Deploy

This function can be deployed with Serverless.

* `npm run deploy`

### Thanks

Heavily based on [aws-lambda-es-cleanup](https://github.com/cloudreach/aws-lambda-es-cleanup).
