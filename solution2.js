const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/mongo-exercise")
  .then(() => console.log("Connected to mongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err))


const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  isPublished: Boolean,
  tags: [String],
  price: Number,
  __v: Number,
  date: { type: Date, date: Date.now }
})

const Course = mongoose.model("Course", courseSchema)

async function getCourses() {
  const courses = await Course
    .find({ isPublished: true, tags: { $in: ["backend", "frontend"] } })
    .and({ price: { $gte: 15 }, })
    .sort({ price: -1 })
    .select({ name: 1, author: 1 })
  console.log(courses)
}
getCourses()