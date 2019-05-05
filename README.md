# fetchGitIssues

Technologies used

1.  NodeJS

2.  ExpressJs for server

3.  Angular 6 for front-end

4.  Bootstrap for Angular for Design

5.  Heroku for deployment

    a.  <https://fetchgitissues.herokuapp.com>

**By:\
Mayank Arya**

**+91 8968-408-895**

**mayank.uiet7\@gmail.com**

**[Summary]**

    Although the code is thoroughly commented, here is a quick summary of what is happening around inside.

How the app really works.
1. In the server directory is a file server.js, which uses express to start a server which either listens to a port assigned to it by the production environment or port: 3000.
	To run the server enter command node .
	This will log server started… in the console.

2. In the client directory is the Angular code.
Now we have two components viz. 
parentElement and childElement. 
And one service file which contains the code for hitting GIT-API.

2a. In parentElement component is a form which takes a URL as input and upon clicking save, this changes the value of a variable which controls the visibility of parentElement or childElement.

2b. Now the childElement is displayed, which basically contains the list of issues for that git repository. 

2c. This childElement contains the business logic for hitting the GIT-API with the modified URL in service file (modified to a format accepted by GIT-API).

2d. From the response, the issues_url is fetched modified to only fetch open issues and again the function in service file is hit.

2e. This response contains all the issues which are then counted and arranged into different arrays, each for issues opened within 24Hrs, between 24Hrs and a week and more than a week ago.

2f. These arrays and count variable are two way binded with the html and thus the html or view is populated accordingly.
