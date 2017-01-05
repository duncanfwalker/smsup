Feature: As a user
  I can join a group by SMS
  https://trello.com/c/muuW19P3/8-join-groups

  Scenario: Join and receive messages to group
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'join accleaders'
    And phone numbers 'A' sends an SMS to SMSUP with content 'accleaders hi everyone in the accleaders group'
    Then I receive an SMS with the content 'accleaders hi everyone in the accleaders group'

  Scenario: Join and get welcome message
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'join accleaders'
    Then I receive an SMS with the content 'You have joined the accleaders group. The terms of use are ....'