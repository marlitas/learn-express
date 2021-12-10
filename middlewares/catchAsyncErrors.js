// Creates global async error catcher. 
module.exports = func => (req, res, next) =>
    Promise.resolve(func(req, res, next))
           .catch(next);