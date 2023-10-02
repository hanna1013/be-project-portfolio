const {selectTopics} = require('../models/topicsModels')


exports.getTopics = (req, res, next) => {
    return selectTopics().then((topics) => {
    res.status(200).send( {topics} );
    })
    
};