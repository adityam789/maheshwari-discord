// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const { promisify } = require("util");

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

const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: `Invalid HTTP Method of request` }),
    };
  }
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
  try {

    const client = redis.createClient({
      host: process.env.REDISHOST,
      port: process.env.REDISPORT,
      password: process.env.REDISPASSWORD,
    });

    const getAsync = promisify(client.get).bind(client);
    const payload = jwt.verify(token, process.env.SECRET || "SUPERSECRET");
    const OTP = await getAsync(
      `OTP.${payload.user.username}#${payload.user.discriminator}`
    );
    const profile = await getAsync(
      `user.${payload.user.username}#${payload.user.discriminator}`
    );
    const parsedProfile = JSON.parse(profile);

    client.quit()

    if(OTP !== JSON.parse(event.body).OTP){
      return { statusCode: 403, body: "The invite code invalid" };
    }

    const response = await axios({
      url: `https://discord.com/api/guilds/${process.env.GUILDID}/members/${parsedProfile.id}`,
      data: { access_token: parsedProfile.accessToken },
      method: "PUT",
      headers: { Authorization: `Bot ${process.env.BOTTOKEN}` },
    })

    return {
      statusCode: response.status,
      body: JSON.stringify({ message: `Hello World` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
