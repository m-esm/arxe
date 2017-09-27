var mongoose = require('mongoose');

var timeSheetSchema = mongoose.Schema({

	personId : {type : String},
	projectId : {type : String},
	locationId : {type : String},
	report : {type : String},
    date: { type: Date },
    start: { type: String },
    end: { type: String },
    personal: {
        type: String
    }

},{
	collection : 'Timesheets',
	strict: false
});

module.exports = mongoose.model('Timesheet',timeSheetSchema);