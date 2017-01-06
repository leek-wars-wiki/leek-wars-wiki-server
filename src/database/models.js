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
			object.updatedAt = new Date();
			object.createdAt = new Date();
			let doc = new _model(object);

			doc.save()
				.then(response => {
					response = DocumentToObject(response);
					Log.data("[" + _name + "] Create :", response);
					fulfill(response);
				})
				.catch(err => {
					reject("Error while saving a " + _name);
				});
		});
	};

	self.findOne = function(object, selector) {
		return new Promise((fulfill, reject) => {
			let query = _model.findOne(object);

			if(selector) query.select(selector);

			query.exec()
				.then(response => {
					if(!response) return fulfill();

				  	response = DocumentToObject(response);

	                Log.data("[" + _name + "] FindOne :", response);
	                fulfill(response);
				})
				.catch(err => {
					reject("Error while searching a " + _name);
				});
		});
	};

	self.update = function(query, update) {
		return new Promise((fulfill, reject) => {
			_model.update(query, update)
				.then(response => {
					if(!response) return fulfill();

				  	response = DocumentToObject(response);
					
					Log.data("[" + _name + "] Update :", response);
	                fulfill(response);
				})
				.catch(err => {
					reject("Error while updating a " + _name);
				});
		});
	};

	self.remove = function(selector) {
		return new Promise((fulfill, reject) => {
			_model.remove(selector)
				.then(response => {
					response = response.result;

					Log.data("[" + _name + "] Remove :", response);
					fulfill(response);
				})
				.catch(err => {
					reject("Error while removing a " + _name);
				});
		});
	};
}

module.exports = Models;