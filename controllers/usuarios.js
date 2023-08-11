const { response, request } = require('express');

const findAll = (req = request, res = response) => {
    res.json({
        msg:"get API"
    })
};

module.exports = {
    findAll
}