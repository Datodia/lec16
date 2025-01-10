const { default: mongoose } = require("mongoose")


module.exports = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@web10.e6vlh.mongodb.net/?retryWrites=true&w=majority&appName=web10')
        console.log('connected successfully')
    } catch (error) {
        console.log(error, 'cannot connected db')
    }
}
