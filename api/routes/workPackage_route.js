const routes = require('express').Router();
var WorkPackage = require('../models/workpackage');

routes.get('/saveWorkPackage', (req, res) => {
    console.log(req);
    res.status(200).json({ message: 'WorkPackage created!' });
  });
routes.get('/getAllWorkPackages', (req ,res)=>{
   Week.find(function(err, workPackages) {
            if (err)
                res.send(err);
            res.json(workPackages);
        });
});
module.exports = routes;