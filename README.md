# Mobile Web Specialist Certification Course
---
#### _Three Stage Course Material Project - Restaurant Reviews_

## Project Overview: Stage 3

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage Three**, you will take the connected application you built in Stage One and Stage Two and add additional functionality. You will add a form to allow users to create their own reviews. If the app is offline, your form will defer updating to the remote database until a connection is established. Finally, you’ll work to optimize your site to meet even stricter performance benchmarks than the previous project, and test again using **Lighthouse**.

## Specification

You will be provided code for an updated **Node development server** and a **README** for getting the server up and running locally on your computer. The README will also contain the API you will need to make JSON requests to the server. Once you have the server up, you will begin the work of improving your **Stage Two** project code.

>This server is different than the server from stage 2, and has added capabilities. Make sure you are using the **Stage Three** server as you develop your project. Connecting to this server is the same as with **Stage Two**, however.

You can find the documentation for the new server in the README file for the server.

Now that you’ve connected your application to an external database, it’s time to begin adding new features to your app.

## Requirements

**Add a form to allow users to create their own reviews:** In previous versions of the application, users could only read reviews from the database. You will need to add a form that adds new reviews to the database. The form should include the user’s name, the restaurant id, the user’s rating, and whatever comments they have. Submitting the form should update the server when the user is online.

**Add functionality to defer updates until the user is connected:** If the user is not online, the app should notify the user that they are not connected, and save the users' data to submit automatically when re-connected. In this case, the review should be deferred and sent to the server when connection is re-established (but the review should still be visible locally even before it gets to the server.)

**Meet the new performance requirements:** In addition to adding new features, the performance targets you met in **Stage Two** have tightened. Using Lighthouse, you’ll need to measure your site performance against the new targets.

* Progressive Web App score should be at **90** or better.
* Performance score should be at **90** or better.
* Accessibility score should be at **90** or better.

## Getting Started

### Run the App
##### Navigate into Front-End directory
```
# cd App _ Front-End
```
##### In a terminal, check the version of Python you have:
```
# python -V
```
##### If you have Python 2.x spin up the server with
```
# python -m SimpleHTTPServer 8000
```
`(or some other port, if port 8000 is already in use.)`
##### For Python 3.x, you can use
```
# python -m http.server 8000
```
##### If you don't have Python installed, navigate to Python's[website](https://www.python.org/)
`to download and install the software.`

##### With your server running, visit the site:
```
http://localhost:8000
```
### Development local API Server
_Location of server = /server_
Server depends on [node.js LTS Version: v6.11.2 ](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm), and [sails.js](http://sailsjs.com/)
Please make sure you have these installed before proceeding forward.

Great, you are ready to proceed forward; awesome!

Let's start with running commands in your terminal, known as command line interface (CLI)

### Run the Server
##### Navigate into Back-End directory
```
# cd Server _ Back-End
```
###### Install project dependancies
```Install project dependancies
# npm i
```
###### Install Sails.js globally
```Install sails global
# npm i sails -g
```
###### Start the server
```Start server
# node server
```
### You should now have access to your API server environment
debug: Environment : development
debug: Port        : 1337
