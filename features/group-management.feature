Feature: As a admin
  I would like to remove all subscriptions from a group by a keyword in an SMS
  https://trello.com/c/1Zt8kQTw/5-create-groups
  https://trello.com/c/T3BdQKVC/2-delete-group

  Scenario: Successful create
    When I send an SMS to SMSUP with content 'create accleaders'
    Then I receive an SMS with the content ''accleaders' group created. '
    And I am subscribed to the 'accleaders' group

  Scenario: Successful delete
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'join accleaders'
    When I send an SMS to SMSUP with content 'delete accleaders'
    Then I receive an SMS with the content 'the accleaders group has been deleted.'
    And I am not subscribed to the 'accleaders' group

  @wip
  Scenario: Create duplicate
    Given that the 'accleaders' group exists
    When I send an SMS to SMSUP with content 'create accleaders'
    Then I receive an SMS with the content 'sorry 'accleaders' already exists'

  @wip
  Scenario: Delete non-existent group
    When I send an SMS to SMSUP with content 'delete groupThatDoesntExist'
    Then I receive an SMS with the content 'sorry 'groupThatDoesntExist' does not exist'

  @wip
  Scenario: Create conflicts with command keyword
    When I send an SMS to SMSUP with content 'create create'
    Then I receive an SMS with the content 'sorry you cant use the name 'create' for a group'

