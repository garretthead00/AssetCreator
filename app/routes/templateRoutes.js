var models = require('../models/');

module.exports = function (router) {

    router.get('/getTemplates', function (req, res) {
        models.Template.findAll({
            attributes: ['id', 'name', 'description'],
            where: {}
        }).then(function (result) {
            if (!result) {
                res.json({ success: false, message: 'No templates exist in the db.' });
            } else {
                res.json({ success: true, message: 'Found templates in db!', templates: result });
            }
        }).catch(function (err) {
            throw err;
            console.log("Error /getTemplates: " + err);
        });
    });

    router.get('/getTemplateWith/:id', function (req, res) {
        models.Template.findOne({
            where: { id: req.params.id },
            include: [
                { model: models.Attribute }, //load all attributes
                { model: models.Procedure },
                {model: models.Analysis }
            ]
        }).then(function (result) {
            if (!result) {
                res.json({ success: false, message: "No template with id found in db"});
            } else {
                res.json({ success: true, message: "Found template with id", template: result });
            }
        }).catch(function (err) {
            throw err;
            console.log('Error getting the template with id');
        });
    });

    // removes template with id
    router.delete('/removeTemplateWith/:id', function (req, res) {
        models.Template.destroy({
            where: { id: req.params.id }
        }).then(function (result) {
            res.json({ success: true, message: 'Template removed successfully' });
        }).catch(function (err) {
            res.json({ success: false, message: 'Template was not removed from db.' });
        });
    });

 
    // router method to create a new template.
    router.post('/newTemplate', function (req, res) {
        models.Analysis.findOrCreate({
                where: { name: req.body.analysis.name },
                defaults: {
                    name: req.body.analysis.name,
                    expression: req.body.analysis.expression,
                    outputAttribute: req.body.analysis.outputAttribute,
                    eventTrigger: req.body.analysis.scheduling.eventTrigger.expression,
                    periodicStartAt: req.body.analysis.scheduling.periodic.startAt.expression,
                    periodicRepeatOn: req.body.analysis.scheduling.periodic.repeatOn.expression
                }
            })
            .spread((analysis,created) => {
                models.Template.create({
                    name: req.body.name,
                    description: req.body.description,
                    derivedTemplate: req.body.derivedTemplate.id,
                    analysisId: analysis.id,
                    stage: "draft"
                })
                .then(function (result) {

                    // if the template has attributes
                    if (req.body.attributes.length > 0) {
                        for (var i = 0; i < req.body.attributes.length; i++) {
                            models.Attribute.findOrCreate({
                                where: { name: req.body.attributes[i].name },
                                defaults: {
                                    name: req.body.attributes[i].name
                                }
                            })
                            .spread((attribute, created) => {
                                attribute.addTemplate(result.id);
                            });
                        }
                    }
                    // check if has procedures
                    if (req.body.procedures.length > 0) {
                        for (var i = 0; i < req.body.procedures.length; i++) {
                            models.Procedure.findOrCreate({
                                where: { name: req.body.procedures[i].name },
                                defaults: {
                                    name: req.body.procedures[i].name,
                                    description: req.body.procedures[i].description
                                }
                            })
                            .spread((procedure, created) => {
                                procedure.addTemplate(result.id);
                            });
                        }
                    }
                    res.json({ success: true, message: "Template created successfully!" });
                })
                .catch(function (err) {
                    res.json({ success: false, message: "Template created unsuccessful..." });
                });
            });
    });

    return router;
};