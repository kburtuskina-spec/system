const db = require('../db');

async function requireAuth(req, res, next) {

    try {

        if (!req.session || !req.session.user) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }

        req.user = req.session.user;

        next();

    } catch (err) {

        const handleDbError = require('../utils/handleDbError');

        return handleDbError(res, err);

    }

}

function requireOwnerOrAdmin(getResourceOwnerId) {

    return async function (req, res, next) {

        try {

            if (!req.user)
                return res.status(401).json({
                    error: 'Unauthorized'
                });

            if (req.user.role === 'Администратор системы')
                return next();

            const ownerId = await getResourceOwnerId(req);

            if (ownerId == req.user.id)
                return next();

            return res.status(403).json({
                error: 'Forbidden'
            });

        }

        catch (err) {

            console.error(err);

            const handleDbError = require('../utils/handleDbError');

            return handleDbError(res, err);

        }

    };

}

module.exports = {
    requireAuth,
    requireOwnerOrAdmin
};