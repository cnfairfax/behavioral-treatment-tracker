const userConfirmationEmail = (user) => {
    return ({
        from: 'info@sandboxbda8b903a1704003bac1d9c40ec4b89e.mailgun.org',
        to: user.email,
        subject: 'Bible Study: Please Confirm Your Email Address to Activate Your Account',
        text: 'Go to this URL to activate your account: ' + 'https://localhost:3000/api/v1/users/confirmation' + '/' + user.id + '/' + user.confirmation_code,
        html: '<p>Activate your account <a href="https://localhost:3000/api/v1/users/confirmation' + '/' + user.id + '/' + user.confirmation_code + '">here</a>'
    });
}

export default userConfirmationEmail