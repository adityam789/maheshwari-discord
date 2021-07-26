// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { nanoid } = require("nanoid");
const redis = require("redis");
const jwt = require("jsonwebtoken");

const handler = async (event) => {

  console.log(event.body)

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

  let randomInviteCode = nanoid(8);
  console.log(randomInviteCode);
  const client = redis.createClient({
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    password: process.env.REDISPASSWORD,
  });

  client.setex(`invite.${JSON.parse(event.body).username}`, 3600, randomInviteCode);
  client.end()

  try {
    jwt.verify(token, process.env.SECRET || "SUPERSECRET");
    return {
      statusCode: 200,
      body: JSON.stringify({
        link: `${event.headers.host}/?code=${randomInviteCode}`,
        username: JSON.parse(event.body).username,
      }),
    };
  } catch (error) {
    console.log(error);
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
