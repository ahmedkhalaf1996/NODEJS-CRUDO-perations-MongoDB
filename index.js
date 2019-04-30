const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground',{ useNewUrlParser: true })
  .then(()=> console.log('connected to MongoDB...'))
  .catch(err => console.log('could not connect to mogodb', errs));


const courseSchema = new mongoose.Schema({
	name: {
	 type: String, 
	 required:true,
     minlength:5,
     maxlength:255,
	},
	category:{
	 type: String,
	 required:true,
	 enum: ['web', 'mobile', 'netwerk']  // enum meaning ur path must be one of this three options
	},
	author: String,
	//tags: [String],
	tags: {
	 type: Array,
	   validate: {
	    isAsync: true,
	 	validator: function(value, callback){
	 		setTimeout(()=>{
             // do some async work
             const result = value && value.length > 0;
             callback(result);
	 		}, 3000);
	 		//return value && value.length > 0; 
	 	},
	 	message: 'A course should have at least one tage.'
	 }
	},
	date: { type: Date, default: Date.now },
	isPublished: Boolean,
	price: {
		type: Number,
		required: function(){ return this.isPublished; }
	}
});

const Course = mongoose.model('Course', courseSchema);

async function createCourse(){

const course = new Course({
	name: 'Angular.js',
	author: 'Ahmed',
	category: 'web',
	tags: ['Angular', 'frontend'],
	isPublished: true,
	price: 10
});

try{
  const result = await course.save();
  console.log(result);	
}
catch(ex){
   //console.log(ex.message);
   for(field in ex.errors)
   	console.log(ex.errors[field].message);
}

}

async function getCourses(){
    // eq (equal)
    // ne (not equal)
    // gy (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)
    // ...................logical opretor
    // or 
    // and
    const pageNumber = 2;
    const pageSize = 10;

	const courses = await  Course
	 // .find({ author: 'Ahmed', isPublished: true })
	 // .find({ price: { $gte: 10, $lte: 20 } })
	 // .find({ price: { $in: [10,15,20] } })
	 // .find()
	 // .or([ {author: 'Ahmed'}, { isPublished: true } ])
	 // Starts with Ahm
	 //  .find({author: /^Ahm/})
	 // // Ends with ed
	 //  .find({ author: /ed$/i })
	 // // Contains hme
	 //  .find({ author: /.*hme.*/i })
	  .find({ author: 'Ahmed', isPublished: true })
      // .skip((pageNumber - 1) * pageSize ) used this to pagination
      // .limit(pageSize) with this also 
	  .limit(10)
	  .sort({name: 1})
	  .select({ name: 1, tags: 1 });
	// .count() we can replace select with count to get the number of the resault
	console.log(courses);
}

async function updateCourse(id){
	// approach: query first
	// findById()
	// Modify its properties
	// save()
    // ...........

    // const course = await Course.findById(id);
    // if(!course) return;
    
    // course.isPublished = true;
    // course.author = 'Anothor Author';

    // const result = await course.save();
    // console.log(result);

    //...............
	// Approach: Update first
	// Update directly
	// Optionally: get The updated document
	//..............

    const course = await Course.findByIdAndUpdate(id, {
    	$set: {
    		author: 'Ahmed dx',
    		isPublished: false
    	}
    }, { new: true});
    console.log(course);
	//..............
}

async function removeCourse(id){
/// const result = await Course.deleteMany({isPublished: false});
   const course = await Course.findByIdAndRemove(id);
   console.log(course);
}


//removeCourse('5c995f0178a0fe2af05ebf2d');
//updateCourse('5c995f0178a0fe2af05ebf2d');
//getCourses();
createCourse();
