// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '07hl13ggw7'
const region = 'us-east-1'
const stage = 'dev'
export const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com/${stage}`

export const authConfig = {
  domain: 'dev-hw08mj11.eu.auth0.com',
  clientId: 'y43wQj9pMbeWjB4FJOguCRY4tdK3BIIV',
  callbackUrl: '/callback'
}
