# Lambda SSL Check

## Development

1. install node-lambda

```
npm install -g node-lambda
```

3. Run node-lambda

```
node-lambda run
```

## Deployment

Add your slack token into `deploy.env` as

```
SLACK_TOKEN=$slack_token
```

And run
```
node-lambda deploy --configFile deploy.env
```
