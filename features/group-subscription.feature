Feature: As a user
  I can join a group by SMS
  https://trello.com/c/muuW19P3/8-join-groups

  Scenario: Join a group
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'join accleaders'
    And phone numbers 'A' sends an SMS to SMSUP with content 'accleaders hi everyone in the accleaders group'
    Then I receive an SMS with the content 'accleaders hi everyone in the accleaders group'