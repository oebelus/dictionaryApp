const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Human } = require('../models')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

router.get('/', authenticate, async (req, res) => {
    try {
        const listOfUsers = await Human.findAll();
        res.json(listOfUsers);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        const user = await Human.findOne({where: {username: username}})
        console.log(user)
        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' })
        }
        const userId = user.id;
        const userfound = await Human.findOne({where: {username: username, password: password}})
        if (userfound) {
            const authToken = crypto.randomBytes(32).toString('hex');
            //const secretKey = crypto.randomBytes(32).toString('hex');

            const token = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET/*, {
                expiresIn: '7d',
            }**/)

            res.cookie("authToken", authToken, {
                path: `/${userId}`,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            })
            return res.status(200).json({userId, authToken, token, message: 'Login successful' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
})

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN 
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) // token yes but not valid
        req.user = user
        next() 
    })
}

module.exports = router;