import express from 'express';
import { generateImage, getUserHistory, getAllHistory, deleteImage, storeRandomImages } from '../controllers/imageController.js';
import { protect, admin } from '../middleware/auth.js';
const router = express.Router();

router.post('/generate', protect, generateImage);
router.post('/store-random', protect, storeRandomImages);
router.get('/history', protect, getUserHistory);
router.delete('/:id', protect, deleteImage);
router.get('/admin/history', protect, admin, getAllHistory);

export default router;
