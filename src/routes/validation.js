module.exports = {
    validatePosts(req, res, next) {

        if(req.method === "POST") {

            req.checkParams("topicId", "must be valid").notEmpty().isInt();
            req.checkBody("title", "must be at least 2 characters in length").isLength({min:2});
            req.checkBody("body", "must be at least 10 characters in length").isLength({min:10});
         }

        const errors = req.validationErrors();

        if(errors) {
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer)
        } else {
            return next();
        }
    },
    validateTopics(req, res, next){

        if(req.method === "POST") {
            
            req.checkBody("title", "must be at least 5 characters in length").isLength({min:5});
            req.checkBody("description", "must be at least 10 characters in length").isLength({min:10});
        }

        const errors = req.validationErrors();

        if(errors) {
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer)
        } else {
            return next();
        }
    }
}