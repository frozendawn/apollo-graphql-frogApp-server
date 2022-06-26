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
            const frog = await Frog.findById(id).populate('userId','username image role _id')
            return frog
        },
        getUsers: async () => {
            const users = await User.find({role: {$nin: ['admin','moderator']}})
            return users;
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
            if (userExist) {
                return {
                    code: 400,
                    success: false,
                    message: "Invalid credentials"
                }
            }
            const hashedPassword = await bcrypt.hash(args.password , 12);
            const id = mongoose.Types.ObjectId();
            const accessToken = jwt.sign({username: args.username, id: id, role: args.role}, 'super-secret')
            const newUser = new User({_id: id, username: args.username, password: hashedPassword, accessToken: accessToken, image: args.image, role: 'user'});
            await newUser.save();
            return {
                code: 200,
                success: true,
                message: "User registered",
                accessToken: newUser.accessToken,
                id: id,
                username: newUser.username,
                userImage: newUser.image,
                role: newUser.role,
            }
        },
        Login: async (_, args) => {
            const user = await User.findOne({username: args.username});
            if (user && await bcrypt.compare(args.password, user.password)) {
                const accessToken = jwt.sign({username: user.username, id: user._id, role: user.role}, 'super-secret')
                return {
                    code: 200,
                    success: true,
                    message: 'Successful login !',
                    id: user._id,
                    accessToken: accessToken,
                    username: user.username,
                    role: user.role,
                    userImage: user.image
                }
            }
            return {
                code: 403,
                success: false,
                message: 'Invalid Credentials'
            }
        },
        incrementFrogViews: async (_, {id}, {dataSources}) => {
            try {
                const response = await dataSources.imagesAPI.incrementFrogViews(id);
                return {
                    code: 200,
                    success: true,
                    message: "Successfuly incremented frog views.",
                    frog: response
                  }
            } catch (error) {
                console.log('error in incrementFrogViews:', error)
                return {
                    code: 500,
                    success: false,
                    message: "Failed to increment frog views."
                  }
            }
        },
        //trqbva da updatena cache-a kato iztriq jaba
        removeFrog: async (_, {id}, {role, dataSources}) => {
            if (role === 'admin') {
                const response = await dataSources.imagesAPI.removeFrogById(id);
                if (response) {
                    return {
                        code: 200,
                        success: true,
                        message: "Sucessfully removed frog.",
                        frog: response
                    }
                }
            }
            else {
                return {
                    code: 401,
                    success: false,
                    message: 'Unauthorized'
                }
            }
        },
        makeModerator: async (_ , {id}, {role}) => {
            if (role !== 'admin') return;
            const user = await User.findByIdAndUpdate(id, {role: 'moderator'}, {new: true});
            return {
                user
            }
        }
    }
}

module.exports = resolvers;