require("dotenv").config();
const db = require("./src/models");
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Synced db.");

    const express = require("express");
    const cors = require("cors");

    const app = express();
    const port = 3030
    const swaggerJsdoc = require("swagger-jsdoc");
    const swaggerUi = require("swagger-ui-express");
    const authMiddleware = require("./src/middlewares/authMiddleware");

    const authRoutes = require("./src/routes/authRoute");
    const testRoutes = require("./src/routes/testRoute");
    const videoResultRoutes = require("./src/routes/videoResultRoute");
    const dashboardRoutes = require("./src/routes/dashboardRoute");
    const forgotPasswordRoutes = require('./src/routes/forgotPasswordRoute')

    // middleware
    app.use(express.static("public"));
    app.use(express.json());

    // corsMiddleware
  //   const corsOptions = {
  //     origin: 'https://eci-webapp-staging.vercel.app',
  //     methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
  //     allowedHeaders: 'Content-Type,Authorization',
  //     credentials: true,
  //     optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  //     maxAge: 3600 // Cache the preflight response for 1 hour
  // };
    app.use(cors());

    // swaggerMiddleware
    const options = {
      definition: {
        openapi: "3.1.0",
        info: {
          title: "ECI Webapp API",
          version: "0.1.0",
          description: "",
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
            description: "Live server",
          },
        ],
      },
      apis: ["./src/routes/*.js"],
    };

    const specs = swaggerJsdoc(options);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    //// routes
    // app.get('*', checkUser);
    // app.get('/', (req, res) => res.render('home'));
    // app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
    app.use("/auth", authRoutes);
    
    app.use("/test", authMiddleware.requireAuth, testRoutes);
    app.use("/videoResult", authMiddleware.requireAuth, videoResultRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/forgot-password', forgotPasswordRoutes);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
