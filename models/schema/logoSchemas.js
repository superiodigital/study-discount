import mongoose from 'mongoose'

const logoSchema = new mongoose.Schema({
    headerLogo: {
        type: String
    },
    favicon: {
        type: String
    }
})

const Logos = mongoose.model('Logos', logoSchema)

export default Logos