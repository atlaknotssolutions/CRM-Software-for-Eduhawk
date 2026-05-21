// const { google } = require("googleapis");
// require("dotenv").config();

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URI
// );

// const SCOPES = [
//   "https://www.googleapis.com/auth/calendar",
//   "https://www.googleapis.com/auth/calendar.events"
// ];

// // Generate Auth URL for admin login
// const getAuthUrl = () => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
//   return authUrl;
// };

// // Get token after Google login
// const getToken = async (code) => {
//   const { tokens } = await oAuth2Client.getToken(code);
//   oAuth2Client.setCredentials(tokens);
//   return tokens;
// };

// // Export client
// module.exports = { oAuth2Client, getAuthUrl, getToken };










const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
];

// ⭐ IMPORTANT: set refresh token from env
oAuth2Client.setCredentials({
  refresh_token: process.env.ADMIN_REFRESH_TOKEN
});


// Generate Auth URL for admin login
const getAuthUrl = () => {
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"
  });
};


// Get token after Google login
const getToken = async (code) => {
  const { tokens } = await oAuth2Client.getToken(code);

  console.log("NEW TOKENS:", tokens);

  // set credentials
  oAuth2Client.setCredentials(tokens);

  return tokens;
};

module.exports = { oAuth2Client, getAuthUrl, getToken };