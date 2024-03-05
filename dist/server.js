"use strict";
/* -----------------------------------------------------------------------------
 *  Copyright (c) 2023, Fraunhofer-Gesellschaft zur Förderung der angewandten Forschung e.V.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published by
 *  the Free Software Foundation, version 3.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 *  No Patent Rights, Trademark Rights and/or other Intellectual Property
 *  Rights other than the rights under this license are granted.
 *  All other rights reserved.
 *
 *  For any other rights, a separate agreement needs to be closed.
 *
 *  For more information please contact:
 *  Fraunhofer FOKUS
 *  Kaiserin-Augusta-Allee 31
 *  10589 Berlin, Germany
 *  https://www.fokus.fraunhofer.de/go/fame
 *  famecontact@fokus.fraunhofer.de
 * -----------------------------------------------------------------------------
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
const clm_core_1 = require("clm-core");
const express_1 = __importDefault(require("express"));
const swaggerUi = require('swagger-ui-express');
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
/**
 * @openapi
 * components:
 *   schemas:
 *     relation:
 *       type: object
 *       properties:
 *         fromType:
 *           type: string
 *           description: The type of the node
 *           default: fromTypeNode
 *         toType:
 *           type: string
 *           description: The type of the target node
 *           default: toTypeNode
 *         fromId:
 *           type: string
 *           description: The id of the node
 *           default: fromNodeId
 *         toId:
 *           type: string
 *           description: The id of the target node
 *           default: toNodeId
 *         order:
 *           type: number
 *           description: The order of the relation. Used for example ordering the enrollments of a group/user
 *           default: 0
 *   parameters:
 *     accessToken:
 *       name: x-access-token
 *       in: header
 *       description: The access token
 *       required: true
 *       example: exampleAccessToken
 *       schema:
 *         type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *     refreshAuth:
 *       type: apiKey
 *       in: header
 *       name: x-refresh-token
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CLM-OPEN-CORE API',
            version: '1.0.0',
            description: 'API endpoints the CLM-OPEN-CORE microservices provide',
        },
        servers: [
            {
                "url": "{scheme}://{hostname}:{port}{path}",
                "description": "The production API server",
                "variables": {
                    "hostname": {
                        "default": "localhost",
                    },
                    "port": {
                        "default": `${process.env.PORT}`
                    },
                    "path": {
                        "default": ""
                    },
                    "scheme": {
                        "default": "http",
                    }
                }
            }
        ],
        security: [{
                bearerAuth: [],
            }]
    },
    apis: [
        './src/controllers/*.ts'
    ]
};
const swaggerSpecification = (0, swagger_jsdoc_1.default)(options);
app.use(express_1.default.json());
app.use(clm_core_1.errHandler);
app.get('/health', (req, res) => {
    res.send('OK');
});
app.get('/swagger.json', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield getRoutes();
    return res.json(swaggerSpecification);
}));
app.use('/api', swaggerUi.serve, swaggerUi.setup(null, {
    explorer: true, swaggerOptions: {
        url: 'http://localhost:' + `${PORT}` + '/swagger.json',
    }
}));
function getRoutes() {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        for (const url of [
            process.env.CORE_API,
            process.env.SERVICE_PROVIDERS_API,
            process.env.TOOLS_API,
            process.env.LAUNCH_API,
            process.env.TRACE_DATA_API,
            process.env.LEARNING_OBJECTS_API
        ]) {
            try {
                const response = yield axios_1.default.get(`${url}`);
                const data = response.data;
                swaggerSpecification.paths = Object.assign(Object.assign({}, swaggerSpecification === null || swaggerSpecification === void 0 ? void 0 : swaggerSpecification.paths), data.paths);
                swaggerSpecification.components.schemas = Object.assign(Object.assign({}, (_a = swaggerSpecification === null || swaggerSpecification === void 0 ? void 0 : swaggerSpecification.components) === null || _a === void 0 ? void 0 : _a.schemas), data.components.schemas);
                swaggerSpecification.components.securitySchemes = Object.assign(Object.assign({}, (_b = swaggerSpecification === null || swaggerSpecification === void 0 ? void 0 : swaggerSpecification.components) === null || _b === void 0 ? void 0 : _b.securitySchemes), data.components.securitySchemes);
                swaggerSpecification.components.parameters = Object.assign(Object.assign({}, (_c = swaggerSpecification === null || swaggerSpecification === void 0 ? void 0 : swaggerSpecification.components) === null || _c === void 0 ? void 0 : _c.parameters), data.components.parameters);
            }
            catch (err) {
                const code = ((_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.status) || 500;
                console.error(`Error while fetching swagger.json from microservice '${url}' with status code ${code}`);
            }
        }
    });
}
app.listen(PORT, () => {
    console.log(`Swagger server is running on port ${PORT}`);
});
