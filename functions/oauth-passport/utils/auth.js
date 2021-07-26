const { sign } = require("jsonwebtoken");
const passport = require("passport");
const { Strategy: DiscordStrategy } = require("passport-discord");
const passportJwt = require("passport-jwt");
const redis = require("redis");

const {
  // BASE_URL,
  ENDPOINT,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  SECRET,
} = require("./config");

const authJwt = function (user) {
  return sign({ user: user }, SECRET, { expiresIn: "1h" });
};

const applyPassportStrategies = function () {
  passport.use(getDiscordStrategy());
  passport.use(getJwtStrategy());
};

const getDiscordStrategy = function () {
  return new DiscordStrategy(
    {
      clientID: DISCORD_CLIENT_ID,
      clientSecret: DISCORD_CLIENT_SECRET,
      callbackURL: `${ENDPOINT}/oauth-passport/discord/callback`,
      scope: ["identify", "email", "guilds.join", "guilds"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const isInServer = profile.guilds.some(
          (guild) => guild.id === process.env.GUILDID
        );
        const client = redis.createClient({
          host: process.env.REDISHOST,
          port: process.env.REDISPORT,
          password: process.env.REDISPASSWORD
        });
        client.setex(`user.${profile.username}#${profile.discriminator}`, 3600, JSON.stringify(profile))
        client.quit()
        const user = {
          email: profile.email,
          username: profile.username,
          discriminator: profile.discriminator,
          id: profile.id,
          isInServer: isInServer,
          avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`,
        };
        const jwt = authJwt(user);
        return done(null, { user, jwt });
      } catch (error) {
        return done(error);
      }
    }
  );
};

const getJwtStrategy = function () {
  return new passportJwt.Strategy(
    {
      jwtFromRequest(req) {
        if (!req.cookies) throw new Error("Missing cookie-parser middleware");
        return req.cookies.jwt;
      },
      secretOrKey: SECRET,
    },
    async ({ user: { email } }, done) => {
      try {
        // Here you'd typically load an existing user
        // and use the data to create the JWT.
        const jwt = authJwt(email);

        return done(null, { email, jwt });
      } catch (error) {
        return done(error);
      }
    }
  );
};

module.exports = {
  applyPassportStrategies,
};
