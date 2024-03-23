# gptemail-aws
Example of using GitHub actions to deploy AWS Lambda functions and static websites to AWS S3.<br>
Includes instructions on how to set up the AWS services to do this including getting HTTPS and a CDN.<br>
Original app idea taken from [gptemail](https://github.com/SeifELG/gptemail) but updated to use this deployment method.

## Prerequisites
- AWS account (Everything here is free tier eligible for the first year)
- OpenAI API key
- GitHub account

## Extras that would be nice (maybe will add in the future)
- Create the user with minimal permissions
- Throttling on the API Gateway
- Instructions for custom domain setup
- Explanation of the infrastructure with diagrams

## Setup
**The below assumes that you are setting up the AWS services in the same region.**<br>
**You can see the region in the top right, along with the region code (you will need this).**
1. Fork this repository
2. Create a new AWS user and a new group with the following permissions:
   - AWSLambda_FullAccess
   - AmazonS3_FullAccess
3. Add user to the group
4. Create an access key for that user, save the access key and secret key
5. Create a lambda function in AWS Lambda, save the name of the function
6. Create an S3 bucket in AWS S3, save the name of the bucket
   - Can leave defaults including no public access and no ACLs
7. Create an API gateway in AWS API Gateway (HTTP API)
   - Add the integration to the Lambda function created in step 5 and give the API a name.
   - Configure a route with method POST, add /api as part of this i.e. /api/fixEmail
   - Keep the default stage - no need to create a new stage
8. Create a CloudFront distribution in AWS CloudFront
   - Add the S3 bucket from step 6 as the origin domain
   - Tick Origin access control settings
   - Create new OAC with default settings
   - Set Redirect HTTP to HTTPS
   - Enable security protections
   - Everything else can be left as default
   - Press save and notice the banner to update your bucket policy
     - Click copy policy
     - Open the S3 bucket and go to permissions -> bucket policy
     - Paste the policy and save
   - Now go back to the CloudFront distribution, open Origins and create a new (additional) origin
     - The origin domain is the API gateway from step 7, everything else can be left as default
   - Now open Behaviors and create a new (additional) behavior
     - The path pattern is /api/*
     - The origin is the API gateway origin you've just created
     - May as well use HTTPS only for this
     - Allowed HTTP methods should include POST
     - Change the Origin request policy to the recommended one (AllViewerExceptHostHeader)
9. Add the following secrets to your repository (settings -> secrets -> actions -> new repository secret):
    - `AWS_ACCESS_KEY_ID` - from step 4
    - `AWS_SECRET_ACCESS_KEY` - from step 4
    - `AWS_LAMBDA_FUNCTION` - from step 5
    - `AWS_REGION` - the region code of the AWS services (see [note](#usage) above)
    - `AWS_S3_BUCKET` - from step 6
    - `OPENAI_API_KEY` - your OpenAI API key
10. Run the GitHub actions by pushing to main, or selecting them in GitHub. Check to see if the GitHub actions run successfully 🏆

## Usage
Get the Distribution domain name from CloudFront and open it in your browser. Test the app 🚀
