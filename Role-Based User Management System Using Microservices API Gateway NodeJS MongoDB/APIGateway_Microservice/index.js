const express = require('express');
const app = express();

// USE PROXY SERVER TO REDIRECT THE INCOMING REQUEST
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRETE = process.env.JWT_SECRETE || "347186591486#^%%ABCF*##GHE";

// Handle proxy errors to prevent gateway crash
proxy.on('error', (err, req, res) => {
    console.error('Proxy Error:', err.message);
    if (!res.headersSent) {
        res.status(502).json({ message: "Bad Gateway: Target service unreachable", error: err.message });
    }
});

function authToken(req, res, next) {
    console.log(req.headers.authorization);
    const header = req?.headers.authorization;
    const token = header && header.split(' ')[1];

    if (token == null) return res.status(401).json({ message: "Please send token" });

    jwt.verify(token, JWT_SECRETE, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token", error: err.message });
        req.user = user;
        next();
    });
}

function authRole(role) {
    return (req, res, next) => {
        if (req.user?.role && req.user.role !== role) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        next();
    };
}

// REDIRECT TO THE REGISTRATION MICROSERVICE (Port 5001)
app.use('/reg', (req, res) => {
    const regTarget = process.env.REG_SERVICE_URL || 'http://api-gateway-service:5001/reg';
    proxy.web(req, res, { target: regTarget });
});

// REDIRECT TO THE LOGIN (Authentication) MICROSERVICE (Port 5002)
app.use('/login', (req, res) => {
    const authTarget = process.env.AUTH_SERVICE_URL || 'http://micro-services-service:5002/login';
    proxy.web(req, res, { target: authTarget });
});

app.listen(4000, () => {
    console.log("API Gateway Service is running on PORT NO : 4000");
});
