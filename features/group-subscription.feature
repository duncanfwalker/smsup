Feature: As a user
  I can join and leave a group by SMS
  https://trello.com/c/muuW19P3/8-join-groups
  https://trello.com/c/DvWTqpIj/6-leave-groups

  Scenario: Join and receive messages to group
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'join accleaders'
    And phone numbers A sends an SMS to SMSUP with content 'accleaders hi everyone in the accleaders group'
    Then I receive an SMS with the content 'accleaders hi everyone in the accleaders group'

  Scenario: Join and get welcome message
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'join accleaders'
    Then I receive an SMS with the content 'You have joined the accleaders group. SMS Up terms of use are.'

  Scenario: Leave a group
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'leave accleaders'
    And phone numbers A sends an SMS to SMSUP with content 'accleaders hi everyone in the accleaders group'
    Then I received 1 messages
    And I receive an SMS with the content 'You have left the accleaders group.'

  Scenario: Invite
    Given that phone numbers  are subscribed to the all group
    When I send an SMS to SMSUP with content 'invite A B to all'
    And phone numbers A,B receive an SMS with the content 'You have been invited to the 'all' group. SMS Up terms of use are. Reply "join all" to join.'
    And phone numbers A sends an SMS to SMSUP with content 'join all'
    Then 'A' is subscribed to the 'all' group
