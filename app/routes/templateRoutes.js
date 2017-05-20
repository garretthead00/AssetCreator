var models = require('../models/');

module.exports = function (router) {

    router.get('/getTemplates', function (req, res) {
        console.log('/getTemplates route fired!');
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
            where: { id: req.params.id }
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
        console.log("/newTemplate route fired!");
        console.log(req.body);
        var attrs = req.body.attributes;
        models.Template.create({
            name: req.body.name,
            description: req.body.description,
            derivedTemplate: req.body.derivedTemplate,
            analysisName: req.body.analysis.name,
            analysisExpression: req.body.analysis.expression,
            analysisOutputAttribute: req.body.analysis.outputAttribute,
            schedulingEventTriggerExpression: req.body.scheduling.eventTrigger.expression,
            schedulingPeriodicStartAt: req.body.scheduling.periodic.startAt.hour + ":" + req.body.scheduling.periodic.startAt.minute + " " + req.body.scheduling.periodic.startAt.amPm,
            schedulingPeriodicRepeatOn: req.body.scheduling.periodic.repeatOn.hour + ":" + req.body.scheduling.periodic.repeatOn.minute + ""

             

        }).then(function (template) {
            var attrArray = [];

            for (var i = 0; i < attrs.length; i++) {
                // Iterate over numeric indexes from 0 to 5, as everyone expects.
                var temp = {
                    name: attrs[i],
                    TemplateId: template.id
                };
                attrArray.push(temp);
            }
            models.Attribute.bulkCreate(attrArray).then(function (attr) {
                res.json({ success: true, message: "Template created successfully!", data: template });
            }).catch(function (err) {
                res.json({ success: false, message: "attributes created unsuccessful..." });
            });
           
        }).catch(function (err) {
            // handle error;
            res.json({ success: false, message: "Template created unsuccessful..."});
        });
    });

    return router;
};