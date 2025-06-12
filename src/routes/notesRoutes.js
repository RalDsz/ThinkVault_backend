import express from 'express';
import { 
  createNote, 
  deleteNote, 
  getAllNotes, 
  updateNote, 
  getNoteById,
  reorderNotes // Add this import
} from '../controllers/notesControllers.js';

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.post('/reorder', reorderNotes); // Add this route
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;