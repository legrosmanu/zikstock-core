const express = require('express');

const { ZikresourceAPI } = require('./zikresource/zikresource-api');

const app = express();

const zikresourceAPI = new ZikresourceAPI();
app.use('/api/zikresources', zikresourceAPI.router);

/* eslint-disable */
// Error handling. Express expects to have the 4 parameters, so, need to disable eslint.
// This error handling is because by default Express manage the HTML responses, not the JSON errors.
app.use((err, req, res, next) => {
    let status = 500;
    let error = {};
    if (err) {
        error = err;
        if (error.status) {
            status = error.status;
        }
    }
    res.status(status).json(error);
});
/* eslint-enable */

module.exports = app;
