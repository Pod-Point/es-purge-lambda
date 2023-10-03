# es-purge-lambda

Lambda script written in TypeScript that cleans up old indices from AWS ES

### Local setup
- `nvm use` to use the correct nodejs version
- `npm install` to install the dependencies

### Lambda functions

* `purge` - Deletes old indices every day at 1:00 am

### Configuration

Edit your `.env.yml` to set AWS environment details and also copy `config.example.yml` to `config.yml`
to define the clusters to purge.

```env
config:
  - endpoint: https://search-domain-dhuid78.region.es.amazonaws.com/
    prefix: logstash-
    days: 30
    format: YYYY-MM-DD
```

#### Choosing the right configuration

If you go to an existing lambda function in AWS, you can select "Actions --> Export function --> Download function code .zip" to download a previous lambda functions. This will help you getting the right configuration in case you have to redeploy this function.

The current configuration looks like this, affecting both the production and staging instances of Elasticsearch:

```yml
config:
- endpoint: https://search-logging-comms-akhvx5t65sz7vsr2fqjst4k3me.eu-west-1.es.amazonaws.com/
  prefix: comms-
  days: 60
  format: YYYY-MM-DD
- endpoint: https://search-logging-comms-staging-mo3tdpfv5r5c2ieaqie4dh4fra.eu-west-1.es.amazonaws.com/
  prefix: comms-
  days: 60
  format: YYYY-MM-DD
```


### Deploy

Make sure to populate your `.env.yml` file with the correct values. You can find out the correct values by inspecting the lambda function in AWS and nothing down its execution role, region, as well as VPC security group and subnet -- and of course the stage you want to deploy this to. The current configuration looks like this:

```yml
STAGE: staging
AWS_ROLE: arn:aws:iam::959744386191:role/lambda_basic_execution
APP_AWS_REGION: eu-west-1
APP_VPC_SECURITY_GROUP: sg-4cd7922b
APP_VPC_SUBNET: subnet-2415dc7c
```

This function has to be deployed manually using the npm script `npm run deploy:production` for production and `npm run deploy:staging` for staging. (Depending on your local AWS setup, you might have to do this using `aws-vault`, for example `aws-vault exec pp-main -- npm run deploy:staging`.)

### Thanks

Heavily based on [aws-lambda-es-cleanup](https://github.com/cloudreach/aws-lambda-es-cleanup).
