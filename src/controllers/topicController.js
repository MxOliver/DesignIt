
const topicQueries = require("../db/queries.topics.js");

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
        res.render("topics/new");
    },
    create(req, res, next){
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
        topicQueries.deleteTopic(req.params.id, (error, topic) => {
            if(error){
                res.redirect(500, `/topics/${topic.id}`)
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
                res.render("topics/edit", {topic});
            }
        });
    },
    update(req, res, next){
        topicQueries.updateTopic(req.params.id, req.body, (error, topic) => {

            if(error || topic == null){
                res.redirect(404, `/topics/${req.params.id}/edit`);
            } else {
                res.redirect(`/topics/${topic.id}`);
            }
        });
    }
}