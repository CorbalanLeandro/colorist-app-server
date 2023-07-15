# Colorist App Server

This API purpose is to manage the Colorist users and their clients; to keep a record of the services that each client
has done.

The framework used is [Nestjs](https://nestjs.com/) and [MongoDB](https://www.mongodb.com/) database.
Unit and e2e tests are made with [Jest](https://jestjs.io/) but it's not complete yet.

## Herarchy

<b>Colorist</b>: The main entity is the Colorist, this entity represents the app users and they will have as child the clients. The username and email must be unique and are immutables.

<b>Client</b>: As the entity name implies, these are the Colorist's clients. As part or their entity properties will have the colorist's id to identify which one it belongs to. The Client children are the sheets.

<b>Sheet</b>: The Sheet entity is the hair services container and each sheet can only belong to one client. It have the client's and colorist's id that belongs to.

<b>Hair Service</b>: This entity has no children and have the client's service information. It have the sheet's, client's and colorist's id that belongs to.

## Authentication

The server uses JWT authentication and the token will expire after 1 day. The only APIs that are public are the colorist creation API and the sign in API.
Sign in API will provide the auth token to set on the `authorization` header for the authenticated APIs; it's a bearer token.

## Swagger

Thanks to Swagger we can document the API directly on the code and not only that, we can have an interface to interact with the API directly.

<b>Swagger interface</b>: https://colorist-app-server-production.up.railway.app/docs

Each API have example data and the schemas for the requests and responses.

## Usage

1. First thing to do is create your Colorist on the colorist create API ([POST /api/colorist](https://colorist-app-server-production.up.railway.app/api/colorist))
2. With your email or username you can sign in on the server and create your access token ([POST /api/auth/sign-in](https://colorist-app-server-production.up.railway.app/api/auth/sign-in))
3. Take this access token, set it on the `authorization` as a bearer token (`{ "headers": { "authorization": "Bearer ThEtOk3n.gOeS.Here" }}`)
4. It's time to create your first client! Send a request to the client creation API and keep that client `_id` with you ([POST /api/client](https://colorist-app-server-production.up.railway.app/api/client))
5. You will need a sheet to save the hair services that the client has done that day, let's create it with the client's `_id` on the sheet creation API ([POST /api/sheet](https://colorist-app-server-production.up.railway.app/api/sheet))
6. With the client's and sheet's `_id` you will be able to create all the hair services that client has done on the hair service creation API ([POST /api/hair-service](https://colorist-app-server-production.up.railway.app/api/hair-service))
7. Now you can check all the created information with the `find` APIs.
   - Find the current colorist information [GET /api/colorist](https://colorist-app-server-production.up.railway.app/api/colorist)
   - Find all the colorist's clients information [GET /api/client](https://colorist-app-server-production.up.railway.app/api/client)
   - Find a specific colorist's client information [GET /api/client/:clientId](https://colorist-app-server-production.up.railway.app/api/client/clientId)
   - Find a specific sheet information [GET /api/sheet/:sheetId](https://colorist-app-server-production.up.railway.app/api/sheet/sheetId)
   - Find a specific client's sheets information [GET /api/sheet/client/:clientId](https://colorist-app-server-production.up.railway.app/api/sheet/client/clientId)
   - Find a specific hair service information [GET /api/hair-service/:hair-serviceId](https://colorist-app-server-production.up.railway.app/api/hair-service/hair-serviceId)
   - Find a specific sheet's hair services information [GET /api/hair-service/sheet/:sheetId](https://colorist-app-server-production.up.railway.app/api/hair-service/sheet/sheetId)
8. Each delete API will not only remove the document itself, also the document children. For example, if a client is deleted, also the client's sheets and hair services will be removed.
