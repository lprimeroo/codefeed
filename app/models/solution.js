var mongoose = require('mongoose');

var solutionSchema = mongoose.Schema({
	problem_id: String,
	code: String,
	time: Number,
	user_name: String
	//date: Date
});

module.exports = mongoose.model('Solution', solutionSchema);
