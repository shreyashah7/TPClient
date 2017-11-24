Feature: Invoice should be added, edited and viewed on invoice screen   

Scenario: I can see jobs for a company
    Given I am on the Invoice screen
    When I click on Create tab
    And I select a company from the list
    Then jobs will be fetched based on the company selected

Scenario: I can view a new menu option Invoicing
    Given there is a new menu item 'Invoicing' 
    When I click on the menu option 'Invoicing'
    Then I am navigated to a new page
    And I can see two tabs - Create & Invoices on the screen

Scenario: I can select a job for invoicing and check the count
    Given I am on the invoicing page with tabs : create, invoice
    When I click on the Create Tab on the invoice page
    Then no jobs are displayed on the screen
    When I click to select a company from the dropdown
    Then I can view the jobs for that company with checkbox on each row
    And an invoice buttion is disabled on the page when no checkbox is clicked
    When I click on checkbox to select jobs
    Then count of number of jobs selected is displayed on the top of invoice button


Scenario: Counts on invoice change with jobs selected
    Given I am on invoice tab with jobs populated for company
    When I click to check a job from the list
    Then the count on the invoice button is updated with checked jobs value
    When I click on the clear button on the screen
    Then the count is updated and invoice button is disabled

Scenario: I can view selected jobs in modal panel
    Given I am on the Invoice screen for selected jobs
    When I click on Create tab
    Then I can select a company from the list
    And jobs will be fetched based on the company selected
    When I select 2 jobs from the list
    Then count on Invoice button should be 2
    When I click on Invoice button 
    Then It should open a popup with 2 jobs in the table 
    When I click on Invoice button to save
    And invoices should be displayed in Invoice table

Scenario: I can view invoices in the table
    Given I am on the Invoice screen for invoice view
    When I click on Invoices tab
    Then table of invoices should be displayed

Scenario Outline: I can sort the invoice table by clicking on the column headers
        Given there are a number of invoices in the system

        |Customer           | Creation Date         | Amount    |
        |Pro-Company 2      |2017-12-23             |1200       | 
	|Pro-Company 3      |2017-12-24             |1000       | 
	|Pro-Company 1      |2017-12-25             |1500       |
	|Pro-Company 3      |2017-12-26             |1600       |
	
        When <column> column is clicked in invoice table
        Then the <first expected value> is at the top in invoice  table
        When the <column> is clicked again in invoice  table
        Then the <second expected value> is at the top in invoice  table

Examples:
	    | column                | first expected value  | second expected value |
	    | Customer              | Pro-Company 1         | Pro-Company 3         |
            | Creation Date         | 23/12/17 12:00 AM     | 26/12/17 12:00 AM     |
	    | Amount                | 1000                  | 1600                  |