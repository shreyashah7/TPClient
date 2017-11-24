Feature: Vehicle should be added, edited and viewed on vehicle screen

Scenario: I can view Vehicle Details in a grid view
When I navigate to the Vehicle page
Then a table containing the details of all the vehicles is displayed

Scenario: The results should be paged in 50s
Given there are 125 vehicles in the database
Then 50 vehicles should be displayed
When I scroll to the bottom of the page, each time the next 50 rows should be displayed in Vehicle table

Scenario: I can cancel the creation of a new Vehicle
   Given the modal panel to create new Vehicle is open
   When I fill in all the new vehicle details
   And I click to cancel the Vehicle creation
   Then the new vehicle is not displayed in the table

Scenario: I can create a new vehicle from the vehicle page
When I click to create a new vehicle on page
Then the New Vehicle modal panel is opened
   When I fill in all the new vehicle details
   And click to save the Vehicle 
   Then the new vehicle is displayed in the table

Scenario: I can edit the details of a Vehicle
  Given one vehicle exists to edit
  When I click on a vehicle row
  Then an "Edit Vehicle" modal panel is displayed on vehicle page
  And all the details of the Vehicle are prepopulated
  When I change the details of the Vehicle
  And click to save the changes of Vehicle
  Then the vehicle's details have been updated in the table

Scenario: I can filter the records by different fields
Given I am on the vehicles grid view
When I click on the filter by vehicle reg 
And enter the reg number of the vehicle
Then I can only see the vehicle reg filtered in the table
When I click on the filter by vehicle type
And enter the type of the vehicle
Then I can only see the vehicle type filtered in the table

Scenario Outline: I can sort the vehicle table by clicking on the column headers
Given there are a number of vehicles in the system
|MOT Due|6 Weekly Check|Tacho Check Due|LOLER 6 Month Check|LOLER 12 Month Test|
|22/12/2014|23/12/2014|24/12/2014|25/12/2014|26/12/2014|
|23/12/2014|24/12/2014|25/12/2014|26/12/2014|27/12/2014|
|24/12/2014|25/12/2014|26/12/2014|27/12/2014|28/12/2014|
|25/12/2014|26/12/2014|27/12/2014|28/12/2014|21/12/2014|
|26/12/2014|27/12/2014|28/12/2014|21/12/2014|22/12/2014|
|27/12/2014|28/12/2014|21/12/2014|22/12/2014|23/12/2014|
|28/12/2014|21/12/2014|22/12/2014|23/12/2014|24/12/2014|
|21/12/2014|22/12/2014|23/12/2014|24/12/2014|25/12/2014|
When <column> column is clicked in vehicle table
Then the <first expected value> is at the top in vehicle table for <column>
When the <column> is clicked again in vehicle table
Then the <second expected value> is at the top in vehicle table for <column>
Examples:
|column|first expected value|second expected value|
|MOT Due|21/12/14|28/12/14|
|6 Weekly Check|21/12/14|28/12/14|
|Tacho Check Due|21/12/14|28/12/14|
|LOLER 6 Month Check|21/12/14|28/12/14|
|LOLER 12 Month Test|21/12/14|28/12/14|

Scenario: On vehicle add modal, show loler inputs only when tail lift is checked
When I click to create a new vehicle on page
Then the New Vehicle modal panel is opened
And I can see Loler due inputs
When I select no for tail lift
Then I can not see Loler due inputs

Scenario: I can view dynamic fields on the vehicle creation modal based on dropdown selected
Given I am on the vehicle grid veiw
When I click to create a new vehicle
Then I can see all the fields in the modal panel opened
And vehicle type is defaulted to Rigid
When I click to change the value of Vehicle Type
Then I can view options for Rigid, Trailer and Unit in the dropdown
When I select Trailer option from the dropdown
Then I am not able to see some fields in the modal panel
When I change the vehicle type to Unit
Then all fields are displayed except loler, internal height,int length and pit capacity
And I can save the vehicle based on the fields displayed

Scenario: I can add a temporary vehicle from add panel
    Given I am on Vehicle page and adding a new vehicle
    When I click on checkbox for Temporary Vehicle
    Then the modal popup should be updated with Registration, Vehicle Size, Tail Lift, Vehicle Type inputs.