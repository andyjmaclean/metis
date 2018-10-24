
[![Greenkeeper badge](https://badges.greenkeeper.io/andyjmaclean/metis.svg)](https://greenkeeper.io/)

DEVELOPMENT SET-UP


Developers should install npm.

That done, the dummy server can be run with the following command from the project root:

node server.js

This will make the following url available:

http://localhost:8000/app/index.html

The project can be tested with the following command from the project root:

npm test

This will run the jasmine unit tests and initialise a watcher on the code base to re-run them when save operations are made on the save files.



SERVICE URLS

For early development, by default, the app data is served from the local node server.
A blank log-in (no username and no password) will result in this behaviour.
The service urls are listed here:

	"users"					: "data/users.json",
								- list of users if "start" and "rows" parameters present
								- otherwise returns the total number of users in the system
								  (this to allow the pagination widget to calculate its content)

	"user"					: 'data/users/:userId.json',
								- get single user's data
								
	"organisations"			: "data/organisations.json",
								- list of organisations data if "start" and "rows" parameters present
								- otherwise returns the total number of organisations in the system
								  (this to allow the pagination widget to calculate its content)
								
	"organisation"			: 'data/organisations/:organisationId.json',
								- get single organisation's data
	
	"projects"				: "data/datasets.json",
	"project"				: "data/datasets/:datasetsId.json"
								- as per users and organisations, but with less data and less testing done


The "users" service url is (and eventually all service urls will be) set to this:

	http://95.85.44.177:8080/ingester/rest/users/all

if the user logs in with the username of "2" (no password), but cross-domain authentication isn't working yet.




DEPLOYMENT


This app has not been deployed yet.  The "app" folder should be bundled with a web.xml and zipped into a .war for tomcat deployment.

