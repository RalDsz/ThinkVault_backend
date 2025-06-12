import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({createdAt:-1}); //-1 will render all in desc order newest first// Assuming Note is your Mongoose model
        res.status(200).json(notes);
        
    } catch (error) {   
        res.status(500).json({ message: 'Error fetching notes', error: error.message });
        
    }
} 
export async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message:"Note not found"})
        res.json(note) // Assuming you're passing the note ID in the URL
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching note', error: error.message });
        
    }  
}
export async function createNote(req, res) {
    try {
        const { title, content } = req.body; // Assuming you're sending title and content in the request body
        const newNote = new Note({ title:title, content:content });
        await newNote.save();
        res.status(201).json({ note: newNote, message: 'Note created successfully!' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error creating note', error: error.message });
        
    }
    
}
export async function updateNote(req, res) {
    try {
        const { id } = req.params; // Assuming you're passing the note ID in the URL
        const { title, content } = req.body; // Assuming you're sending updated title and content in the request body
        const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
        
        if (!updatedNote) {
            return res.status(500).json({ message: 'Note not found' });
        }
        
        res.status(200).json({ note: updatedNote, message: 'Note updated successfully!' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error: error.message });
        
    }
    
}
export async function deleteNote(req, res) {
     
    try {
        const { id } = req.params; // Assuming you're passing the note ID in the URL
        const deletedNote = await Note.findByIdAndDelete(id);
        
        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }
        
        res.status(200).json({ message: 'Note deleted successfully!' });
        
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note', error: error.message });
        
    }
}