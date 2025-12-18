const jwt = require('jsonwebtoken')
const User = require('../modeles/usersModeles');
const { signupSchema, signinSchema } = require('../middlewares/validator');
const { doHash, doHashValidation } = require('../utils/hashing');

exports.signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = signupSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists!'
            });
        }

        const hashedPassword = await doHash(password, 12);

        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'Your account has been created'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { error, value } = signinSchema.validate({ email, password });
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }
        const existingUser = await User.findOne({ email }).select('+password');
        if (!existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User does not  exists!'
            });
        }
        const result = await doHashValidation(password, existingUser.password)
        if (!result) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials!'
            });
        }
        const token = jwt.sign({
            userId: existingUser._id,
            userId: existingUser.email,
            verified: existingUser.varified,
        },
            process.env.TOKEN_SECRET,
            {
                expiresIn: '8h'
            }

        );
        res.cookie('Authorization', `Bearer ${token}`, {
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).json({
            success: true,
            token,
            message: 'Logged in successfully'
        });

    } catch (error) {
        console.log(error);
    }
}

exports.signout = async (req, res) => {
    res.clearCookie('Authorization', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};
