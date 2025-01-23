import express from 'express';

import * as MoneyController from '../controller/MoneyController.js';
import { isAuth } from '../middleware/isProfile.js'


const router = express.Router();

// 잔액 조회
router.get('/', isAuth, MoneyController.account);

// 충전 요청
router.post('/charge', isAuth, MoneyController.charge);

//  출금 요청
router.post('/withdraw', isAuth, MoneyController.withdraw);

//  입금
router.post('/deposit', isAuth, MoneyController.deposit);

//  거래 완료
router.post('/transaction', isAuth, MoneyController.completeTransaction);

export default router;
