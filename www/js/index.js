/* global pdf */
/* global $ */
/* global Backbone */
/* global cordova */

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var DEBUG = ((typeof cordova) === 'undefined');


function progressShow() {
    if (!_.isEmpty(window.cordova))
        spinnerplugin.show();
};

function progressHide() {
    if (!_.isEmpty(window.cordova))
        spinnerplugin.hide();
};

function success(msg) {
    $('#baseH').html('base64:' + msg);

    $.post("http://localhost:3000/save", {
            pdfData: msg
        })
        .done(function(data) {
            alert("Data Loaded: " + data);
        });

    progressHide();
};

function attachEmail(msg) {
    progressHide();
    cordova.plugins.email.open({
        subject: 'Sample converted PDF',
        body:    '<h1>Sample converted PDF attachment</h1>',
        isHtml:  true,
        attachments: 'base64:your-pdf.pdf//'+msg
    });
};


function failure(err) {
    console.error('->', err);
    console.alert('An error has ocurred: ', err);

    progressHide();
};


var HomeView = Backbone.View.extend({

    initialize: function() {
        this.$button = this.$el.find('#generate');
        this.$url = this.$el.find('#url');
        this.$urlemail = this.$el.find('#url-email');
        this.$urlShare = this.$el.find('#url-share');
        this.$raw = this.$el.find('#rawhtml');
        this.$html = this.$el.find('#html');
        this.$display = this.$el.find('#display');

        this.success = success.bind(this);
        this.failure = failure.bind(this);
        this.email = attachEmail.bind(this);
    },

    events: {
        'click #generate': 'makePDFBase64',
        'click #email': 'makePDFAndEmail',
        'click #share': 'makePDFAndShare',
        'click #share-raw': 'makeRawPDFandShare',
    },

    makePDFBase64: function(e) {
        e.preventDefault();
        progressShow();
        /* generate pdf using url. */
        pdf.htmlToPDF({
            url: this.$url.val(),
            documentSize: "A4",
            landscape: "portrait",
            type: "base64" 
        }, this.success, this.failure);
    },

    makePDFAndEmail: function(e) {
        e.preventDefault();
        progressShow();
        /* generate pdf using url. */
        pdf.htmlToPDF({
            url: this.$url.val(),
            documentSize: "A4",
            landscape: "portrait",
            type: "base64"
        }, this.email, this.failure);
    },

    makePDFAndShare: function(e) {
        e.preventDefault();
        progressShow();
        /* generate pdf using url. */
        pdf.htmlToPDF({
            url: this.$urlShare.val(),
            documentSize: "A4",
            landscape: "portrait",
            type: "share"
        }, this.success, this.failure);


    },

    makeRawPDFandShare: function(e) {
        e.preventDefault();

        progressShow();
        /* generate pdf using url. */
        pdf.htmlToPDF({
            data: this.$raw.val(),
            documentSize: "A4",
            landscape: "portrait",
            type: "share"
        }, function(pdf) {
            $('#rawH').html(pdf);
            progressHide();

        }, this.failure);

    }
});

var DemoRouter = Backbone.Router.extend({
    routes: {
        '*path': 'index',
    },

    index: function() {
        new HomeView({
            el: $('.starter-template')
        });
    }
});


if (DEBUG) {
    console.log('start app..');

    new DemoRouter();
    Backbone.history.start();
} else {
    document.addEventListener('deviceready', function() {

        console.log('start app..');

        new DemoRouter();
        Backbone.history.start();
    }, false);

}
