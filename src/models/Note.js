import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    default: 0, // Add this field for drag-and-drop ordering
  },
  status: {
    type: String,
    enum: ['pending', 'current', 'completed'],
    default: 'pending', // New notes start as pending
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

const Note = mongoose.model("Note", noteSchema);
export default Note;