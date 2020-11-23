module.exports = {
    authenticationMode: "ServicePrincipal",
    authorityUri: "https://login.microsoftonline.com/common/v2.0",
    scope: "https://analysis.windows.net/powerbi/api",
    apiUrl: "https://api.powerbi.com/",
    clientId: process.env.clientId,
    workspaceId: process.env.workspaceId,
    reportId: process.env.reportId,
    pbiUsername: "",
    pbiPassword: "",
    clientSecret: process.env.clientSecret,
    tenantId: process.env.tenantId,
    datasetId: process.env.datasetId,
    roles: ["sales"]
}