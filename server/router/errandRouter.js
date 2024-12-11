import express from 'express';
import * as errandController from '../controller/errandController.js';

const router = express.Router();

router.post('/create', errandController.creErrand);

export default router;