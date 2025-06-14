import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    // Sort by position to maintain drag-drop order
    const notes = await Note.find().sort({ position: 1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Error fetching note", error: error.message });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content } = req.body;

    // Get the current highest position and add 1
    const lastNote = await Note.findOne().sort({ position: -1 });
    const newPosition = lastNote ? lastNote.position + 1 : 0;

    const newNote = new Note({
      title: title,
      content: content,
      position: newPosition, // Add position field
    });

    await newNote.save();
    res.status(201).json({ note: newNote, message: "Note created successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
}

export async function updateNote(req, res) {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body; // Add status to destructured fields

    // Build update object dynamically
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (status !== undefined) updateData.status = status;

    const updatedNote = await Note.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ note: updatedNote, message: "Note updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // After deleting, reorder remaining notes to fill gaps
    const remainingNotes = await Note.find().sort({ position: 1 });
    const reorderPromises = remainingNotes.map((note, index) => {
      return Note.findByIdAndUpdate(note._id, { position: index });
    });

    await Promise.all(reorderPromises);

    res.status(200).json({ message: "Note deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
}

// Updated reorderNotes function with validation and error handling
export async function reorderNotes(req, res) {
  try {
    const { notes } = req.body;

    console.log("Received reorder request:", JSON.stringify(notes, null, 2));

    if (!notes || !Array.isArray(notes)) {
      return res.status(400).json({
        success: false,
        message: "Notes array is required",
      });
    }

    // Validate each note object
    for (const note of notes) {
      if (!note._id || note.position === undefined || !note.status) {
        return res.status(400).json({
          success: false,
          message: "Each note must have _id, position, and status",
        });
      }
    }

    const updatePromises = notes.map((note) =>
      Note.findByIdAndUpdate(
        note._id,
        { position: note.position, status: note.status },
        { new: true }
      )
    );

    const updatedNotes = await Promise.all(updatePromises);

    console.log("Notes reordered successfully");
    res.json({
      success: true,
      message: "Notes reordered successfully",
      updatedNotes,
    });
  } catch (error) {
    console.error("Error reordering notes:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
