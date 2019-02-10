const flairQueries = require("../db/queries.flairs.js");

module.exports = {
    new(req, res, next){
        res.render("flairs/new", {topicId: req.params.topicId});
    },
    create(req, res, next){
        let newFlair = {
            name: req.body.name,
            color: req.body.color,
            topicId: req.params.topicId
        };
        flairQueries.addFlair(newFlair, (err, flair) => {
            if(err) {
                res.redirect(500, "/flairs/new");
            } else {
                res.redirect(303, `/topics/${newFlair.topicId}/flairs/${flair.id}`);
            }
        });
    },
    show(req, res, next){
        flairQueries.getFlair(req.params.id, (err, flair) => {
            if(err || flair == null){
                res.redirect(404, "/");
            } else {
                res.render("flairs/show", {flair});
            }
        });
    },
    destroy(req, res, next){
        flairQueries.deleteFlair(req.params.id, (err, deletedRecordsCount) => {
            if(err){
                res.redirect(500, `/topics/${req.params.topicId}/posts/${req.params.id}`)
            } else {
                res.redirect(303, `/topics/${req.params.topicId}`)
            }
        });
    },
    edit(req, res, next){
        flairQueries.getFlair(req.params.id, (err, flair) => {
            if(err || flair == null){
                res.redirect(404, "/");
            } else {
                res.render("flairs/edit", {flair}); 
            }
        });
    },
    update(req, res, next){
        flairQueries.updateFlair(req.params.id, req.body, (err, flair) => {
            if(err || flair == null){
                res.redirect(404, `/topics/${req.params.topicId}/flairs/${req.params.id}/edit`);
            } else {
                res.redirect(`/topics/${req.params.topicId}/flairs/${req.params.id}`);
            }
        });
    }
}