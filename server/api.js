var fetch = require('./fetch');
var _ = require('underscore')

var postData = {
    count: 30,
    rid: "579361",
    wordType: "v"
};
var exports = {};

exports.getSubjects = function(options, onSuccess, onError){
    var cbSuccess = (response) => {
        onSuccess(_.sortBy(response.infos || [],(item) =>
            -item.timeStamp))
    };
    var postData = Object.assign({
        rid: "",
    }, options);
    fetch({
        path: '/openclass/api/subject/fetch_all',
        data: postData
    }, cbSuccess, onError)
};

module.exports = exports;
