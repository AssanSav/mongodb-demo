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

const courses = [
  { tags: ["express", "backend"], name: "Express.js Course", author: "Mosh", isPublished: true, price: 10, __v: 0 },
  { tags: ["node", "backend"], name: "Node.js Course", author: "Mosh", isPublished: true, price: 20, __v: 0 },
  { tags: ["aspens", "backend"], name: "ASP.NET MVC Course", author: "Mosh", isPublished: true, price: 15, __v: 0 },
  { tags: ["react", "frontend"], name: "React Course", author: "Mosh", isPublished: false, __v: 0 },
  { tags: ["node", "backend"], name: "Node.js Course by Jack", author: "Jack", isPublished: true, price: 12, __v: 0 },
  { tags: ["node", "backend"], name: "Node.js Course by Mary", author: "Mary", isPublished: false, price: 12, __v: 0 },
  { tags: ["angular", "frontend"], name: "Angular Course", author: "Mosh", isPublished: true, price: 15, __v: 0 }
]


async function createCourses() {
  try {
    await courses.map(c => {
      const course = new Course(c)
      return course.save()
    })

  }
  catch (err) {
    console.log(err)
  }
}

async function getCourses() {
  const courses = await Course
    .find({ isPublished: true, tags: "backend" })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 })

  console.log(courses)
}
getCourses()
