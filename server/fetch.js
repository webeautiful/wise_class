var http = require('http')
var _ = require('lodash')

function fetch(options, onSuccess, onError){
    var options = Object.assign({
        host: '103.pigai.org',
        method: 'POST',
        path: '',
        headers: {
            'Content-type': 'application/json'
        }
    }, options);
    var cbSuccess = _.isFunction(onSuccess) ? onSuccess: _.noop;
    var cbError = _.isFunction(onError) ? onError: _.noop;
    var postData = JSON.stringify(options.data || {});
    var req = http.request(options, (res) => {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            var ret;
            try{
                ret = JSON.parse(body);
                //console.log('Response:')
                //console.log(ret)
            }catch(e){
                console.log('parse' + options.path + ' error')
                return ;
            }
            cbSuccess(ret)
        });
    });
    req.on('error', (e) => {
        console.log('API:' + options.path)
        cbError(e)
    });
    req.write(postData);
    req.end();
}

module.exports = fetch
