// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { default: axios } = require("axios");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const client = redis.createClient({
  host: process.env.REDISHOST,
  port: process.env.REDISPORT,
  password: process.env.REDISPASSWORD,
});
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

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
    const payload = jwt.verify(token, process.env.SECRET || "SUPERSECRET");
    const profile = await getAsync(payload.user.id);
    const parsedProfile = JSON.parse(profile);

    await axios({
      url: `https://discord.com/api/guilds/${866381528463835176}/members/${parsedProfile.id}`,
      data: { access_token: parsedProfile.accessToken },
      method: "PUT",
      headers: { Authorization: `Bot ${process.env.BOTTOKEN}` },
    }).then(console.log);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello Penis` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
