const User = (email, hashedPassword, username = null) => ({
    email,
    hashedPassword,
    username,
    role: "member",
    since: new Date().toUTCString()
});
module.exports = User;
