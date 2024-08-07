const transporter = require('../helpers/nodemailer')
const { v4: uuidv4 } = require('uuid');
const User = require('../models').User; // Adjust the path as needed

// Function to send forgot password email
const sendForgotPasswordEmail = async (email) => {
    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error('User not found');
        }

        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        let forgotPasswordUrlUuid;

        // Check if the user has already requested a password reset link within the last hour
        if (user.forgotPasswordRequestedAt && user.forgotPasswordRequestedAt > oneHourAgo) {
            forgotPasswordUrlUuid = user.forgotPasswordUrlUuid;
        } else {
            // Generate a new UUID for the forgot password URL
            forgotPasswordUrlUuid = uuidv4();

            // Update the user's forgotPasswordUrlUuid and forgotPasswordRequestedAt in the database
            user.forgotPasswordUrlUuid = forgotPasswordUrlUuid;
            user.forgotPasswordRequestedAt = now;
            await user.save();
        }

        // Create the reset password URL
        const resetPasswordUrl = `https://eci-webapp.vercel.app/forgot-password/${forgotPasswordUrlUuid}`;

        // Define the email options
        const mailOptions = {
            from: `"Matagaruda" <${process.env.EMAIL_USER}>`, // sender address
            to: email, // list of receivers
            subject: "Password Reset", // Subject line
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetPasswordUrl}`, // plain text body
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>` // html body
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return { message: 'Password reset email sent'};
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Error sending password reset email');
    }
};

module.exports = { sendForgotPasswordEmail };


module.exports = {sendForgotPasswordEmail}