Feature: Internationalisation
  As a user
  I can interact with SMS in my right-to-left language

  Scenario: Command in local language
    Given that the 'رهبران' group exists
    When I send an SMS to SMSUP with content 'ورود رهبران'
    Then I receive an SMS with the content 'شما به گروهي به نام رهبران دعوت شده ايد. مراحل استفاده'

  Scenario: Non-command word in local language
    Given that the 'رهبران' group exists
    And that phone numbers A,B are subscribed to the رهبران group
    When phone numbers A sends an SMS to SMSUP with content 'رهبران سلام به همه در گروه'
    Then phone numbers B receives an SMS with the content 'رهبران سلام به همه در گروه'