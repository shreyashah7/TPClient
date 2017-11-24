Feature: Staff should be added, edited and viewed on staff screen

Scenario: I can create new Staff member from the staff page
   When I click to create a new Staff member
   Then a new staff modal panel is opened
   When I fill in all the new staff details
   And click to save the Staff member
   Then the new staff member is displayed in the table

Scenario: I can edit the details of a staff member 
  When I click on a staff row
  Then the "Edit Staff" modal panel is displayed on staff page
  And all the details of the staff member are prepopulated
  When I change the details of the staff member
  And click to save the Staff member
  Then the staff's details have been updated in the table

Scenario Outline: I can sort the staff table by clicking on the column headers
        Given there are a number of staffs in the system

        |Driver Name    | Employment Date	| Eye Test  |
        |DriverName 2|23/12/2014|24/12/2014| 
	|DriverName 3|24/12/2014|25/12/2014| 
	|DriverName 4|25/12/2014|26/12/2014|
	|DriverName 5|26/12/2014|27/12/2014|
	|DriverName 6|27/12/2014|28/12/2014| 
	|DriverName 7|28/12/2014|21/12/2014| 
	|DriverName 8|21/12/2014|22/12/2014|
	|DriverName 1|22/12/2014|23/12/2014|
    
        When <column> column is clicked in staff table
        Then the <first expected value> is at the top in staff  table for <column>
        When the <column> is clicked again in staff  table
        Then the <second expected value> is at the top in staff  table for <column>

Examples:
	    | column                | first expected value  | second expected value |
	    | Driver Name          | DriverName 1         | DriverName 8         |
	    | Employment Date | 21/12/14            | 28/12/14          |
	    | Eye Test            | 21/12/14              | 28/12/14            |

Scenario: I can view fields in staff temporary state
    Given I am on Staff page and adding a new staff
    When I click on checkbox for "Temporary Staff"
    Then the modal popup should be updated with Agency Company, Drivers Name, Mobile Number, Licence Class, ADR, Licence Number

Scenario: Default manifest date should display tomorrow's date
Given staff exist in a d/b
And I am viewing download manifest modal
Then it should display manifest date default to tomorrow's date