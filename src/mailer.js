"use strict";

// Packages dependencies
const Fs = require('fs');
const Path = require('path');
const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');

// Project dependencies
const Config = require('src/config.js');
const Log = require('src/logger.js');

var Mailer = exports;

// Handlebars templates for emails
var templates = {};

// Email of the email sender
var sender = Config.mailer.from;


// Check Mailgun identifiers
if(!process.env[Config.mailer.user]) {
    Log.error("Can't find user environnement variable for mailer");
    process.exit(1);
}
if(!process.env[Config.mailer.pass]) {
    Log.error("Can't find password environnement variable for mailer");
    process.exit(1);
}

// Nodemailer transporter
var transporter = nodemailer.createTransport({
    service: Config.mailer.service,
    auth: {
        user: process.env[Config.mailer.user],
        pass: process.env[Config.mailer.pass]
    }
});

// Load email templates
Fs.readdir(Config.mailer.templates, (err, files) => {
    if(err) return Log.error("Can't find emails templates : ", err);

    files.forEach(file => {
        Fs.readFile(Path.join(Config.mailer.templates, file), 'utf8', (err, data) => {
            if(err) return Log.error(`Error while loading email teamplate ${file} : `, err);

            let template = Handlebars.compile(data);
            templates[Path.basename(file, '.html')] = template;
        });
    });
});

// Basic method to send email
Mailer.send = function(receiver, subject, html) {
    return new Promise((fulfill, reject) => {
        transporter.sendMail({
            from: sender,
            to: receiver,
            subject: subject,
            html: html
        }, function(err, info) {
            if(err) {
                reject(err);
            }
            else {
                fulfill(info);
            }
        });
    });
}

// Send a email using a loaded template
Mailer.sendTemplate = function(receiver, subject, template, context) {
    return new Promise((fulfill, reject) => {
        if(!templates[template]) return reject(`Unknown template : ${template}`);

        let html = templates[template](context);

        Mailer.send(receiver, subject, html)
            .then(fulfill)
            .catch(reject);
    });
};