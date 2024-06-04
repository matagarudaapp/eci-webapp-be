const db = require('./src/models');
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    const express = require('express');
    const app = express();
    const port = 3000

    const authRoutes = require('./src/routes/authRoute');
    const testRoutes = require('./src/routes/testRoute')

    // middleware
    const authMiddleware = require('./src/middlewares/authMiddleware')
    app.use(express.static('public'));
    app.use(express.json());

    // view engine
    // app.set('view engine', 'ejs');

    // database connection

    // routes
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


