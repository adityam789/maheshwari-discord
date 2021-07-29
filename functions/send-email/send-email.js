const sgMail = require("@sendgrid/mail");
const redis = require("redis");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { promisify } = require("util");

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
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

    const invitecode = JSON.parse(event.body).inviteCode

    console.log(invitecode)

    const payload = jwt.verify(token, process.env.SECRET || "SUPERSECRET");

    const client = redis.createClient({
      host: process.env.REDISHOST,
      port: process.env.REDISPORT,
      password: process.env.REDISPASSWORD,
    });

    const getAsync = promisify(client.get).bind(client);
    const realinvitecode = await getAsync(
      `invite.${payload.user.username}#${payload.user.discriminator}`
    );

    if(realinvitecode !== invitecode){
      return { statusCode: 403, body: "The invite code invalid" };
    }

    let OTP = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    client.setex(`OTP.${payload.user.username}#${payload.user.discriminator}`, 3600, OTP);
    client.quit();

    sgMail.setApiKey(process.env.SENDGRID_APIKEY);
    const msg = {
      to: JSON.parse(event.body).email, // Change to your recipient
      from: "aditya@adityamaheshwari.ml", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text:
        "and easy to do anywhere, even with Node.js. Anyways here is your OTP " +
        OTP.toString(),
      html: `<strong>and easy to do anywhere, even with Node.js. Anyways here is your OTP ${OTP}</strong>`,
    };
    await sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });

    return {
      statusCode: 204,
      // body: JSON.stringify({ message: `Hello ${subject}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    };
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
