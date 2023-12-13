const express = require('express');
const routes = express.Router();

const frontendRouter = require('./frontend/frontendRoutes');
routes.use(frontendRouter);

const apiRouter = require('./api/backendRoutes');
routes.use("/api", apiRouter);

module.exports = routes;