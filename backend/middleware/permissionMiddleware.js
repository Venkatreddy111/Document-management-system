exports.canView = (req, res, next) => {
    const doc = req.document;

    if (!doc.permissions.view.includes(req.user.role)) {
        return res.status(403).json({ message: 'View access denied' });
    }
    next();
};

exports.canEdit = (req, res, next) => {
    const doc = req.document;

    if (!doc.permissions.edit.includes(req.user.role)) {
        return res.status(403).json({ message: 'Edit access denied' });
    }
    next();
};
