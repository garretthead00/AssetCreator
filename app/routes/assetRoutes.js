var models = require('../models/');

module.exports = function (router) {


	router.get('/getAssets', function (req, res) {
		models.Asset.findAll({
			attributes: ['id', 'name', 'description'],
			where: {}
		}).then((result) => {
			if (!result) {
				res.json({ success: false, message: "No assets returned from db." });
			} else {
				res.json({ success: true, message: "Assets found in db!", assets: result });
			}
			}).catch((err) => {
				console.log("Error /getAssets: " + err);
				throw err;
				
			});
	});

	router.get('/getAssetWith/:id', (req, res) => {
		models.Asset.findOne({
			where: { id: req.params.id },
			include: [
				{ model: models.Attribute }, //load all attributes
				{ model: models.Notification },
				{ model: models.Analysis }
			]
		}).then(function (result) {
			if (!result) {
				console.log("No asset with id found in db");
				res.json({ success: false, message: "No asset with id found in db" });
			} else {
				console.log("Found asset with id");
				res.json({ success: true, message: "Found asset with id", asset: result });
			}
		}).catch(function (err) {
			throw err;
			console.log('Error getting the asset with id');
		});
	});

	// router method to create a new template.
	router.post('/newAsset', function (req, res) {
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
			.spread((analysis, created) => {
				models.Asset.create({
					name: req.body.name,
					description: req.body.description,
					derivedTemplate: req.body.derivedTemplate.id,
					analysisId: analysis.id,
					stage: "draft"
				})
					.then(function (result) {

						// if the asset has attributes
						if (req.body.attributes.length > 0) {
							for (var i = 0; i < req.body.attributes.length; i++) {
								models.Attribute.findOrCreate({
									where: { name: req.body.attributes[i].name },
									defaults: {
										name: req.body.attributes[i].name
									}
								})
									.spread((attribute, created) => {
										attribute.addAsset(result.id);
									});
							}
						}
						// Notifications
						
						res.json({ success: true, message: "Asset created successfully!" });
					})
					.catch(function (err) {
						res.json({ success: false, message: "Asset created unsuccessful..." });
					});
			});
	});

    return router; 

};