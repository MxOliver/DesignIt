 const express = require("express");
 const router = express.Router();

 const advertisementController = require("../controllers/advertisementController");

 router.get("/advertisements", advertisementController.index);

 router.get("/advertisements/new", advertisementController.new);
 router.post("/advertisements/create", advertisementController.create);

 router.get("/advertisements/:id", advertisementController.show);

 router.post("/advertisements/:id/destroy", advertisementController.destroy);
 
 router.get("/advertisements/:id/edit", advertisementController.edit);
 router.post("/advertisements/:id/update", advertisementController.update);

 module.exports = router;