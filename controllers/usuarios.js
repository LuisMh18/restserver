const { response } = require('express');

const findAll = (req, res = response) => {
    res.json({
        msg:"get API"
    })
};

module.exports = {
    findAll
}