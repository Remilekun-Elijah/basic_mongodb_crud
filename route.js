const user = require("./controller/user");
const route = require("express").Router();


route.post('/signup', user.signup);
route.get('/login-page', user.loginPage);
route.post('/login', user.login);


route.delete("/delete-user/:email", user.deleteUser);


route.get('/password-reset-page', user.resetPasswordPage);
route.post('/password-reset-confirm-email', user.forgetPasswordEmail);
route.get('/password-reset-password', user.passwordResetPassword);
route.put('/reset-password/:email', user.resetPassword);
route.get('/user/:email', user.getUser);
module.exports = route;