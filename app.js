const db = require('./src/models');
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    
    const express = require('express');
    const app = express();
    const port = 3000
    const swaggerJsdoc = require("swagger-jsdoc");
    const swaggerUi = require("swagger-ui-express");
    const authMiddleware = require('./src/middlewares/authMiddleware')
    const cors = require('cors');

    const authRoutes = require('./src/routes/authRoute');
    const testRoutes = require('./src/routes/testRoute')

    // middleware
    app.use(express.static('public'));
    app.use(express.json());
    app.use(cors());

    // swaggerMiddleware
    const options = {
      definition: {
        openapi: "3.1.0",
        info: {
          title: "ECI Webapp API",
          version: "0.1.0",
          description:
            "",
          // license: {
          //   name: "MIT",
          //   url: "https://spdx.org/licenses/MIT.html",
          // },
          contact: {
            name: "ECI",
            url: "",
            email: "endurancechallengeindonesia@gmail.com",
          },
        },
        servers: [
          {
            url: "https://singularly-tops-seal.ngrok-free.app",
            description: "Live server"
          },
        ],
      },
      apis: ["./src/routes/*.js"],
    };
    
    const specs = swaggerJsdoc(options);
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs)
    );

    //// routes
    // app.get('*', checkUser);
    // app.get('/', (req, res) => res.render('home'));
    // app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
    app.use("/auth",authRoutes);
    app.use("/test", authMiddleware.requireAuth, testRoutes);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});


