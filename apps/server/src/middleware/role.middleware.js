export function requireRole(roles) {

    return function(req, res, next) {

        if ( !roles.includes(req.userRole) ) {
            
            return res.status(401).json({message: 'Unauthorized Access.'});
        }

        next();
    }
}