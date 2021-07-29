const redis = require("redis");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  if (!event.headers.cookie) {
    return {
      statusCode: 400,
      body: `{ message: "Missing cookie" }`,
    };
  }
  const token = extractCookies(event.headers.cookie).jwt;
  if (!token) {
    return {
      statusCode: 401,
      body: `{ message: "No token Provided" }`,
    };
  }
  if (!event.queryStringParameters.invitecode) {
    return {
      statusCode: 400,
      body: `{ message: "Missing Invite Code" }`,
    };
  }

  try {
    const profile = jwt.verify(token, process.env.SECRET || "SUPERSECRET");

    const client = redis.createClient({
      host: process.env.REDISHOST,
      port: process.env.REDISPORT,
      password: process.env.REDISPASSWORD,
    });

    const getAsync = promisify(client.get).bind(client);

    const inviteCode = await getAsync(
      `invite.${profile.user.username}#${profile.user.discriminator}`
    );

    client.quit();
    const receivedInviteCode = event.queryStringParameters.invitecode;

    console.log(receivedInviteCode, inviteCode)

    if (inviteCode === receivedInviteCode) {
      return {
        statusCode: 204,
        // body: JSON.stringify({ message: `Hello ${subject}` }),
        // // more keys you can return:
        // headers: { "headerName": "headerValue", ... },
        // isBase64Encoded: true,
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Incorrect invite code` }),
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

function extractCookies(cookieStr) {
  return cookieStr
    .match(/(^|(?<=, ))[^=;,]+=[^;]+/g)
    .map((cookie) => cookie.split("=").map((v) => v.trim()))
    .filter((v) => v[0].length && v[1].length)
    .reduce((builder, cur) => {
      builder[cur[0]] = cur[1];
      return builder;
    }, {});
}

module.exports = { handler };
