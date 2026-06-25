const mongoose = require('mongoose');

const scamStorySchema = new mongoose.Schema({
  id:            { type: String, unique: true },
  title:         { type: String, default: '' },
  titleHindi:    { type: String, default: '' },
  story:         { type: String, default: '' },
  storyHindi:    { type: String, default: '' },
  category:      { type: String, default: '' },
  victim:        { type: mongoose.Schema.Types.Mixed },
  amountLost:    { type: Number, default: 0 },
  lesson:        { type: String, default: '' },
  lessonHindi:   { type: String, default: '' },
  date:          { type: String, default: '' }
}, { timestamps: true, strict: false });

module.exports = mongoose.model('ScamStory', scamStorySchema);
