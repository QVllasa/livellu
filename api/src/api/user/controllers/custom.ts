// /src/api/user/controllers/custom.js

module.exports = {
  async sync(ctx) {
    const { email } = ctx.request.body;

    // Check if the user exists in Strapi
    let user = await strapi.query('plugin::users-permissions.user').findOne({ where: { email } });

    // If user doesn't exist, create one
    if (!user) {
      user = await strapi.query('plugin::users-permissions.user').create({
        data: {
          email,
          username: email,
          confirmed: true, // Automatically confirm if signing in with Google
        },
      });
    }

    // Return the user data
    ctx.send(user);
  },
};
