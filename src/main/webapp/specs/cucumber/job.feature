Feature: Vehicle should be added, edited and viewed on vehicle screen

Scenario: The results should be paged in 50s
    Given there are 125 jobs in the database
    Then 50 jobs should be displayed
    When I scroll to the bottom of the page, each time the next 50 rows should be displayed in Job table

Scenario: I can filter the records by different fields
    Given I am on the jobs grid view
    When I filter by a customer from one of the jobs
    Then I can only see the job for the selected customer in the table
    When I  filter by a status that appears in one of the jobs
    Then I can only see the job that has the selected status in the table

Scenario: I can create a new Job from Job page
   When I click to create a new Job 
   Then a New Job modal panel is opened
   When I fill in all the new job details
   And click to save the Job 
   Then the new job is displayed in the table

Scenario: I can cancel the creation of a new Job
   Given the modal panel to create new Job is open
   When I fill in all the new job details
   And I click to cancel the Job creation
   Then the new job is not displayed in the table

Scenario: I can record that an invoice has been sent from the Jobs page
   Given I am on the Jobs page
   When I click to view a job with status delivered
   Then the Edit Job modal panel is opened with an 'Invoice sent' button
   When I click to view a job with status other than delivered
   Then I cannot see the 'Invoice sent' button on the modal

Scenario: I can view jobs record using special filter buttons on the Jobs page
   Given I am on the job grid view
   Then I see two special filter buttons, Undelivered and Delivered not Invoiced
   When I click the Undelivered button
   Then only jobs that have a status of New or Assigned with and that have a delivery date are visible
   When I select Delivered not Invoiced button 
   Then I can view all jobs that have a status of Delivered that has a delivery date of the previous day or earlier

Scenario: Accept Quote Button should be visible on each row in Quote table
    Given I have some quotes with quoting status and some with new status
    When I am on quote page
    Then Accept Quote button is displayed on quotes with quoting status
    And Accept Quote button is not displayed on quotes with new status

Scenario: I can add a new delivery point for a customer
    Given I am adding or editing a quote 
    When I click on + icon for delivery point 
    Then a popup should appear to allow me to add a new delivery point 
    When I enter all required fields for delivery point and click save
    Then the modal should close and the new delivery point should be pre-selected on the dropdown

Scenario: Collection and Delivery points will only be available for the specific company that they were added to
    Given I am adding or editing a quote 
    Then the collection point modal won’t be editable until I’ve selected a company
    When I select a company
    Then the collection/delivery points for that company will appear as options in the collection and delivery point dropdowns
    And the collection/delivery points from other companies won’t be visible

Scenario: I can view Expired Quotes using a special filter button on the job screen 
    Given I am on the job grid view for expired quotes
    Then I can see a special filter buttons, Expired Quotes
    When I click the Unaccepted Quotes button 
    Then only quotes that have a status of Quoting and that have a delivery date older than 1 day ago

Scenario: Expired Quotes aren’t visible in the quotes table by default
    Given there is a quote on the system that hasn’t been accepted and has a delivery date older than one day ago
    When I am on the job grid view for expired quotes
    Then that quote isn’t visible by default.
    And I have to click the Expired Quotes filter to see it

Scenario Outline: I can sort the job table by clicking on the column headers
        Given there are a number of jobs in the system

        |Collection Date/Time|Delivery Date/Time|
        #----------------#--------------#
        | 22/12/2014	 | 23/12/2014   | 
        | 23/12/2014	 | 24/12/2014   | 
        | 24/12/2014	 | 25/12/2014   | 
        | 25/12/2014	 | 26/12/2014   | 
        | 26/12/2014	 | 27/12/2014   | 
        | 27/12/2014	 | 28/12/2014   | 
        | 28/12/2014	 | 21/12/2014   | 
        | 21/12/2014	 | 22/12/2014   | 
    
        When <column> column is clicked in jobs table
        Then the <first expected value> is at the top in jobs table for <column>
        When the <column> is clicked again in jobs table
        Then the <second expected value> is at the top in jobs table for <column>

Examples:
	    | column                | first expected value  | second expected value |
            #-----------------------#-----------------------#-----------------------#
	    | Collection Date/Time  |  21/12/14           | 28/12/14            |
	    |  Delivery Date/Time   |  21/12/14           | 28/12/14            |

Scenario: Unaccept Quote Button should be visible on each row in Quote table
Given I have some quotes with quoting status and some with new status for unaccept job
When I am on jobs page
Then Unaccept Job button is displayed on jobs with new status
And  Unaccept Job button is not displayed on jobs with quoting status