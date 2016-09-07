# Hosting Parse Server on Pivotal Web Services

This is an example on how to deploy [Parse Server](https://github.com/ParsePlatform/parse-server) on [Pivotal Web Services](https://run.pivotal.io/).

## Deploy

### Setup the environment

* Set Up Your [PWS Account](https://docs.run.pivotal.io/starting/index.html#signup) (if you don’t have one already)
* Install the [cf CLI](https://docs.run.pivotal.io/starting/index.html#install-login)
* Login into [PWS](https://run.pivotal.io/) and select an org and space:

```
cf login api.run.pivotal.io
```

### Deploy the Parse Server

Clone this repository to your local workstation and deploy it to [PWS](https://run.pivotal.io/):

```
git clone https://github.com/cf-platform-eng/pws-parse-server
cd pws-parse-server
cf push
```

### Live Query Support

If you wish to use Parse's Live Query feature (e.g., for real-time updates in your application), update `server.js` with an array indicating the classes for which you would like Live Query support, and create a new instance of the LiveQueryServer object.

```
var parseServer = new ParseServer({
  ...
  liveQuery: {
    classNames: ["Friends", "Photos"] // List of classes to support for query subscriptions
  }
});

...

var parseLiveQueryServer = ParseServer.createLiveQueryServer(server); // where server is your Express application.
```

In your client Parse application, specify the URL of your Parse Live Query server, making sure to use the `wss` protocol and specifying `4443` as the port.

```
Parse.liveQueryServerURL = 'wss://your-server-url.cfapps.io:4443';
```

#### MongoDB backend

[Parse Server](https://github.com/ParsePlatform/parse-server) uses [MongoDB](https://www.mongodb.org/) as the backend database, so we will need to create a MongoDB database using the PWS service's [marketplace](https://docs.run.pivotal.io/marketplace/) and bind it to the application:

```
cf create-service mongolab sandbox parse-mongodb
cf bind-service parse-server parse-mongodb
cf restage parse-server
```

### Test the Parse Server

Call the Parse Server Cloud function using the REST API:

```
curl -X POST \
  -H "X-Parse-Application-Id: APP-ID" \
  -H "X-Parse-REST-API-Key: MASTER-KEY" \
  -H "Content-Type: application/json" \
  -d '{}' http://parse-server-<random word>.cfapps.io/parse/functions/hello
```

**Note**: replace `parse-server-<random word>.cfapps.io` with the URL assigned to your application.

## Copyright

Copyright (c) 2016 Pivotal Software Inc. See [LICENSE](https://github.com/cf-platform-eng/pws-parse-server/blob/master/LICENSE) for details.
