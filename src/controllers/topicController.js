
const topicQueries = require("../db/queries.topics.js");

const Authorizer = require("../policies/topic");

module.exports = {
    index(req, res, next){
        
        topicQueries.getAllTopics((error, topics) => {

            if(error){
                res.redirect(500, "static/index");
            } else {
                res.render("topics/index", {topics});
            }
        })
    },
    new(req, res, next){

        const authorized = new Authorizer(req.user).new();

        if(authorized){
            res.render("topics/new");
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/topics");
        }
        
    },
    create(req, res, next){

        const authorized = new Authorizer(req.user).create();

        if(authorized){
            let newTopic = {
                title: req.body.title,
                description: req.body.description
            };
            topicQueries.addTopic(newTopic, (error, topic) => {
                if(error){
                    res.redirect(500, "/topics/new");
                } else {
                    res.redirect(303, `/topics/${topic.id}`);
                };
            });
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect("/topics");
        }
    },
    show(req, res, next){

        topicQueries.getTopic(req.params.id, (error, topic) => {

            if(error || topic == null){
                res.redirect(404, "/");
            } else {
                res.render("topics/show", {topic});
            }
        });
    },
    destroy(req, res, next){
        topicQueries.deleteTopic(req, (error, topic) => {
            if(error){
                res.redirect(error, `/topics/${req.params.id}`)
            } else {
                res.redirect(303, "/topics")
            }
        });
    },
    edit(req, res, next){
        topicQueries.getTopic(req.params.id, (error, topic) => {
            if(error || topic == null){
                res.redirect(404, "/");
            } else {

                const authorized = new Authorizer(req.user, topic).edit();

                if(authorized){
                    res.render("topics/edit", {topic});
                } else {
                    req.flash("You are not authorized to do that.")
                    res.redirect(`/topics/${req.params.id}`)
                }
            }
        });
    },
    update(req, res, next){
        topicQueries.updateTopic(req, req.body, (error, topic) => {

            if(error || topic == null){
                res.redirect(401, `/topics/${req.params.id}/edit`);
            } else {
                res.redirect(`/topics/${req.params.id}`);
            }
        });
    }
}