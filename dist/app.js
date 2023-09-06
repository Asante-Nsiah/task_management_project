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
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("passport"));
const passportConfig_1 = __importDefault(require("./config/passportConfig"));
const authCtrl_1 = require("./controller/authCtrl");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passportConfig_1.default)(passport_1.default);
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '..', 'dist', 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist', 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'dist')));
app.use(express_1.default.static(path_1.default.join(__dirname, 'dist', 'modules')));
app.use(routing_1.Controller);
app.use(authCtrl_1.checkTokenValidity);
const setupExpress = () => {
    app.route("/").get(root_1.root);
    app.route("/login").get(routing_1.Controller);
    app.route("/login").post(routing_1.Controller);
    // app.route("/loginAccount").get(Controller);
    app.route("/set-new-password").get(routing_1.Controller);
    app.route("/Users").get(routing_1.Controller);
    app.route("/admin").get(routing_1.Controller);
    app.route("/logout").post(routing_1.Controller);
    app.route("/user-dashboard").get(routing_1.Controller);
    app.route("/create-project").get(routing_1.Controller);
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