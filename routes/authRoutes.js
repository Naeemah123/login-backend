import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const result = req.body.password === user.password;
            if (result) {
                let jwtSecretKey = process.env.JWT_SECRET_KEY;
                let data = {
                time: Date(),
                userId: user._id,
                email: user.email
            }

                const token = jwt.sign(data, jwtSecretKey);

                res.send(token);
            } else {
                res.status(400).json({ error: "password doesn't match" });
            }
        } else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});

export default router;