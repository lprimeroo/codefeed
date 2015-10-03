var mongoose = require('mongoose'), Schema = mongoose.Schema;;

var solutionSchema = mongoose.Schema({
	problem_id: Number,
	_statement: String,
	code: String,
	time: Number,
	username: String,
	soloutput: String,
	date_added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Solution', solutionSchema);
