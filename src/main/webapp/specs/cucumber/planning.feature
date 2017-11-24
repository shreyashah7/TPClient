Feature: Vehicle Types are displayed along with its plans and contents

Scenario: I can view vehicles of a particular type one at a time
Given there are 3 vehicle type along with 1 vehicles inside it 
And I am on the planner page
When I select another vehicle type
Then the previous list is closed
And new list of vehicles is displayed

Scenario: I can view jobs for a vehicle 
Given I am on the planner screen 
When I click on a vehicle from the vehicle type table 
Then the vehicle type table is replaced with the vehicle view: a table of jobs for the selected vehicle.

Scenario: I can go back from vehicle view to vehicle type list
Given I am viewing the jobs of a specific vehicle on the planner screen
When i click on the back button
Then I return to the vehicle type list that was open before I clicked to view a specific vehicle

Scenario: I can view the table for Jobs in planner page 
Given I am on the planner page screen
Then the table of jobs is displayed ready to be assigned to the vehicles 
And only jobs with a status of New and with collection date/delivery date that is the same as the selected date are displayed

Scenario: I can view the schedule for different days by clicking back and forward on the date selector
   Given I am on the planner screen
   When I click on next button
   Then I can view the vehicle details for the next day
   When I can on previous button
   Then I can view the vehicle details for the previous day

Scenario: I can navigate to a specific date by selecting date from Calendar 
  Given I am on the planner screen
  When I click on Calendar to select a particular date
  Then I can view the vehicle details for that date in the planner

Scenario: I can view the table for Drivers in planner page 
Given I am on the planner page and I have a driver assigned for a day
Then I can see the table of drivers ready to be assigned to the vehicles
And only drivers that are not assigned to a vehicle for the selected date are displayed

Scenario: I can change the date to see a different day's vehicle load
Given you are viewing the vehicle load page
When you change the date
Then the vehicle load table should update to show the list of jobs allocated to the vehicle for that day

Scenario: I can view the feedback on the weight of a vehicle's load
When a vehicle has too much weight assigned
Then a Red traffic light is displayed and the hover message describes the issue
When a vehicle is close to the weight limit
Then an Amber traffic light is displayed and the hover message describes the issue
When a vehicle has too little weight assigned
Then a Green traffic light is displayed and the hover message describes the issue

Scenario: I can view the feedback on the number of pallets that make up a vehicle's load
When a vehicle has too many pallets assigned
Then a Red traffic light is displayed and the hover message describes the issue
When a vehicle is close to the pallet limit
Then an Amber traffic light is displayed and the hover message describes the issue
When a vehicle has too little pallets assigned
Then a Green traffic light is displayed and the hover message describes the issue

#Already covered in licence type feature (scenario:Adding a new licence type, vehicle type combination will update the driver warnings on the panning screen)
#Scenario: Vehicles are marked differently according to driver 
#When a vehicle does not have a driver associated
#Then the vehicle is displayed with a grey highlight
#When an under-qualified driver is assigned
#Then the vehicle is displayed with a red highlight
#When a vehicle has a correctly qualified driver assigned
#Then the vehicle is displayed with a green highlight

Scenario: I can view/filter the drivers list in table
Given I am on the planner page
When I click to filter the drivers table by Driver name
Then the table is filtered to only show the drivers with that name
When I click to filter the drivers table by License Class
Then the table is filtered to only show the drivers with that license class

Scenario: I can click edit to alter job details from vehicle load table
Given I am on the vehicle load table
And there is a job that needs to be changed 
When I click on job on vehicle load table
Then the edit job modal will appear

Scenario: I can remove a driver from a vehicle
Given a driver has been assigned to a vehicle for a day
When I click the X button next to the drivers name on vehicle summary table
Then the driver should be removed from the vehicle
And this driver should be displayed in driver tab again ready to assign to a different vehicle

Scenario: I can remove a job from a vehicle load
Given I am on planner page and a job has been assigned to a vehicle for a day
When I click the X button at the end of row on vehicle load table
Then the job should be removed from the vehicle load table
And this job should be displayed in job tab again ready to assign to a different vehicle

Scenario: On the planner screen, display only Rigid and Trailer vehicles in the Accordion
Given I have rigid, unit and trailer vehicles for same vehicle type
When I am on planner page
And Click to check artic of vehicle
Then I can see only rigid and trailer

Scenario: There should be Units tab next to drivers tab on planning page
Given I am on a planning screen
When I click on Units tab
Then I can see vehicles which has unit artic

Scenario: I can remove a unit from a vehicle
Given a unit has been assigned to a vehicle for a day
When I click the X button next to the unit's name on vehicle summary table
Then the unit should be removed from the vehicle
And this unit should be displayed in unit tab again ready to assign to a different vehicle

Scenario: Trailers will show a red traffic light until a Unit has been allocated
Given there is a Trailer which does not have unit assigned
When I go to planning screen
Then I can see red traffic for the trailer