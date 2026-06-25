const mongoose = require('mongoose');

const glossaryTermSchema = new mongoose.Schema({
  id:              { type: String, unique: true },
  term:            { type: String, default: '' },
  termHindi:       { type: String, default: '' },
  definition:      { type: String, default: '' },
  definitionHindi: { type: String, default: '' },
  category:        { type: String, default: '' },
  relatedTerms:    [{ type: String }]
}, { timestamps: true, strict: false });

module.exports = mongoose.model('GlossaryTerm', glossaryTermSchema);
