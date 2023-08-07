"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// require('dotenv').config();
const express_1 = __importDefault(require("express"));
const root_1 = require("./route/root");
const port = process.env.PORT || 8000;
const app = (0, express_1.default)();
const setupExpress = () => {
    app.route("/").get(root_1.root);
};
const startServer = () => {
    app.listen(port, () => {
        console.log(`Server running on  port ${port}`);
    });
};
setupExpress();
startServer();
// app.get('/', (req, res) => {
//     res.send('Hello, World! THIS IS MY TYPESCRIPT/NODE PROJECT');
//   });
//# sourceMappingURL=app.js.map