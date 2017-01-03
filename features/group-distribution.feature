Feature: As an administrator
  I can add users to a group
  In order to test out language/script and malaysian phones

  Scenario: Non member send
    Given that phone numbers A,B are subscribed to the accleaders group
    When I send an SMS to SMSUP with content 'accleaders hi everyone in the accleaders group'
    Then phone numbers A,B receive an SMS with the content 'accleaders hi everyone in the accleaders group'

  Scenario: Member send
    Given that phone numbers A,B are subscribed to the accleaders group
    When phone number A sends an SMS to SMSUP with content 'accleaders hi everyone in the accleaders group'
    Then phone number B receives an SMS with the content 'accleaders hi everyone in the accleaders group'
    And phone number A received 0 messages

  Scenario: No match
    When I send an SMS to SMSUP with content 'without any group name as the first word'
    Then I receive an SMS with the content 'Sorry, you send a message to 'without' but no group with name exists. Start your message with name of a group'