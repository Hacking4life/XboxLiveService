const XboxLiveAuth = require("@xboxreplay/xboxlive-auth");
const XboxLiveAPI = require("@xboxreplay/xboxlive-api");
const Smartglass = require("xbox-smartglass-core-node");
const keyvaultservice = require("./keyvaultservice");

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

let XBoxLive = {
  token: null,

  get userToken() {
    return this.token;
  },

  set userToken(value) {
    this.token = value;
  },
};

module.exports = {
  async XBoxLiveAuthentication(req, res) {
    try {
      const secret = await keyvaultservice.getLatestSecret(req.body.userId);
      if (secret.statusCode == 404) {
        const token = await XboxLiveAuth.authenticate(
          req.body.username,
          req.body.password
        );
        keyvaultservice.createSecret(req.body.userId, JSON.stringify(token));
        XBoxLive.userToken = token;
      } else {
        const token = JSON.parse(secret.value);
        XBoxLive.userToken = token;
      }
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async XBoxLiveAccountDetails(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.getPlayerSettings(
        req.body.gamerTag,
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        playerMetadata
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async XBoxCustomGETAPI(baseUrl, url, req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.call(
        {
          url: `${baseUrl}/${url}`,
          method: "GET",
        },
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        2
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async ChangeGamerTag(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.call(
        {
          url: "https://accounts.xboxlive.com//users/current/profile/gamertag",
          method: "POST",
          data: {
            gamertag: req.body.gamerTag,
            preview: false,
            reservationId: parseInt(XBoxLive.userToken.userXUID),
          },
        },
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        2
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async XBoxCustomPOSTAPI(baseUrl, url, body, req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.call(
        {
          url: `${baseUrl}/${url}`,
          method: "POST",
          body: body,
        },
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        2
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async XBoxLiveGamerXUID(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.getPlayerXUID(req.body.gamerTag, {
        userHash: XBoxLive.userToken.userHash,
        XSTSToken: XBoxLive.userToken.XSTSToken,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  },
  async getMyScreenshots(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.getPlayerScreenshots(
        req.body.gamerTag,
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        {
          maxItems: 25,
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async getMyGamerClips(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.getPlayerGameClips(
        req.body.gamerTag,
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        {
          maxItems: 25,
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async getMyFriends(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.call(
        {
          url: `https://social.xboxlive.com/users/xuid(${parseInt(
            XBoxLive.userToken.userXUID
          )})/people`,
          method: "GET",
        },
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        2
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async getMyAchievements(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.call(
        {
          url: `https://achievements.xboxlive.com/users/xuid(${parseInt(
            XBoxLive.userToken.userXUID
          )})/achievements`,
          method: "GET",
        },
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        },
        2
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async PlayerActivityHistory(req, res) {
    try {
      if (XBoxLive.userToken == null) {
        await module.exports.XBoxLiveAuthentication(req, res);
      }
      return await XboxLiveAPI.getPlayerActivityHistory(
        parseInt(XBoxLive.userToken.userXUID),
        {
          userHash: XBoxLive.userToken.userHash,
          XSTSToken: XBoxLive.userToken.XSTSToken,
        }
      );
    } catch (err) {
      res.status(500).send(err);
    }
  },
};
