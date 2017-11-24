Feature: Customer should be added, edited and viewed on customer screen

Scenario: The results should be paged in 50s
Given there are 125 customers in the database
Then 50 customers should be displayed
When I scroll to the bottom of the page, each time the next 50 rows should be displayed in customer table

Scenario: I can cancel to create new Customer from Customer page
When I click to create a new Customer
Then a new customer modal panel is opened
When I fill in all the details in the customer modal
And I click to cancel the Customer creation
Then the new customer is not displayed in the table

Scenario: I can create new Customer from Customer page
When I click to create a new Customer
Then a new customer modal panel is opened
When I fill in all the details in the customer modal
And click to save the Customer
Then the new customer is displayed in the table

Scenario: I can edit the details of a Customer
When I click on a customer row
Then an "Edit Customer" modal panel is displayed
And all the details of the Customer are prepopulated
When I change the details of the Customer
And click to save the changes
Then the customer's details have been updated in the table