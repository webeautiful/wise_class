var API = require('../api');

API.getSubjects({
    rid: 579361,
}, (response) => {
    console.log(response)
});