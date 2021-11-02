"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TASKBAR_PSW = exports.PROTOCOL_PSW = exports.DESKTOP_PSW = exports.USER_PSW = exports.DATA_NAME = exports.__front = exports.__root = void 0;
const path = require("path");
const code_database_1 = require("code-database");
exports.__root = path.join(__dirname, "..");
exports.__front = path.join(exports.__root, "core", "front");
exports.DATA_NAME = "data";
exports.USER_PSW = code_database_1.Crypto.encode("user_data_web_desktop", "user_data_web_desktop");
exports.DESKTOP_PSW = code_database_1.Crypto.encode("desktop_data_web_desktop", "desktop_data_web_desktop");
exports.PROTOCOL_PSW = code_database_1.Crypto.encode("protocol_data_web_desktop", "protocol_data_web_desktop");
exports.TASKBAR_PSW = code_database_1.Crypto.encode("taskbar_data_web_desktop", "taskbar_data_web_desktop");
//# sourceMappingURL=env.js.map