# Slack SmartThings Integration

## AWS Lambda

### AWS Setup

* Create AWS Account
* Navigate to `https://console.aws.amazon.com/lambda/home?region=<region>/create`
   * Select `Author from Scratch`
   * Enter `SmartThings-Slack` for `Function Name`
   * Select `Node.js 8.10` for `Runtime`
* Navigate/follow redirect to `Slack SmartThings` Function
   * Under `Function Code` select `Upload a .zip file` for `Code entry type`
   * Upload a `.zip` of the contents in `lambda`
* Install aws-cli
* [Run](https://smartthings.developer.samsung.com/docs/guides/smartapps/aws-lambda.html):
```bash
aws lambda add-permission --function-name SmartThings-Slack --statement-id smartthings --principal 906037444270 --action lambda:InvokeFunction
```


### SmartThings Setup
* Navigate to https://smartthings.developer.samsung.com
* Click Login In
   * Sign into your Samsung Account or Create One
* Navigate to https://smartthings.developer.samsung.com/workspace/projects
* Create New Project
   * Select `Automation for the SmartThings App`
   * Enter `Slack`
   * Select `Register Automation SmartApp`
   * Select `AWS Lambda`
   * Enter ARN from the upper right hand corner of your function configuration page
   * Select device read (r:devices:*) and execution (x:devices:*) for scopes
   * Enter `Slack` for Automation Display Name

