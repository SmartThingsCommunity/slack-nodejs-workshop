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

### Slack Setup

* Navigate to https://api.slack.com/apps
   * If you don't have a Slack workspace yet, click "sign in to your Slack account" and then "Create a new workspace"
   * Input an email for your workspace, then input the 6 digit code that Slack will email to you
   * Give your workspace a name, like "SmartThings IoT Fuse"
   * For a project name, go with something like "SmartThings-Slack"
   * Skip adding teammates
   * Your workspace is created! You can log into it in the Slack app for desktop or just keep it open in a browser tab
* Click "sign into your Slack account" (after signing in you'll need to navigate back to https://api.slack.com/apps)
* Click "Create New App"
   * Name the app "ThingsBot"
   * For Development Slack Workspace, select the workspace you just logged into from the drop down
   * Create the app
* Scroll to the bottom of the Basic Information section for your app
   * Under Display Information, click "Add app icon"
      * Upload [this bot icon image](ThingsBot.png) from this repo to give your ThingsBot some identity
        (feel free to find your own bot face image if you'd prefer)
* In the Features section of the sidebar, navigate to "Slash Commands"
   * Choose "Create New Command"
      * Name the command `/thingsbot`
      * For the Request URL, input your Lambda's API endpoint
         * Your API endpoint is the API Gateway URL that we set up earlier. It can be found on your Lambda's settings page by selecting the API Gateway trigger
      * For Short Description, input "Interact with SmartThings"
      * Click Save
* Navigate to "Install App" in the Slack API website sidebar
   * Click Install App to Workspace
   * Authorize the app
* Navigate to "OAuth & Permissions" in the Slack API website sidebar
   * Click "Add New Redirect URL"
   * Add your API Gateway URL as a redirect URL
   * Click "Save URLs"
* Navigate to "Interactive Components" in the Slack API website sidebar
   * Flip the Interactivity switch to On
   * For the Request URL, input `<YOUR_API_GATEWAY_URL>/slack/receive`
   * Click "Save Changes"
