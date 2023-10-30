const express = require('express')
const router = express.Router()
const { Human } = require('../models')

/*.json and .urlencoded for POST and PUT requests, not for GET or DELETE */
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

/* Get the data about the users */
router.get('/', async (req, res) => {
    try {
        const listOfUsers = await Human.findAll()
        res.json(listOfUsers)
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
})

router.post('/create', async (req, res) => {
    const { username, password, email, gender, birthday, firstname, lastname, confirmPassword, userId } = req.body;
    try {
        const emailExists = await Human.findOne({ where: { email: req.body.email }});
        if (emailExists) {
            return res.status(400).json ({ error: "Email already exists" })
        }
        const usernameExists = await Human.findOne({ where: { username: req.body.username }});
        if (usernameExists) {
            return res.status(400).json ({ error: "Username already exists" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" })
        }
        const user = await Human.create({
            username: username,
            email: email,
            first_name: firstname,
            last_name: lastname,
            birthday: birthday,
            gender: gender,
            password: password,
            confirmPassword: confirmPassword,
            userId: userId
        });
    
        res.status(200).json({ userId: user.id, message: 'User created successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
    }
})

module.exports = router