// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");

const getAccessToken = async function () {

    // Use ADAL.js for authentication
    let adal = require("adal-node");

    let AuthenticationContext = adal.AuthenticationContext;

    // Create a config variable that store credentials from config.js
    let config = require(__dirname + "/../config/config.js");

    let authorityUrl = config.authorityUri;

    // Check for the MasterUser Authentication
    if (config.authenticationMode.toLowerCase() === "masteruser") {
        let context = new AuthenticationContext(authorityUrl);

        return new Promise(
            (resolve, reject) => {
                context.acquireTokenWithUsernamePassword(config.scope, config.pbiUsername, config.pbiPassword, config.clientId, function (err, tokenResponse) {

                    // Function returns error object in tokenResponse
                    // Invalid Username will return empty tokenResponse, thus err is used
                    if (err) {
                        reject(tokenResponse == null ? err : tokenResponse);
                    }
                    resolve(tokenResponse);
                })
            }
        );

        // Service Principal auth is the recommended by Microsoft to achieve App Owns Data Power BI embedding
    } else if (config.authenticationMode.toLowerCase() === "serviceprincipal") {
        const credential = new DefaultAzureCredential();

        const vaultName = 'pocpbibackend';
        const url = `https://${vaultName}.vault.azure.net`;

        // Change the Azure Key Vault service API version being used via the `serviceVersion` option
        const client = new SecretClient(url, credential, {
            serviceVersion: "7.0"
        });

        try{
            let clientId = await client.getSecret('clientId')
            let clientSecret = await client.getSecret('clientSecret')
            let tenantId = await client.getSecret('tenantId')
    
            console.log(clientId)
            console.log(clientSecret)
            
            authorityUrl = authorityUrl.replace("common", tenantId.value);
            let context = new AuthenticationContext(authorityUrl);

            return new Promise(
                (resolve, reject) => {
                    context.acquireTokenWithClientCredentials(config.scope, clientId.value, clientSecret.value, function (err, tokenResponse) {
                        // Function returns error object in tokenResponse
                        // Invalid Username will return empty tokenResponse, thus err is used
                        console.log(tokenResponse)
                        if (err) {
                            console.log(err)
                            reject(tokenResponse == null ? err : tokenResponse);
                        }
                        resolve(tokenResponse);
                    })
                }
            );
        }catch(err){
            throw err
        }
    }
}

module.exports.getAccessToken = getAccessToken;