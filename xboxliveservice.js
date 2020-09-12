const XboxLiveAuth = require("@xboxreplay/xboxlive-auth");
const XboxLiveAPI = require("@xboxreplay/xboxlive-api");
const Smartglass = require('xbox-smartglass-core-node')

const playerMetadata = [
  "GameDisplayPicRaw",
  "Gamerscore",
  "Location",
  "Gamertag",
  "AccountTier",
  "XboxOneRep",
  "RealName",
  "Location",
];
var deviceStatus = {
  current_app: false,
  connection_status: false,
  client: false
}

module.exports = {

  async XBoxLiveAuthentication(username, password) {
    return await XboxLiveAuth.authenticate(username, password);
  },
  async XBoxLiveAccountDetails(xuid, uhash, token) {
    return await XboxLiveAPI.getPlayerSettings(
      xuid,
      {
        userHash: uhash,
        XSTSToken: token,
      },
      playerMetadata
    );
  },
  async XBoxCustomPostAPI(baseUrl, url,  uhash, token,xuid) {

    try{
        return await XboxLiveAPI.call(
          {
            url: `${baseUrl}/${url}`,
            method: "POST",
                 data: {
        userIds: xuid,
        settings: ['GameDisplayName', 'AppDisplayName', 'AppDisplayPicRaw', 'GameDisplayPicRaw', 'PublicGamerpic', 'ShowUserAsAvatar', 'Gamerscore', 'Gamertag', 'AccountTier', 'TenureLevel', 'XboxOneRep', 'PreferredColor', 'Location', 'Bio', 'Watermarks', 'RealName', 'RealNameOverride']
      },
          },
          {
            userHash: uhash,
            XSTSToken: token,
          },
          2
        );
    }catch(err){res.status(500).send(err)};
  },
  
  async XBoxCustomGETAPI(baseUrl, url,  uhash, token) {

try{
    return await XboxLiveAPI.call(
      {
        url: `${baseUrl}/${url}`,
        method: "GET",
      },
      {
        userHash: uhash,
        XSTSToken: token,
      },
      2
    );
}
catch(err){res.status(500).send(err)};
  },
  async ChangeGamerTag(xuid,uhash,token, newgt)
  {
    xuid = parseInt(xuid)
    return await XboxLiveAPI.call(
      {
        url: "https://accounts.xboxlive.com//users/current/profile/gamertag",
        method: "post",
        data: {
          "gamertag": newgt,
          "preview": false,
          "reservationId": xuid
        },
      },
      {
        userHash: uhash,
        XSTSToken: token,
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
   async getMyScreenshots(xuid,uhash,token)
  { 
    return await XboxLiveAPI.getPlayerScreenshots(xuid, {
      userHash: uhash,
      XSTSToken: token,
    });
  },

  async getMyGamerClips(xuid,uhash,token)
  {
    return await XboxLiveAPI.call(
      {
        url: "https://gameclipsmetadata.xboxlive.com//users/me/clips?maxItems=10",
        method: "GET",
        
      },
      {
        userHash: uhash,
        XSTSToken: token,
      },
      2
    );
  },

  async  getMyfriends(xuid,uhash,token)
  {
    return await XboxLiveAPI.call(
      {
        url: `https://social.xboxlive.com/users/xuid(${xuid})/people`,
        method: "GET",
      },
      {
        userHash: uhash,
        XSTSToken: token,
      },
      2
    );
  },

  async PlayerActivityHistory(token)
  {
    return await XboxLiveAPI.getPlayerActivityHistory(token.userXUID, {
      userHash: token.userHash,
      XSTSToken: token.XSTSToken,
    });
  },
};
