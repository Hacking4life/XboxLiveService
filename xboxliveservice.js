const XboxLiveAuth = require("@xboxreplay/xboxlive-auth");
const XboxLiveAPI = require("@xboxreplay/xboxlive-api");

const playerMetadata = [
  "UniqueModernGamertag",
  "GameDisplayPicRaw",
  "Gamerscore",
  "Location",
  "Gamertag",
  "AccountTier",
  "XboxOneRep",
  "PreferredColor",
  "RealName",
  "Bio",
  "Location",
  "ModernGamertag",
  "ModernGamertagSuffix",
  "UniqueModernGamertag",
  "RealNameOverride",
  "TenureLevel",
  "Watermarks",
  "IsQuarantined",
  "DisplayedLinkedAccounts",
];

module.exports = {
  async XBoxLiveAuthentication(username, password) {
    return await XboxLiveAuth.authenticate(username, password);
  },
  async XBoxLiveAccountDetails(gamerTag, username, password) {
    const tokenResponse = await module.exports.XBoxLiveAuthentication(
      username,
      password
    );
    return await XboxLiveAPI.getPlayerSettings(
      gamerTag,
      {
        userHash: tokenResponse.userHash,
        XSTSToken: tokenResponse.XSTSToken,
      },
      playerMetadata
    );
  },
  async XBoxCustomGETAPI(baseUrl, url, username, password) {
    const tokenResponse = await module.exports.XBoxLiveAuthentication(
      username,
      password
    );
    return await XboxLiveAPI.call(
      {
        url: `${baseUrl}/${url}`,
        method: "GET",
      },
      {
        userHash: tokenResponse.userHash,
        XSTSToken: tokenResponse.XSTSToken,
      },
      2
    );
  },
  async XBoxCustomPOSTAPI(baseUrl, url, body, username, password) {
    const tokenResponse = await module.exports.XBoxLiveAuthentication(
      username,
      password
    );
    return await XboxLiveAPI.call(
      {
        url: `${baseUrl}/${url}`,
        method: "GET",
        body: body,
      },
      {
        userHash: tokenResponse.userHash,
        XSTSToken: tokenResponse.XSTSToken,
      },
      2
    );
  },
  async XBoxLiveGamerXUID(gamerTag, username, password) {
    const tokenResponse = await module.exports.XBoxLiveAuthentication(
      username,
      password
    );
    return await XboxLiveAPI.getPlayerXUID(gamerTag, {
      userHash: tokenResponse.userHash,
      XSTSToken: tokenResponse.XSTSToken,
    });
  },
};
