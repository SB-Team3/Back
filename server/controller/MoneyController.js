import mongoose from 'mongoose';
import User from '../schema/UserSchema.js';

// **잔액 조회**
export async function account(req, res) {
    const userId = req.mongo_id; // 로그인한 사용자 ID
    try {
        const user = await User.findById( userId );
    
        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        res.status(200).json({ success: true, transactions: user.transactions,account: user.account });
    } catch (error) {
        console.error('거래 내역 조회 오류:', error);
        res.status(500).json({ success: false, message: '거래 내역 조회 중 오류가 발생했습니다.' });
    }
}

  // **충전 요청**
export async function charge(req, res) {
    const userId = req.mongo_id; // 로그인한 사용자 ID
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).json({ success: false, message: '충전 금액이 유효하지 않습니다.' });
    }

    try {
        const user = await User.findOneAndUpdate(
             userId ,
            { $inc: { account: amount } }, // 잔액 증가
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        // 거래 기록 추가
        user.transactions.push({
            type: '충전',
            amount,
            date: new Date(),
        });

        await user.save();

        res.status(200).json({ success: true, account: user.account });
    } catch (error) {
        console.error('충전 오류:', error);
        res.status(500).json({ success: false, message: '충전 중 오류가 발생했습니다.' });
    }
}

  // **출금 요청**
export async function withdraw(req, res) {
    const userId = req.mongo_id; // 로그인한 사용자 ID
    const { amount } = req.body;
    if (amount <= 0) {
        return res.status(400).json({ success: false, message: '출금 금액이 유효하지 않습니다.' });
    }

    try {
        const user = await User.findById( userId );

        if (!user) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        if (user.account < amount) {
            return res.status(400).json({ success: false, message: '잔액이 부족합니다.' });
        }

        user.account -= amount; // 잔액 차감
        user.transactions.push({
            type: '출금',
            amount: -amount, // 음수 값으로 기록
            date: new Date(),
        });

        await user.save();

        res.status(200).json({ success: true, account: user.account });
    } catch (error) {
        console.error('출금 오류:', error);
        res.status(500).json({ success: false, message: '출금 중 오류가 발생했습니다.' });
    }
}

// // 수익
// export async function income(req, res) {
//     const userId = req.mongo_id; // 로그인한 사용자 ID
//     const { amount } = req.body;
//     if (amount <= 0) {
//         return res.status(400).json({ success: false, message: '수익 금액이 유효하지 않습니다.' });
//     }

//     try {
//         const user = await User.findOneAndUpdate(
//             { userId },
//             { $inc: { account: amount } }, // 잔액 증가
//             { new: true }
//         );

//         if (!user) {
//             return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
//         }

//         // 거래 기록 추가
//         user.transactions.push({
//             type: '수익',
//             amount,
//             date: new Date(),
//         });

//         await user.save();

//         res.status(200).json({ success: true, account: user.account });
//     } catch (error) {
//         console.error('수익 추가 오류:', error);
//         res.status(500).json({ success: false, message: '수익 추가 중 오류가 발생했습니다.' });
//     }
// }

// 입금
export async function deposit(req, res) {
    const senderId = req.mongo_id; // 입금하는 사용자 ID (로그인된 사용자)
    const { nickname, amount } = req.body; // 수익 받는 사용자 ID 및 금액
    console.log('senderId',senderId)
    console.log('nickname',nickname)
    console.log('amount',amount)

    // 금액 검증
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: '유효하지 않은 금액입니다.' });
    }

    try {
        // 1. 입금하는 사용자 (잔액 감소 및 출금 기록 추가)
        const sender = await User.findById({ _id: senderId });
        if (!sender) {
            return res.status(404).json({ success: false, message: '입금자를 찾을 수 없습니다.' });
        }

        // 입금자의 잔액이 충분한지 확인
        if (sender.account < amount) {
            return res.status(400).json({ success: false, message: '잔액이 부족합니다.' });
        }

        // 잔액 감소 및 거래 기록 추가
        sender.account -= amount;
        sender.transactions.push({
            type: '출금',
            amount: -amount,
            date: new Date(),
        });

        await sender.save();

        // 2. 수익 받는 사용자 (잔액 증가 및 수익 기록 추가)
        const recipient = await User.findOne({ nickname });

        if (!recipient) {
            return res.status(404).json({ success: false, message: '수익 받는 사용자를 찾을 수 없습니다.' });
        }

        // 잔액 증가 및 거래 기록 추가
        recipient.account += amount;
        recipient.transactions.push({
            type: '수익',
            amount: amount,
            date: new Date(),
        });

        await recipient.save();

        // 응답 반환
        res.status(200).json({
            success: true,
            message: '입금 및 수익 처리가 완료되었습니다.',
            senderAccount: sender.account,
            recipientAccount: recipient.account,
        });
    } catch (error) {
        console.error('입금 및 수익 처리 오류:', error);
        res.status(500).json({ success: false, message: '입금 처리 중 오류가 발생했습니다.' });
    }
}

// 거래 요청자 금액 차감 후, 수행자에게 입금
export async function completeTransaction(req, res) {
    const { requestorNickname, executorNickname, amount } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: "유효한 거래 금액이 아닙니다." });
    }

    try {
        // 거래 요청자 찾기 (잔액 차감)
        const requestor = await User.findOne({ nickname: requestorNickname });
        if (!requestor) {
            return res.status(404).json({ success: false, message: "거래 요청자를 찾을 수 없습니다." });
        }

        if (requestor.account < amount) {
            return res.status(400).json({ success: false, message: "잔액이 부족합니다." });
        }

        requestor.account -= amount;
        requestor.transactions.push({
            type: "출금",
            amount: -amount,
            date: new Date(),
        });

        await requestor.save();

        // 거래 수행자 찾기 (수익 추가)
        const executor = await User.findOne({ nickname: executorNickname });
        if (!executor) {
            return res.status(404).json({ success: false, message: "거래 수행자를 찾을 수 없습니다." });
        }

        executor.account += amount;
        executor.transactions.push({
            type: "수익",
            amount: amount,
            date: new Date(),
        });

        await executor.save();

        res.status(200).json({
            success: true,
            message: "거래가 완료되었습니다.",
            requestorAccount: requestor.account,
            executorAccount: executor.account,
        });

    } catch (error) {
        console.error("거래 처리 오류:", error);
        res.status(500).json({ success: false, message: "거래 처리 중 오류가 발생했습니다." });
    }
}
