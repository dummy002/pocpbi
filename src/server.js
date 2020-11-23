// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

let embedToken = require(__dirname + '/embedConfigService.js');
const utils = require(__dirname + "/utils.js");
const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');
const config = require("../config/config");
const fetch = require('node-fetch');
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const app = express();

const port = process.env.PORT || 8080;

app.use(cors())
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/test', function (req, res){
    res.send('hello world')
})

app.get('/getEmbedToken/:username', async function (req, res) {
    let result = await embedToken.getEmbedInfo(req.param("username"), null);   

    // result.status specified the statusCode that will be sent along with the result object
    res.status(result.status).send(result);
});

app.post('/generateToken', async function (req, res){
    let result = await embedToken.getEmbedInfo(req.body.username, req.body.roles);

    // result.status specified the statusCode that will be sent along with the result object
    res.status(result.status).send(result);
})

app.get('/getSecret', async function(req, res){
    const credential = new DefaultAzureCredential();

    const vaultName = 'pocpbibackend';
    const url = `https://${vaultName}.vault.azure.net`;

    // Change the Azure Key Vault service API version being used via the `serviceVersion` option
    const client = new SecretClient(url, credential, {
    serviceVersion: "7.0"
    });

    try{
        let secret = await client.getSecret('clientId')
        res.send(secret)
    }catch(err){
        res.status(400).send(err)
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));