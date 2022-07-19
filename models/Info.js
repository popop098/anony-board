import mongoose from 'mongoose'

const InfoSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    posts: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    dislikes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }

})

export default mongoose.models.Info || mongoose.model('Info', InfoSchema)
