Feature: Admin
  As an admin
  I would like to see all messages
  So that I can moderate content
  https://trello.com/c/klw86xzl/3-admin-in-all-groups

  Scenario: Automatically subscribed to all groups
    Given admin phone numbers are 'admin'
    When I send an SMS to SMSUP with content 'create newgroup'
    Then 'admin' is subscribed to the 'newgroup' group
    And phone number admin receive an SMS with the content ''newgroup' group created. '

  Scenario: List historical command messages
    Given that phone numbers A are subscribed to the tracked group
    When I send an SMS to SMSUP with content 'tracked hi A'
    Then the message history should be as follows:
      | MO text      |
      | tracked hi A |


  @wip
  Scenario: List historical command messages
    Given that phone numbers A,B are subscribed to the tracked group
    When I send an SMS to SMSUP with content 'tracked hi to A and B'
    And phone number 'A' leaves 'tracked'
    And I send an SMS to SMSUP with content 'tracked hi just B'
    Then the message history should be as follows:
      | MO text               | Recipients |
      | tracked hi to A and B | A,B        |
      | tracked hi just B     | B          |

