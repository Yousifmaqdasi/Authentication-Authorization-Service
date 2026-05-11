import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Authentication API",
    version: "1.0.0",
    description: "Backend authentication API documentation",
  },

  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },
  },
};

const options = {
  swaggerDefinition,

  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
