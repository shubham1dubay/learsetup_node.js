const User = require('../modeles/usersModeles');
const { hmacProcess } = require('../utils/hashing');
const transport = require('../middlewares/sendMail');

exports.sendveficationCode = async (req, res) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist!'
            });
        }

        if (existingUser.verified) {
            return res.status(400).json({
                success: false,
                message: 'User already verified'
            });
        }

        const codeValue = Math.floor(100000 + Math.random() * 900000).toString();

        const info = await transport.sendMail({
            from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
            to: existingUser.email,
            subject: 'Verification Code',
            html: `<h1>${codeValue}</h1>`
        });

        if (info.accepted.includes(existingUser.email)) {
            existingUser.verificationCode = hmacProcess(
                codeValue,
                process.env.HMAC_VERIFICATION_CODE_SECRET
            );
            existingUser.verificationCodeValidation = Date.now();

            await existingUser.save();

            return res.status(200).json({
                success: true,
                message: 'Verification code sent successfully'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Email sending failed'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
