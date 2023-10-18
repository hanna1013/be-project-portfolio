const {selectUsers} = require('../models/usersModel')

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
      res.status(200).send({ users });
    });
};