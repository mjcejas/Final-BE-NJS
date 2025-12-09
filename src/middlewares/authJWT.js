import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403).json({ message: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } else {
       return res.sendStatus(401).json({ message: 'Authorization header missing' });
    }   
};

export const checkadminRole = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.sendStatus(403).json({ message: 'Admin role required' });
    }
};

export const checkUserRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            return res.sendStatus(403).json({ message: 'Insufficient role' });
        }
    };
};