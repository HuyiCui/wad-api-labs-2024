import express from 'express';
import User from './userModel';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get(
    '/',
    asyncHandler(async (req, res) => {
        const users = await User.find();
        res.status(200).json(users);
    })
);

router.post(
    '/',
    asyncHandler(async (req, res) => {
        const { action } = req.query; // Get action type
        const { username, password } = req.body; // Get username and password from request body

        if (action === 'register') {
            // Registration logic
            if (!username) {
                return res.status(400).json({ error: 'Username is required.' });
            }
            if (!password) {
                return res.status(400).json({ error: 'Password is required.' });
            }
            if (!isValidPassword(password)) {
                return res.status(400).json({
                    error: 'Password must be at least 8 characters long and include a letter, a number, and a special character.',
                });
            }

            // Save the new user
            const newUser = new User({ username: username.toLowerCase(), password }); // Save username in lowercase
            await newUser.save();
            console.log('User registered:', newUser); // Debug log
            res.status(201).json({
                code: 201,
                msg: 'User registered successfully!',
            });
        } else {
            // Authentication logic
            // Validate input first
            if (!username) {
                return res.status(400).json({ error: 'Username is required.' });
            }
            if (!password) {
                return res.status(400).json({ error: 'Password is required.' });
            }

            // Find user by username and password
            const user = await User.findOne({ username: username.toLowerCase(), password }); // Query in lowercase
            console.log('Found user:', user); // Debug log
            if (!user) {
                return res.status(401).json({ code: 401, msg: 'Authentication failed. Invalid username or password.' });
            }

            // Authentication successful
            res.status(200).json({
                code: 200,
                msg: 'Authentication successful.',
                token: 'TEMPORARY_TOKEN', // Replace with a real JWT token
            });
        }
    })
);

// Update a user
router.put(
    '/:id',
    asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;

        if (updateData._id) delete updateData._id;

        const result = await User.updateOne({ _id: id }, updateData);

        if (result.matchedCount) {
            res.status(200).json({ code: 200, msg: 'User updated successfully.' });
        } else {
            res.status(404).json({ code: 404, msg: 'Unable to update user.' });
        }
    })
);

export default router;
