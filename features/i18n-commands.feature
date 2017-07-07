Feature: Internationalisation
  As a user
  I can interact with SMS in my right-to-left language

  Scenario: Command in Somali language
    When I send an SMS to SMSUP with content 'abuuris somaligroup'
    Then I receive an SMS with the content 'Guruubka 'somaligroup' la abuuray'

  Scenario: Command in local language
    Given that the 'رهبران' group exists
    When I send an SMS to SMSUP with content 'عضویت رهبران'
    Then I receive an SMS with the content 'You have joined the رهبران group. «با ثبت نام در SMSUP، موافقت می کنید تا از ارسال هرگونه پیام شرم آور، تهدیدآمیز، و مخالف قانون جاری و نافذ خودداری می کنید. بدین وسیله UR را از پرداخت غرامت در قبال هرگونه آسیب، مسئولیت، صدمه، یا هر هزینه ای که در نتیجه استفاده شما از SMSUP منتج شود، مبرا می کنید'

  Scenario: Non-command word in local language
    Given that the 'رهبران' group exists
    And that phone numbers A,B are subscribed to the رهبران group
    When phone numbers A sends an SMS to SMSUP with content 'رهبران سلام به همه در گروه'
    Then phone numbers B receives an SMS with the content 'رهبران سلام به همه در گروه'