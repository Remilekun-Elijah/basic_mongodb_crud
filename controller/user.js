const path = require('path');
const { Model, schema } = require(path.resolve('./models/user.js'));
const joi = require("joi");
const bcrypt = require("bcrypt");


exports.signup = async(req, res) => {
    try {
        const joiObject = joi.object().keys({
            firstName: joi.string().required(),
            lastName: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}')),
            repeat_password: joi.ref("password"),
        });
        let { password, firstName, lastName, email } = await joiObject.validateAsync(req.body);

        password = bcrypt.hashSync(password, 10);

        const user = new Model({
            name: {
                firstName,
                lastName
            },
            email,
            password
        });

        // const result = await user.save();
        user.save().then(({ firstName, lastName, email, createdAt, updatedAt } = result) => {

            res.json({
                okay: true,
                message: { firstName, lastName, email, createdAt, updatedAt }
            });
        }).catch(err => {
            res.json({ okay: false, message: err });
        })
    } catch (err) {
        console.log(err);
        if (err.details) res.json(err.details[0].message);
        else res.json(err.message);
    }
}

exports.getUser = async(req, res) => {
    const joiObject = joi.object().keys({
        email: joi.string().email().required()
    });
    try {
        await joiObject.validateAsync(req.params);

        const user = await Model.findOne({
            email: req.params.email
        });
        user.password = "";
        delete user.password;
        res.json({ okay: true, message: user });
    } catch (err) {

        if (err.details) res.json(err.details[0].message)
        else res.json({ okay: false, message: err.message });
    }
};

exports.resetPassword = async(req, res) => {
    const joiObject = joi.object().keys({
        password: joi.string().required(),
        repeat_password: joi.ref("password")
    })
    try {
        const data = await joiObject.validateAsync(req.body);

        Model.findOneAndUpdate({ email: req.params.email }, {
            password: bcrypt.hashSync(data.password, 10)
        }, (err, data) => {
            if (err) res.json({ okay: false, message: err.message });
            else res.json({ okay: true, message: "Password reset successfully" });
            console.log(data);
        });

    } catch (err) {
        console.log(err);
        if (err.details) res.json({ okay: false, message: err.details[0].message });
        else res.json({ okay: false, message: err.message });
    }
};

exports.forgetPasswordEmail = async(req, res) => {
    const joiObject = joi.object().keys({
        email: joi.string().email().required()
    });
    try {

        const data = await joiObject.validateAsync(req.body);
        const user = await Model.findOne({
            email: data.email
        });

        if (user) res.json({ okay: true, message: "You will now be redirected" });
        else res.json({ okay: false, message: "User not found" });
    } catch (err) {
        // console.log(err);
        if (err.details) res.json(err.details[0].message);
        else res.json({ okay: false, message: err.message });
    }
}

exports.deleteUser = async(req, res) => {
    console.log(req.params.email);
    Model.findOneAndDelete({
        email: req.params.email
    }, (err, data) => {
        if (err) res.json({ okay: false, message: err.message });
        else res.json({ okay: true, message: "User deleted successfully" });
        console.log(data);
    })

};

exports.login = async(req, res) => {
    const joiObject = joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    try {
        const data = await joiObject.validateAsync(req.body);
        const user = await Model.findOne({
            email: req.body.email
        });
        if (!user) res.json({ okay: false, message: "User not found" })
        else if (bcrypt.compareSync(data.password, user.password)) {
            user.password = "";
            delete user.password;

            const html = `<div>
                                    <p>Hello ${user.name.firstName} ${user.name.lastName}</p>
                                    <p>You have successfully logged in</p>
                                    <button>Delete account</button>
                                    <script>
                                        document.querySelector('button').onclick = function() {

                                            fetch(\`/delete-user/${user.email}\`,{
                                            method: 'delete',
                                            }).then(function(response) {
                                                return response.json();
                                                console.log(response);
                                            }).then(function(response) {
                                                alert('Deleted successfully');
                                                document.location.href = '/';
                                            }).catch(err => alert(err.message) );
                                        }
                                    </script> 
                                </div>`;
            res.send(html);
        } else {
            res.json({ okay: false, message: "Incorrect password" });
        }
    } catch (err) {
        console.log(err);
        if (err.details) res.json(err.details[0].message);
        else res.json(err.message);
    }
};



exports.resetPasswordPage = (req, res) => {
    res.render('passwordResetPage');
};

exports.passwordResetPassword = (req, res) => {
    res.render('resetPassword');
};
exports.loginPage = (req, res) => {
    res.render('login');
};