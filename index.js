const mongoose = require("mongoose")

// Connect to mongoDB
mongoose.connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect to MongoDB...", err))

// Schema
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 225,
    // match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    // uppercase: true,
    trim: true
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return new Promise((resolve) => {
          setTimeout(() => {
            const result = v && v.length > 0
            resolve(result)
          }, 1000)
        })
      },
      message: "A course should have at least one tag"
    }
  },
  date: { type: Date, default: Date.now },
  isPublish: Boolean,
  price: {
    type: Number,
    required: function () { return this.isPublish },
    min: 10,
    max: 20,
    get: v => Math.round(v),
    set: v => Math.round(v)
  }
})


// Create model 
const Course = mongoose.model("Course", courseSchema)


// Creating an instance of course 
async function createCourse() {
  const course = new Course({
    name: "Angular course",
    category: "Mobile",
    author: "Assam",
    tags: ["Node", "Backend"],
    isPublish: true,
    price: 15.8
  })
  // Save object into the database 
  try {
    const result = await course.save()
    console.log(result)
  }
  catch (ex) {
    for(field in ex.errors){
      console.log(ex.errors[field].message)
    }
  }
}
// createCourse()

async function updateCourse(id) {
  // Update from database 
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      isPublish: false,
      author: "Mosh",
      price: 25,
      name: "Mongoose course",
    }
  }, { new: true })
  // Find and update
  // const course = await Course.findById(id)
  // if (!course) return;
  // course.set({
  //   isPublish: true,
  //   author: "Assam",
  //   price: 25,
  //   name: "Mongoose course",
  // })
  // course.save()
  console.log(course)
}
// updateCourse("5faeeb019de8dd19c438cb99")


async function deleteCourse(id) {
  const course = await Course.findByIdAndDelete(id)
  console.log(course)
}
// deleteCourse("5faeeb019de8dd19c438cb99")


// Query courses
async function getCourses() {
  const pageNumber = 2
  const pageSize = 10
  // or 
  // and
  // eq => equal 
  // ne => not equal 
  // gt => greater than 
  // gte => greater than or equal to
  // lt => less than 
  // lte => les than equal 
  // in 
  // nin => not in 
  const courses = await Course
    .find({ author: "Mosh", isPublish: true })
    // Starts with Mosh
    .find({ author: /^Mosh/ })
    // Ends with Hamadan
    .find({ author: /Hamadan$/i })
    // Contains Mosh 
    .find({ author: /.*Mosh.*/i })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .or([{ author: "Mosh" }, { isPublish: true }])
    .and([{ author: "Mosh" }, { isPublish: true }])
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, author: 1 })
    .count()
  console.log(courses)
}
// getCourses()



