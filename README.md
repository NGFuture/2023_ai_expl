# AI Playground Application

This application allows you to explore and experiment with different AI services. It leverages the power of openAI, Google Cloud, and AWS to perform translation, summarization, and text-to-speech tasks.

Feel free to explore the various features and functionalities of the application, which serve as an excellent example of utilizing openAI, Google Cloud, and AWS services within a Next.js 13 app.

## Getting Started

To get started, follow these steps:

1. Clone the repository and navigate to the project directory.

2. Install the dependencies by running the following command:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open http://localhost:3000 in your browser to see the application in action.

## Credentials
Before using the AI services, you will need to obtain your own credentials for each of the following:

- openAI
- Google Cloud Text-to-Speech
- AWS Polly

### OpenAI
To obtain the OpenAI API key, follow the instructions provided at [OpenAI API Keys](https://openai.com/docs/authentication/) (you need to login to openai.com to use this link). Once you have the key, add it to your `.env` file using the following format:

```
OPENAI_API_KEY=*****
```
### Google Cloud Text-to-Speech
To acquire the key file for Google Cloud Text-to-Speech, refer to the guide on [Creating a new service account](https://cloud.google.com/docs/authentication/getting-started#create-service-account). Download the key file and specify its path in your `.env` file as shown below:

```
GOOGLE_APPLICATION_CREDENTIALS="D:\My_dir_with_keys\keys\ai*****.json"
```

To use AWS Polly, you will need to obtain the following credentials:

- accessKeyId
- secretAccessKey
- region

For a step-by-step guide, you can watch the helpful video tutorial [here](https://youtu.be/HuE-QhrmE1c). However, please make the following adjustments during the setup process:

- When creating a user (step 2), choose the policy "AmazonPollyFullAccess".
- When generating access keys in the security credentials tab, choose "Third-party service".

Once you have the accessKeyId, secretAccessKey, and region, create a folder and a file at src/config/aws.json with the following content:

```
{
  "credentials": {
    "accessKeyId": "********",
    "secretAccessKey": "********"
  },
  "region": "us-east-1"
}
```

Now you're all set to enjoy playing around with the AI services!

##Enjoy your AI playground experience!