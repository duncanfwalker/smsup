Feature: Terms and conditions
  As a userk
  I have to explicitly join at least once
  So that I don't get lots of unsolicited messages

  Scenario: Successful invitation
    Given that phone numbers  are subscribed to the all group
    When I send an SMS to SMSUP with content 'invite A B to all'
    And phone numbers A sends an SMS to SMSUP with content 'join all'
    Then phone numbers A,B receive an SMS with the content 'You have been invited to the 'all' group.'
    And phone numbers A,B receive an SMS with the content 'Reply "join all" to join.'
    And 'A' is subscribed to the 'all' group

  Scenario: Unaccepted invitation
    Given that phone numbers  are subscribed to the all group
    When I send an SMS to SMSUP with content 'invite A to all'
    Then phone numbers A receives an SMS with the content 'SMS Up terms of use are' '1' times
    And 'A' is not subscribed to the 'all' group

  Scenario: Multiple joins
    Given that the 'first' group exists
    And that the 'second' group exists
    And phone numbers A sends an SMS to SMSUP with content 'join first'
    And phone numbers A sends an SMS to SMSUP with content 'join second'
    Then phone numbers A receives an SMS with the content 'SMS Up terms of use are' '1' times

  Scenario: Already accepted
    Given that the 'first' group exists
    When phone numbers B sends an SMS to SMSUP with content 'invite A to first'
    And phone numbers A sends an SMS to SMSUP with content 'join first'
    Then phone numbers A receives an SMS with the content 'SMS Up terms of use are' '1' times

  Scenario: Already accepted
    Given that the 'first' group exists
    And that the 'second' group exists
    When phone numbers A sends an SMS to SMSUP with content 'invite B to first'
    When phone numbers A sends an SMS to SMSUP with content 'invite B to second'
    Then phone numbers B receives an SMS with the content 'SMS Up terms of use are' '1' times
