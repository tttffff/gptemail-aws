# gptemail-aws
Example of using GitHub actions to deploy AWS Lambda functions and static websites to AWS S3.<br>
Original app idea taken from [gptemail](https://github.com/SeifELG/gptemail) but updated to use this deployment method.

## Prerequisites
- AWS account (Everything in this repository is free tier eligible for the first year)
- OpenAI API key
- GitHub account

## Extras that would be nice (maybe will add in the future)
- Create the user with minimal permissions
- Domain name + SSL certificate
- CloudFront distribution for the S3 bucket
- Throttling on the API Gateway

## Usage
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
   - Allow public access to the bucket
   - We will not need ACLs for this bucket
   - Additionally add the following bucket policy (to allow public access to all files):
    ```json
    {
      "Version": "2012-10-17",
        "Statement": [
          {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
          }
        ]
    }
    ```
   - In Properties -> Static website hosting, enable static website hosting and set the index document to `index.html`
   - Save the URL for the static website
7. Create an API gateway in AWS API Gateway (HTTP API)
   - Add the integration to the Lambda function created in step 5 and give the API a name.
   - Configure a route with method POST
   - Keep the default stage - no need to create a new stage
   - Open CORS settings and add the following:
     - Access-Control-Allow-Origin: URL of the static website from step 6
     - Access-Control-Allow-Methods: `POST`
     - Access-Control-Allow-Headers: `*`
   - Save the URL for the API + the route
8. Add the following secrets to your repository (settings -> secrets -> actions -> new repository secret):
    - `AWS_ACCESS_KEY_ID` - from step 4
    - `AWS_SECRET_ACCESS_KEY` - from step 4
    - `AWS_LAMBDA_FUNCTION` - from step 5
    - `AWS_REGION` - the region code of the AWS services (see [note](#usage) above)
    - `AWS_S3_BUCKET` - from step 6
    - `OPENAI_API_KEY` - your OpenAI API key
9. Update the `app.js` file in the `front_end` directory with the URL + route of the API from step 7
10. Commit the change and push to your repository, check to see if the GitHub actions run successfully 🏆
