const { send } = require('../transport/transport');
const passwordless = require('passwordless');
const MongoStore = require('passwordless-mongostore-bcrypt-node');
const logger = require('winston');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);

const loginForm = `<html>
<body>
<h1>Login</h1>
<form action="/login/sendtoken" method="POST">
    Phone number:
    <br><input name="user" type="text">
    <br><input type="submit" value="Login">
</form>
</body>
</html>
`;

passwordless.init(new MongoStore(process.env.MONGODBURI));
// Set up a delivery service
passwordless.addDelivery(
  (tokenToSend, uidToSend, recipient, callback) => {
    const loginMessage = `Login: ${process.env.ADMIN_HOST}/login/auth?token=${tokenToSend}&uid=${encodeURIComponent(uidToSend)}`;
    return send(recipient, loginMessage)
      .then(() => callback(undefined, uidToSend))
      .catch((error) => {
        logger.error(error);
        callback(error, null);
      });
  },
);

function setupAuth(app) {
  app.use(session({
    secret: process.env.ADMIN_AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoSessionStore({
      uri: process.env.MONGODBURI,
      collection: 'sessions',
    }),
  }));

  app.post(
    '/login/sendtoken',
    passwordless.requestToken((user, delivery, callback) => callback(null, user)),
    (req, res) => res.send('Check your text messages for login link'),
  );

  app.get(
    '/login/auth',
    passwordless.acceptToken({ successRedirect: process.env.ADMIN_HOST }),
    (req, res) => res.send('Login link is invalid'),
  );
  app.get('/login', (req, res) => res.send(loginForm));

  app.use(passwordless.sessionSupport());
}

module.exports = setupAuth;
