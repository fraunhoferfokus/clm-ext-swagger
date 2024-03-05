**This microservice is based upon  [clm-core](https://github.com/fraunhoferfokus/clm-core) and extends the basic functionalities with additional features**

# CLM-EXT-SWAGGER
Serves as documentation to display all routes of either clm-extensions or the clm-core. Dynamically receives the swagger configuration of the deployed microservices.

## Requirements
- MariaDB, set up locally.
- Node.js 20.x
### Folder Structure
root

├── api-docs # Open API 3.0.0 definition as .yaml file documenting all routes and data models this service offers.

├── docs # Developer documentation of all functions, classes, interfaces, types this service exposes as an npm package.

├── dist # The built TypeScript project transpiled to JavaScript.

└── src # Business-relevant logic for this web server.

### Architecture
![Entit Relationship Model](assets/clm.EntityRelationshipdiagram.v1p0p0.svg)

The Entity Relationship Model of the Open Core is shown above.

## Setup for testing the webserver 

1. npm install
2. Copy .env.default to .env and overwrite needed properties

Following table gives an overview of the settings you can change through the environment variables

| Name                    | Example                                         | Required (Yes/No) | Description                                                                            |
| ----------------------- | ----------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------- |
| PORT                    | 3010                                            | Yes               | The port on which the service should be deployed.                                      |
| `DEPLOY_URL`            | `HOST_PROTOCOL://HOST_ADDRESS:GATEWAY_PORT/api` | Yes               | The address where all microservices are to be orchestrated. A `/api` must be appended. |
| `CORE_API`              |                                                 | Yes               | The URL where the core open specification is located.                                  |
| `SERVICE_PROVIDERS_API` |                                                 | Yes               | The URL where the service providers' open specification is located.                    |
| `TOOLS_API`             |                                                 | Yes               | The URL where the tools' open specification is located.                                |
| `LAUNCH_API`            |                                                 | Yes               | The URL where the launch open specification is located.                                |
| `TRACE_DATA_API`        |                                                 | Yes               | The URL where the trace data open specification is located.                            |
| `LEARNING_OBJECTS_API`  |                                                 | Yes               | The URL where the learning objects' open specification is located.                     |

3.1 `npm run dev` for development with nodemon
3.2 `npm start` for deployment

4. Subsequently, the Swagger UI of the Open-API specification should be accessible at the following address. It is an aggregated Open-API of all the microservices. If a specific microservice needs to be tested, the mask must be adjusted to point to the respective host and port:

`http://localhost:PORT/api`

**To access the API endpoints detailed in the Open-API specification, an API token is required. This token is generated during the initialization of the clm-core module. Please refer to the .env table**


# Swagger Documentation

- A Swagger UI is presented at the specified `DEPLOY_URL`. This UI displays all REST interfaces in Open API 3.0 format that are offered through the Open Core.

### Changelog

The changelog can be found in the [CHANGELOG.md](CHANGELOG.md) file.

## Get in touch with a developer

Please see the file [AUTHORS.md](AUTHORS.md) to get in touch with the authors of this project.
We will be happy to answer your questions at {clm@fokus.fraunhofer.de}

## License

The project is made available under the license in the file [license.txt](LICENSE.txt)




