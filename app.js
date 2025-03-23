require("dotenv").config();
const db = require("./src/models");
const { createProxyMiddleware } = require('http-proxy-middleware');

// const app = express();
// const port = 3030;

const microServiceProxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
  prependPath: false,
  pathRewrite: (path, req) => {
    return '/api' + path;
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying to FastAPI: ${req.method} ${proxyReq.path}`);
    
    // Add ngrok-skip-browser-warning header to bypass ngrok warnings
    proxyReq.setHeader('ngrok-skip-browser-warning', '1');
  },
  // Add headers to the proxied response
  onProxyRes: (proxyRes, req, res) => {
    // Ensure CORS headers are set on the response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning';
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      success: false,
      message: 'Error connecting to micro-service',
      error: err.message
    });
  }
});

db.sequelize
  .sync({alter: true})
  .then(() => {
    console.log("Synced db.");

    const express = require("express");
    const cors = require("cors");

    const app = express();
    const port = 3030
    const swaggerJsdoc = require("swagger-jsdoc");
    const fs = require('fs');
    const path = require('path');
    const swaggerUi = require("swagger-ui-express");
    const authMiddleware = require("./src/middlewares/authMiddleware");

    const authRoutes = require("./src/routes/authRoute");
    const testRoutes = require("./src/routes/testRoute");
    const videoResultRoutes = require("./src/routes/videoResultRoute");
    const dashboardRoutes = require("./src/routes/dashboardRoute");
    const forgotPasswordRoutes = require('./src/routes/forgotPasswordRoute')
    const videoUploadRoutes = require("./src/routes/videoUploadRoute");
    
    // middleware
    app.use('/api', microServiceProxy);
    app.use(express.static("public"));
    app.use(express.json());

    app.use(express.json({ limit: '5gb' }));
    app.use(express.urlencoded({ extended: true, limit: '5gb' }));

    const uploadDir = path.join(__dirname, 'temp-uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // CORS middleware
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning, access-control-allow-origin');
      
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      
      next();
    });

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
    app.use("/videoUpload", authMiddleware.requireAuth, videoUploadRoutes);

    const server = app.listen(port, () => {
      console.log(`Express server listening on port ${port}`);
      console.log(`Proxying /api requests to FastAPI on port 8000`);
    });
    server.timeout = 3600000;
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
  