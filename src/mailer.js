"use strict";

const Config = require('src/config.js');
const Log = require('src/logger.js');
const nodemailer = require('nodemailer');

if(!process.env[Config.mailer.user]) {
    Log.error("Can't find user environnement variable for mailer");
    process.exit(1);
}
if(!process.env[Config.mailer.pass]) {
    Log.error("Can't find password environnement variable for mailer");
    process.exit(1);
}

var transporter = nodemailer.createTransport({
    service: Config.mailer.service,
    auth: {
        user: process.env[Config.mailer.user],
        pass: process.env[Config.mailer.pass]
    }
});

var fromWiki = Config.mailer.from;

module.exports = function(to, subject, html) {
    return new Promise((fulfill, reject) => {
            transporter.sendMail({
            from: fromWiki,
            to: to,
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