# Swapped!

Swapped! is a social platform that allows users to swap things they can't use for things they love!

## Functionality of the application

The application will allow creating/removing/updating/fetching swap items. Each swap item can optionally have an attachmented image.

Users need to sign in using the Auth0 sign in page, creating a new account or using their existing Google account.

Once signed in users can view their 'Swap feed' and 'My Swaps'.

### Swap feed

This is a list of swaps offered by other users. Users can 'Swap' the items posted by other users by clicking on the 'Swap' icon.
The user who posted the swap will be notified that their swap item has been 'Swapped'.

### My Swaps

Users also have private access to edit their own swaps, uploading an image or deleting or creating new swap items. They will also see a notification on their swap itme showing the number of 'Swaps' that item has from other users.

## Running the webapp locally

The frontend web application is built in JavaScript, TypeScript and React.

You will need to have Node.js and npm installed, this comes with Node.js and you can install it here: https://nodejs.org/en/download/
You can also install npm here: https://www.npmjs.com/get-npm

To run the webapp:

`cd client`
`npm install` or `npm i`
`npm run start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Connecting with backend deployed in AWS

You will need to edit the file `client/src/config.ts` providing configuration for AWS (`apiId`, `region` and `stage`) and auth0 (`domain`, `clientId` and `callbackUrl`)

### Creating a production build

`npm run build`

## Deploying the backend to AWS

The backend is build in TypeScript using Node.js. It is deployed to Amazon Web Services (AWS) using the serverless framework.
You will need to have Node.js https://nodejs.org/en/download/ and serverless framework https://serverless.com/framework/docs/providers/aws/guide/installation/ installed.

AWS credential will need to be set up https://serverless.com/framework/docs/providers/aws/guide/credentials/
For this you will also need to have an AWS account https://aws.amazon.com/

`cd backend`
`npm install` or `npm i`
`serverless deploy --verbose` or `sls deploy -v`

## Testing the api deployed on AWS

You will need to install Postman https://www.postman.com/
Import the postman collection file `Udacity Capstone Project.postman_collection.json`

Edit the collection and set the Variales values:
`apiId` - From output of `serverless deploy --verbose` or from AWS console.
`authToken` - From the browser console, after running the front end locally and logging in.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
