# Lambda SSL Check

[![Code Climate](https://codeclimate.com/github/telusdigital/lambda-ssl-checker/badges/gpa.svg)](https://codeclimate.com/github/telusdigital/lambda-ssl-checker)

This is a simple lambda function that will check when SSL expires on a list of sites. It grabs a list of sites from an object in S3 and posts to a slack channel.

## Development

Unfortunately, I have not found a way to test and develop this locally. You will need to test on lambda with a basic S3 Put event that looks something like this.

```
{
  "Records": [
    {
      "eventVersion": "2.0",
      "eventTime": "1970-01-01T00:00:00.000Z",
      "requestParameters": {
        "sourceIPAddress": "127.0.0.1"
      },
      "s3": {
        "configurationId": "testConfigRule",
        "object": {
          "eTag": "0123456789abcdef0123456789abcdef",
          "sequencer": "0A1B2C3D4E5F678901",
          "key": "event.json",
          "size": 1024
        },
        "bucket": {
          "arn": "arn:aws:s3:::mybucket",
          "name": "$your-bucket",
          "ownerIdentity": {
            "principalId": "EXAMPLE"
          }
        },
        "s3SchemaVersion": "1.0"
      },
      "responseElements": {
        "x-amz-id-2": "EXAMPLE123/5678abcdefghijklambdaisawesome/mnopqrstuvwxyzABCDEFGH",
        "x-amz-request-id": "EXAMPLE123456789"
      },
      "awsRegion": "us-east-1",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "EXAMPLE"
      },
      "eventSource": "aws:s3"
    }
  ]
}
```

Once you have this test object configured, you can copy your event file to S3 like

```
aws s3 cp event.json s3://$your-bucket/event.json
```

**NOTE: This requires the [aws cli](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) tool**

You can then press the `test` button for your lambda function to test its functionality.

## Add New Sites

In order to add new sites to scan, just upload an updated file list to s3.

```
aws s3 cp event.json s3://$your-bucket/event.json
```

## Deploy Script

For this script, I am using [node-lambda](https://github.com/motdotla/node-lambda) for deployment. It requires you to set a few ENV variables before getting started.

1. Add secret ENV variables to `deploy.env`

 This script requires two ENV variables in deploy.env to post to slack.

 ```
 SLACK_TOKEN=
 SLACK_CHANNEL=
 ```

2. Add deployment ENV variables to `.env`

 These are ENV variables that node-lambda will use to deploy your script to lambda.

 ```
 AWS_ENVIRONMENT=development
 AWS_ACCESS_KEY_ID=
 AWS_SECRET_ACCESS_KEY=
 AWS_ROLE_ARN=
 AWS_REGION=us-east-1
 AWS_FUNCTION_NAME=ssl-check
 AWS_HANDLER=index.handler
 AWS_MODE=event
 AWS_MEMORY_SIZE=128
 AWS_TIMEOUT=8
 AWS_DESCRIPTION="Check SSL on sites"
 AWS_RUNTIME=nodejs
 ```

 - **AWS\_ROLE\_ARN** looks something like `arn:aws:iam::461957644563:role/lambda_s3_exec_role`


3. Deploy with node-lambda

 ```
 node-lambda deploy --configFile deploy.env
 ```
