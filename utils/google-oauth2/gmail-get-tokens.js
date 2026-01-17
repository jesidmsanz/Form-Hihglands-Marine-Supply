const oauth2Client = require('./gmail-oauth2-client');

// Replace with the code you've got on
//   const code = '4/AABBCC-abcdEFGH1-aBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDeaBcDe';

//   const oauth2Client = new google.auth.OAuth2(
//     process.env.GMAIL_OAUTH_CLIENT_ID,
//     process.env.GMAIL_OAUTH_CLIENT_SECRET,
//     process.env.GMAIL_OAUTH_REDIRECT_URL,
//   );

const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.info(tokens);
  return tokens;
};

module.exports = getToken;
