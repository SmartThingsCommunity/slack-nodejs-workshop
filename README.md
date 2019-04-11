# Slack SmartThings Integration

## AWS Lambda

### AWS Setup

* Create AWS Account
* Navigate to `https://console.aws.amazon.com/lambda/home?region=us-east-2#/create`
   * Select `Author from Scratch`
   * Enter `SmartThings-Slack` for `Function Name`
   * Select `Node.js 8.10` for `Runtime`
   * Expand `Choose or create an execution role` and name the role `SmartThings-Slack`
   * Click `Create function`
* From your `SmartThings-Slack` Function page
   * Under `Configuration` select `API Gateway` from the `Add triggers` section
      * Scroll down and select `Open` for your API Gateway's security setting
      * Make sure `Create a new API` is selected as well
      * Click `Add` (bottom right) and then `Save` (top right)
      * Under your API Gateway's configuration details, you'll see a URL marked as your "API Endpoint". This is the URL to your Lambda — click it and you should see a page with `"Hello from Lambda!"` displayed.
   * Under `Function Code` select `Upload a .zip file` for `Code entry type`
   * Upload a `.zip` of the contents in `lambda`
* Install aws-cli
* [Run](https://smartthings.developer.samsung.com/docs/guides/smartapps/aws-lambda.html):
```bash
aws lambda add-permission --function-name SmartThings-Slack --statement-id smartthings --principal 906037444270 --action lambda:InvokeFunction
```
   * Depending on your AWS CLI setup, you may need to add `--profile <some_profile_name>` or `--region us-east-2` to that CLI command to make things work
   * If you need to verify that your profile is set up and is touching the correct Lambda functions, run `aws lambda list-functions --region us-east-2 --profile <your_profile_name>` and verify that the SmartThings-Slack Lambda function shows up in the list.


### SmartThings Setup
* Navigate to https://smartthings.developer.samsung.com/workspace/projects
* Click "Log in With Samsung Account"
   * Sign into your Samsung account or create one
* Create a new project
   * Select `Automation for the SmartThings App`
   * Enter `Slack`
   * Select `Register Automation SmartApp`
   * Select `AWS Lambda`
   * Enter the ARN from the top right corner of your Lambda function configuration page, then click Next
   * Select device read (`r:devices:*`) and device execute (`x:devices:*`) for scopes, then click Next
   * Enter `Slack` for Automation Display Name
   * Click Save
