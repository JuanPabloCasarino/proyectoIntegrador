const gitHubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/')
}

const current = (req, res) => {
    res.status(200).send(req.user);
}

export { gitHubCallback, current}