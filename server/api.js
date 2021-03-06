var fetch = require('./fetch');
var _ = require('lodash')

var postData = {
    count: 30,
    rid: "579361",
    wordType: "v"
};
var exports = {};

exports.getImg = function(uid, onSuccess, onError){
  var cbSuccess = (response) => {
    var info = response.infos[0] || {}; 
    onSuccess(info.img || '');
  };  
  fetch({
    path: '/openclass/api/user/info/uids',
    data: uid,
    headers: {
      'Content-type': 'text/plain'
    }   
  }, cbSuccess, onError);
};

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
