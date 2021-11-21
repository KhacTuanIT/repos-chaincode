const account = (req, res, next) => {
    res.render('client/account', { layout: 'client-layout', page_name: 'account' });
}

const register = (req, res, next) => {
    
}

module.exports = {
    account
}