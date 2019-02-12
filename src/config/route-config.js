module.exports = {
    init(app){
        const staticRoutes = require("../routes/static");
        const topicRoutes = require("../routes/topics");
        const postRoutes = require("../routes/posts");
        const userRoutes = require("../routes/users");

        app.use(staticRoutes);
        app.use(postRoutes);
        app.use(userRoutes);
        app.use(topicRoutes);
    }
}