Feature: User should be added, edited and viewed on User Admin screen

Scenario: I can view and edit the details of users who can access the system 
When I navigate to the users page from the admin menu
Then all the users who can access the system are displayed in a table

Scenario: I can add a new User or Edit a User from Admin Users screen
Given I am on the User page
When I click to add a new User
Then a new row is added to the existing user table
When I fill in the user details
And click to Save the User
Then the User is saved
When I make some change to the User
And click to Save the User
Then the User is updated

Scenario: I cannot enter same email id for a new/existing user
Given I have a user in the system with specific user id
When I click to add a new User
Then a new row is added to the existing user table
When I fill in the user details
And change the email id to the other users email
And click to Save the User
Then I can see an error message for invalid user email
And I cannot save the user details