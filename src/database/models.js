"use strict";

const Fs = require('fs');
const Path = require('path');

const Log = require('src/logger.js');

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

function DocumentToObject(doc) {
	doc = doc.toObject();
	doc._id = doc._id.toString();
	return doc;
}

function CustomModel(modelOptions) {
	var self = this;
	var _name = modelOptions.name;
	var _model = modelOptions.model;

	self.create = function(object) {
		return new Promise((fulfill, reject) => {
			let doc = new _model(object);

			doc.save((err, response) => { 
                if(err) return reject("Error while saving a " + _name);

                response = DocumentToObject(response);

                Log.data("[" + _name + "] Create :", response);
                fulfill(response);
            });
		});
	};

	self.findOne = function(object, selector) {
		return new Promise((fulfill, reject) => {
			let query = _model.findOne(object);

			if(selector) query.select(selector);

			query.exec((err, response) => {
				if(err) return reject("Error while searching a " + _name);
				if(!response) return fulfill();

			  	response = DocumentToObject(response);

                Log.data("[" + _name + "] FindOne :", response);
                fulfill(response);
			})
		});
	};

	self.remove = function(selector) {
		return new Promise((fulfill, reject) => {
			_model.remove(selector, (err, response) => {
				if(err) return reject("Error while removing a " + _name);

				response = response.result;

				Log.data("[" + _name + "] Remove :", response);
				fulfill(response);
			});
		});
	};
}

module.exports = Models;