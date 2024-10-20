export default function (plugin: any): any {
  plugin.controllers.auth.emailConfirmation = async (ctx: any) => {
    console.log("Custom email confirmation called!!!");

    const { confirmation: confirmationToken } = ctx.query;

    if (!confirmationToken) {
      return ctx.badRequest("Missing confirmation token");
    }

    try {
      const userService = strapi.plugins["users-permissions"].services.user;
      const jwtService = strapi.plugins["users-permissions"].services.jwt;

      // Fetch the user by confirmationToken
      const [user] = await userService.fetchAll({
        filters: { confirmationToken },
      });

      if (!user) {
        return ctx.notFound("Invalid token");
      }

      // Confirm the user and nullify the confirmationToken
      const returnedUser = await userService.edit(user.id, {
        confirmed: true,
        confirmationToken: null,
      });

      // Send a success response without redirection
      ctx.send({
        message: "Email confirmed successfully",
        user: {
          id: returnedUser.id,
          username: returnedUser.username,
          email: returnedUser.email,
          provider: returnedUser.provider,
          resetPasswordToken: returnedUser.resetPasswordToken,
          confirmationToken: returnedUser.confirmationToken,
          confirmed: returnedUser.confirmed,
          blocked: returnedUser.blocked,
          createdAt: returnedUser.createdAt,
          updatedAt: returnedUser.updatedAt,
        },
        jwt: jwtService.issue({ id: user.id }),
      });
    } catch (err) {
      console.error("Error confirming email:", err);
      return ctx.internalServerError("An error occurred while confirming email");
    }
  };

  return plugin;
}
