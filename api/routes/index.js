const routes = require('express').Router();
var Sprint = require('../models/sprint');
var WorkPackage = require('../models/workpackage');
var Project = require('../models/project');
var Risk = require('../models/risk');
var RiskMatrix = require('../models/riskMatrix');
//Project API

routes.post('/saveProject', (req, res) => {

  var project = new Project ({
    name: req.body.project.name,
    id: req.body.project.name + '_ID',
    cantSprints: req.body.project.cantSprints
  });
  project.save(function(err) {
    if (err) throw err;
    res.status(200).json(project);

  });

  var matrix = new RiskMatrix({
    id: req.body.project.name + '_Matrix',
    idProject: req.body.project.name + '_ID'
  })
  matrix.save(function(err) {
    if (err) throw err;
      console.log('RiskMatrixCreated');
  });
});


routes.get('/getAllProjects', (req ,res)=>{
   Project.find(function(err, projects) {
            if (err)
                res.send(err);
            res.json(projects);
        });
});
routes.post('/getProject', (req,res)=>{

  Project.findOne({'id':req.body.id}, function(err, project){
    if (err)
        res.send(err);
    res.json(project);
  });
});


//SPRINTS API
routes.post('/saveSprints', (req, res) => {
var sprints = [];

for (var sprint of req.body) {
  var sprint = new Sprint ({
    name: sprint.name,
    idProject: sprint.idProject,
    id:(sprint.idProject).substring(0,sprint.idProject.length-3) + '_' + (sprint.id) +"_ID"
  });
  sprints.push(sprint);
  sprint.save(function(err) {
    if (err) throw err;
  });
}
res.status(200).json(sprints);
});

routes.post('/getProjectSprints', (req ,res)=>{

  var query = Sprint.find({});
  query.where('idProject', req.body.id)

  query.exec(function (err, sprints) {
    if (err)
        res.send(err);

    res.json(sprints);
  });

});

//WorkPackage API
routes.post('/saveWorkPackage', (req, res) => {
  //Metodo que salva y edita el WorkPackage

 if(req.body.id == undefined){
    var workpackage = new WorkPackage ({
    id: req.body.idSprint.substring(0,req.body.idSprint.length-3)+'_'+req.body.name+"_ID",
    idSprint: req.body.idSprint,
    name: req.body.name,
    description: req.body.description,
    hours: req.body.hours,
    hourCost: req.body.hourCost,
    extraCost: req.body.extraCost,
    actualHours:"",
    actualHourCost: "",
    actualExtraCost: ""
  })
  workpackage.save(function(err) {
    if (err) throw err;
    console.log('WorkPackage saved successfully');
    res.status(200).json(workpackage);
  });
}else{

    WorkPackage.findOne({'id':req.body.id},function(err,workpackage){
      workpackage.name= req.body.name;
      workpackage.description= req.body.description;
      workpackage.hours= req.body.hours;
      workpackage.hourCost= req.body.hourCost;
      workpackage.extraCost= req.body.extraCost;
      workpackage.actualHours=req.body.actualHours;
      workpackage.actualHourCost= req.body.actualHourCost;
      workpackage.actualExtraCost= req.body.actualExtraCost;
      workpackage.save();
      res.status(200).json(workpackage);
    });
  }
});

routes.get('/getAllWorkPackages', (req ,res)=>{
   WorkPackage.find(function(err, workPackages) {
            if (err)
                res.send(err);
            res.json(workPackages);
        });
});

routes.post('/getSprintWorkPackages', (req ,res)=>{

  var query = WorkPackage.find({});
  query.where('idSprint', req.body.id)
  query.sort('name');
  query.exec(function (err, workPackages) {
    if (err)
        res.send(err);
    res.json(workPackages);

  });
});

//RiskMatrix API
routes.post('/getProjectMatrix', (req ,res)=>{
  console.log(req.body)
  var query = RiskMatrix.find({});
  query.where('idProject', req.body.idProject)
  query.exec(function (err, riskMatrix) {
    if (err)
        res.send(err);
    res.json(riskMatrix);
  });
});

routes.post('/getMatrixRisks', (req ,res)=>{
  console.log(req.body);
  var query = Risk.find({});
  query.where('idMatrix', req.body.idMatrix)
  query.exec(function (err, risks) {
    if (err)
        res.send(err);
    res.json(risks);
  });
});

routes.post('/saveRisk', (req, res) => {
  console.log(req.body)
  var risk = new Risk ({
    descripcion: req.body.descripcion,
    probabilidad: req.body.probabilidad,
    impacto: req.body.impacto,
    valor: req.body.valor,
    idMatrix: req.body.idMatrix
  })
  risk.save(function(err) {
    if (err) throw err;
    console.log('WorkPackage saved successfully');
    res.status(200).json(risk);

  });
});

module.exports = routes;
