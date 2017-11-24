Feature: I can logged into system using proper authentication.

Scenario: User with invalid credentials should not be able to login
Given A User with email id and encrypted password exists in database
And I'm on the log in page
When I enter invalid credentials
And click Log In
Then "Email Id or Password not valid" error message appears
And I should be on log in page only.

Scenario: User with valid credentials should be able to login
Given A User with email id and encrypted password exists in database
And I'm on the log in page
When I enter valid credentials
And click Log In
Then I should be on the Planning page

Scenario: User can not manually enter a URL into the address bar to bypass the login page
Given I'm on the log in page
When I hit jobs URL in address bar
Then I should be on log in page only
When I enter valid credentials
And click Log In
And I hit jobs URL in address bar
Then I should be on the jobs page

Scenario: User can not manually enter a Web-Service URL into the address bar to get Data
Given I'm on the log in page
When I hit "/api/jobs" Web service URL in address bar
Then I should get message "You have to login first to access this feature"
