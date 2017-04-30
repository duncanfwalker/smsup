const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, Before }) => {
  Before(() => {
    process.env.SUPER_ADMIN_PHONE_NUMBERS = undefined;
  });

  Given(/^admin phone numbers are '(.*)'$/, (phoneNumbers) => {
    process.env.SUPER_ADMIN_PHONE_NUMBERS = phoneNumbers;
  });
});
