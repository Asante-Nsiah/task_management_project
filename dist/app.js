"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const result = dotenv_1.default.config();
if (result.error) {
    // console.log(`Error loading envirnoment variable, aborting.`);
    process.exit(1);
}
console.log(process.env.PORT);
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const root_1 = require("./route/root");
const utils_1 = require("./route/utils");
const logger_1 = require("./route/logger");
const data_source_1 = require("./route/data-source");
const path_1 = __importDefault(require("path"));
const routing_1 = require("./route/routing");
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Used to parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '..', 'dist', 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist', 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist')));
app.use(routing_1.Controller);
const setupExpress = () => {
    app.route("/").get(root_1.root);
    app.route("/login").get(routing_1.Controller);
};
const startServer = () => {
    let port = 8000;
    const portEnv = process.env.PORT, portArg = process.argv[2];
    if (portEnv !== undefined && (0, utils_1.isInteger)(portEnv)) {
        port = parseInt(portEnv);
    }
    if (!port && (0, utils_1.isInteger)(portArg)) {
        port = parseInt(portArg);
    }
    if (!port) {
        port = 8000;
    }
    app.listen(port, () => {
        logger_1.logger.info(`Server running on  port ${port}`);
    });
};
data_source_1.AppDataSource.initialize()
    .then(() => {
    logger_1.logger.info(`The datasource has been initialized successfully.`);
    setupExpress();
    startServer();
})
    .catch(err => {
    logger_1.logger.error(`Error during datasource initialization.`, err);
    process.exit(1);
});
//# sourceMappingURL=app.js.map