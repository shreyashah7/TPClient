Feature: Licence Type should be added, edited and viewed on Licence Type Admin screen

Scenario: I can see which size of vehicle can be driven by holders of each type of licence
Given I am on the Licence Type Admin screen
Then I can see which type of licence apply to each size of vehicle in a table

Scenario: I can add a new combination of type of licence and size of vehicle
Given I am on the Licence Type Admin screen
When I click the Add New button
Then a new line will appear at the top of the table
And the row will contain a dropdown with all vehicles sizes and a dropdown with all licence types
When I select a new combination and click save
Then the new row is added to the top of the table

Scenario: I edit a type of licence and type of vehicle combination
Given I am on the Licence Type Admin screen
When I change a value from one of the vehicle size or licence type dropdowns in the table
And I click save
Then the combination of vehicle size and licence type is updated

Scenario: Adding a new licence type, vehicle size combination will update the driver warnings on the panning screen
Given a driver has been allocated to a vehicle when their licence type isn't valid for the vehicle size
Then the vehicle on the planning screen shows a warning that the driver is not allowed to drive the vehicle
When I go to the Licence Type Admin page and allocate their licence type to the vehicle size
Then the vehicle on the planning screen now shows that the driver is allowed to drive the vehicle

Scenario: Duplicate vehicle size, licence type combinations won't be saved
When I add or edit a row in the Licence Type Admin screen
And create a combination that is a duplicate of another row
When I click the save button
Then the add/update won't complete
And a message will appear telling me it was a duplicate