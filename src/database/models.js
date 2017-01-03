"use strict";

const Fs = require('fs');
const Path = require('path');

const MODELS_PATH = 'src/database/models';

var Models = {};

Fs.readdirSync(MODELS_PATH)
	.filter(entry => {
		return Fs.statSync(Path.join(MODELS_PATH, entry)).isFile();
	})
	.forEach(file => {
		addCustomModel(require('./models/' + file));
	});

function addCustomModel(modelOptions) {
	Models[modelOptions.name] = new CustomModel(modelOptions);
}

function CustomModel(modelOptions) {
	var self = this;
	var _name = modelOptions.name;
	var _model = modelOptions.model;

	self.save = function(object) {
		return new Promise((fulfill, reject) => {
			let doc = new _model(object);

			doc.save((err, result) => { 
                if(err) return reject("Error while saving a " + _name);

                result = result.toObject();
                result._id = result._id.toString();

                fulfill(result);
            });
		});
	};

	self.findOne = function(object, selector) {
		return new Promise((fulfill, reject) => {
			let query = _model.findOne(object);

			if(selector) query.select(selector);

			query.exec((err, result) => {
				if(err) return reject("Error while searching a " + _name);
				if(!result) return fulfill();

			  	result = result.toObject();
                result._id = result._id.toString();

                fulfill(result);
			})
		});
	};
}

module.exports = Models;