Feature: Admin
  As an admin
  I would like to be automatically subscribed to all groups
  So that I can moderate content
  https://trello.com/c/klw86xzl/3-admin-in-all-groups

  Scenario: simple
    Given admin phone numbers are 'admin'
    When I send an SMS to SMSUP with content 'create newgroup'
    Then 'admin' is subscribed to the 'newgroup' group
    And phone number admin receive an SMS with the content ''newgroup' group created. '
