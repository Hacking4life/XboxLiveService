const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

// Load the .env file if it exists
require("dotenv").config();

const credential = new DefaultAzureCredential();

let KeyVault = {
  // Build the URL to reach your key vault
  url: `https://${process.env["KEYVAULT_NAME"]}.vault.azure.net`,

  getSecretClient() {
    // Lastly, create our secrets client and connect to the service
    const client = new SecretClient(this.url, credential);
    return client;
  },
};

module.exports = {
  async createSecret(res, secretName, secretValue) {
    try {
      const secret = await KeyVault.getSecretClient().setSecret(
        secretName,
        secretValue
      );
      return secret;
    } catch (err) {
      return res.status(err.statusCode).send(err);
    }
  },
  async getLatestSecret(res, secretName) {
    try {
      const latestSecret = await KeyVault.getSecretClient().getSecret(
        secretName
      );
      return latestSecret;
    } catch (err) {
      return res.status(err.statusCode).send(err);
    }
  },
  async getSpecificSecret(res, secretName) {
    try {
      const specificSecret = await KeyVault.getSecretClient().getSecret(
        secretName,
        { version: version }
      );
      return specificSecret;
    } catch (err) {
      return res.status(err.statusCode).send(err);
    }
  },
  async setSecret(res, secretName, secretValue, readable, tags) {
    try {
      const secret = await KeyVault.getSecretClient().setSecret(
        secretName,
        secretValue,
        {
          enabled: readable,
          tags: tags,
        }
      );

      return secret;
    } catch (err) {
      return res.status(err.statusCode).send(err);
    }
  },
  async updateSecretProperties(res, secretName, readable, tags) {
    try {
      const latestSecret = await KeyVault.getSecretClient().getSecret(
        secretName
      );
      const updatedSecret = await KeyVault.getSecretClient().updateSecretProperties(
        secretName,
        latestSecret.properties.version,
        {
          enabled: readable,
          tags: tags,
        }
      );
      return updatedSecret;
    } catch (err) {
      return res.status(err.statusCode).send(err);
    }
  },
  async deleteSecret(secretName) {
    return await KeyVault.getSecretClient().beginDeleteSecret(secretName);
  },
  async listSecrets(res) {
    try {
      // List the secrets we have, all at once
      const secrets = [];
      const listPropertiesOfSecrets = KeyVault.getSecretClient().listPropertiesOfSecrets();
      while (true) {
        let { done, value } = await listPropertiesOfSecrets.next();
        if (done) {
          break;
        }
        if (value.enabled) {
          const secret = await KeyVault.getSecretClient().getSecret(value.name);
          console.log("secret: ", secret);
          secrets.push(secret);
        }
      }
      return secrets;
    } catch (err) {
      return res.status(err.statusCode).send(err);
    }
  },
};
