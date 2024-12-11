import * as errandQuery from '../query/errandQuery.js';

export async function creErrand(req, res, next) {
    try {
        const errand = await errandQuery.create(req.body);
        res.status(201).json(errand);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: '등록이 불가합니다', error: error.message });
    }
}