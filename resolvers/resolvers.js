const Frog = require('../models/Frog');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Image = require('../models/Image');

const resolvers = {
    Query: {
        getFrogs: async (parent, args, context, info) => {
            const frogs = await Frog.find().populate('userId','username');
            return frogs;
        },
        getFrog: async (_, {id}) => {
            const frog = await Frog.findById(id).populate('userId', 'username')
            return frog
        }
    },

    Mutation: {
        addFrog: async (parent, args, context, info) => {
            try {
                const newFrog = new Frog({
                    name: args.name,
                    description: args.description,
                    imageUrl: args.imageUrl,
                    userId: args.userId
                })
                const frogData = await newFrog.save()
    
                return {
                    code: 200,
                    message: 'Successfuly created new frog',
                    success: true,
                    frog: {
                        id: frogData._id,
                        name: frogData.name,
                        description: frogData.description,
                        imageUrl: frogData.imageUrl,
                    }
                }
            } catch (error) {
                return {
                    code: 400,
                    message: 'Invalid request',
                    success: false,
                    frog: null
                }
            }
        },
        Register: async (_, args) => {
            const userExist = await User.findOne({username: args.username});
            console.log('args',args)
            if (userExist) {
                return {
                    code: 400,
                    success: false,
                    message: "Invalid credentials"
                }
            }
            const hashedPassword = await bcrypt.hash(args.password , 12);
            const id = mongoose.Types.ObjectId();
            const accessToken = jwt.sign({username: args.username, id: id}, 'super-secret')
            const newUser = new User({_id: id, username: args.username, password: hashedPassword, accessToken: accessToken, image: args.image});
            await newUser.save();
            return {
                code: 200,
                success: true,
                message: "User registered",
                accessToken: newUser.accessToken,
                id: id,
                username: newUser.username,
                userImage: newUser.image
            }
        },
        Login: async (_, args) => {
            const user = await User.findOne({username: args.username});
            if (user && await bcrypt.compare(args.password, user.password)) {
                return {
                    code: 200,
                    success: true,
                    message: 'Successful login !',
                    id: user._id,
                    accessToken: user.accessToken,
                    username: user.username,
                    userImage: user.image
                }
            }
            return {
                code: 403,
                success: false,
                message: 'Invalid Credentials'
            }
        },
    }
}

module.exports = resolvers;