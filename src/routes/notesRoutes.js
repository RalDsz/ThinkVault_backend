import express from 'express';
import { 
  createNote, 
  deleteNote, 
  getAllNotes, 
  updateNote, 
  getNoteById,
  reorderNotes
} from '../controllers/notesControllers.js';

const router = express.Router();

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/reorder', reorderNotes);  // Changed to PUT here
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
