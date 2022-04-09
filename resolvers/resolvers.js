const Frog = require('../models/Frog');


const resolvers = {
    Query: {
        getFrogs: async (parent, args, context, info) => {
            const frogs = await Frog.find();
            return frogs;
        },
        getFrog: async (_, {id}) => {
            const frog = await Frog.findById(id);
            return frog
        }
    },

    Mutation: {
        addFrog: async (parent, args, context, info) => {
            const newFrog = new Frog({
                name: args.name,
                description: args.description,
                imageUrl: args.imageUrl
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
        }
    }
}

module.exports = resolvers;