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

import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'
import { errHandler } from "clm-core"
import express from 'express'
const swaggerUi = require('swagger-ui-express');
const app = express()
const PORT = process.env.PORT
import swaggerJsdoc from 'swagger-jsdoc'
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
const options: swaggerJsdoc.Options = {
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
}
const swaggerSpecification: any = swaggerJsdoc(options)
app.use(express.json())
app.use(errHandler);

app.get('/health', (req, res) => {
    res.send('OK')
})

app.get('/swagger.json', async (req, res, next) => {
    await getRoutes()
    return res.json(swaggerSpecification)
})
app.use('/api', swaggerUi.serve, swaggerUi.setup(
    null, {
    explorer: true, swaggerOptions: {
        url: 'http://localhost:' + `${PORT}` + '/swagger.json',
    }
}
));

async function getRoutes() {
    for (const url of [
        process.env.CORE_API,
        process.env.SERVICE_PROVIDERS_API,
        process.env.TOOLS_API,
        process.env.LAUNCH_API,
        process.env.TRACE_DATA_API,
        process.env.LEARNING_OBJECTS_API
    ]) {
        try {
            const response = await axios.get(`${url}`)
            const data = response.data
            swaggerSpecification.paths = { ...swaggerSpecification?.paths, ...data.paths }
            swaggerSpecification.components.schemas = { ...swaggerSpecification?.components?.schemas, ...data.components.schemas }
            swaggerSpecification.components.securitySchemes = { ...swaggerSpecification?.components?.securitySchemes, ...data.components.securitySchemes }
            swaggerSpecification.components.parameters = { ...swaggerSpecification?.components?.parameters, ...data.components.parameters }

        } catch (err: any) {
            const code = err?.response?.status || 500
            console.error(`Error while fetching swagger.json from microservice '${url}' with status code ${code}`)
        }
    }
}

app.listen(PORT, () => {
    console.log(`Swagger server is running on port ${PORT}`)
})






