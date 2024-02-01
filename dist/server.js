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
"use strict";
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
const clm_core_2 = require("clm-core");
const swaggerUi = require('swagger-ui-express');
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use(clm_core_1.errHandler);
let swaggerDocu = clm_core_2.SwaggerDefinition.definition;
app.get('/swagger.json', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    getRoutes(4).then(() => {
        return res.json(swaggerDocu);
    }).catch((err) => {
        return res.status(500).json({ message: 'Error while building swagger.json' });
    });
}));
app.use('/api', swaggerUi.serve, swaggerUi.setup(null, {
    explorer: true, swaggerOptions: {
        url: process.env.DEPLOY_URL + '/swagger.json',
    }
}));
function getRoutes(counter = 0) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let paths = (_a = process.env.PATHS) === null || _a === void 0 ? void 0 : _a.split(',');
        if (!paths)
            paths = ['core', 'learningObjects', 'launch', 'traceData', 'objectMetadata'];
        const promises = [];
        for (const url of paths) {
            promises.push(axios_1.default.get(`${process.env.GATEWAY_URL}/${url}/swagger`));
        }
        yield Promise.all(promises).then((values) => {
            values.forEach((value) => {
                swaggerDocu.paths = Object.assign(Object.assign({}, swaggerDocu.paths), value.data.paths);
                swaggerDocu.components = Object.assign(Object.assign({}, swaggerDocu.components), value.data.components);
            });
        }).catch((err) => {
            console.log(err.response.data);
            if (counter < 4)
                return getRoutes(counter + 1);
            throw err;
        });
    });
}
app.listen(PORT, () => {
    console.log('Swagger microservice builded');
});
