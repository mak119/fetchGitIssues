# fetchGitIssues

**[Assignment]{.underline}**

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

**WebApp**

1.  The landing page:

    a.  ![](media/image1.png){width="5.225in"
        height="3.265277777777778in"}It is what parentElement component
        refers to in the code. It contains a form with an input box to
        enter an URL and a placeholder. Looks like this:

2.  Upon entering a random string, it gives error:

    ![](media/image2.png){width="5.657638888888889in"
    height="3.536111111111111in"}

3.  ![](media/image3.png){width="5.227777777777778in"
    height="3.267361111111111in"}Upon entering a valid URL, like this:

4.  List of Issues page opens:\
    It is what childElement component refers to in the code. It
    contains:

    b.  a Home button to go back to the form page

    c.  No. Of Open Issues: \<number\>

    d.  3 Tabs: each containing a table having an index, URL link of
        issue and last opened date.

        i.  ![](media/image4.png){width="5.9743055555555555in"
            height="3.734027777777778in"}*Tab 1 contains table with
            issues opened within 24 hrs*.

        ii. ![](media/image5.png){width="5.51875in"
            height="3.4493055555555556in"}*Tab 2 contains table with
            issues opened between 24hrs and a week.\
            \
            *

        iii. ![](media/image6.png){width="7.027224409448819in"
            height="4.392404855643044in"}*Tab 3 contains table with
            issues opened more than a week ago.*

5.  ![](media/image7.png){width="6.263888888888889in"
    height="3.915277777777778in"}If the entered Git link is invalid or
    belongs to a private repo, an alert is generated.

6.  ![](media/image8.png){width="6.263888888888889in"
    height="3.915277777777778in"}If the Git link belongs to a public
    repo but that repo has no open issues, then such an alert is
    generated (*to generate this alert I had to hardcode this value thus
    done on localhost:4200*).\
    \
    **[Summary]{.underline}**

    *Although the code is thoroughly commented, here is a quick summary
    of what is happening around inside.\
    *

    How the app really works.\
    **1**. In the server directory is a file
    [**server.js**,]{.underline} which uses express to start a server
    which either listens to a port assigned to it by the production
    environment or port: 3000.

    *To run the server enter command* **node .\
    ***This will log **server started...** in the console.*

    **2***.* In the client directory is the Angular code.

    Now we have two components viz.\
    ***parentElement*** and ***childElement.***

    And one service file which contains the code for hitting GIT-API.

    **2a**. In parentElement component is a form which takes a URL as
    input and upon clicking save, this changes the value of a variable
    which controls the visibility of parentElement or childElement.

    **2b**. Now the childElement is displayed, which basically contains
    the list of issues for that git repository.

    **2c**. This childElement contains the business logic for hitting
    the GIT-API with the modified URL in service file (modified to a
    format accepted by GIT-API).

    **2d**. From the response, the issues\_url is fetched modified to
    only fetch open issues and again the function in service file is
    hit.

    **2e**. This response contains all the issues which are then counted
    and arranged into different arrays, each for issues opened within
    24Hrs, between 24Hrs and a week and more than a week ago.\
    \
    **2f**. These arrays and count variable are two way binded with the
    html and thus the html or view is populated accordingly.
