import mongoose from 'mongoose';

const ErrandSchema = new mongoose.Schema({
    taskCategories: { type: String, required: true, enum: ['배달 퀵', '청소 집안', '설치 수리', '이사 운반', '대행', '알바','반려 동물', '돌봄 육아', '기타' ] },
    taskDetails: {
        title: { type: String, required: true }, //심부름 제목
        description: { type: String, required: true }, //심부름 요청사항
        photoUrl: { type: String }//심부름 사진
    },
    location: {
        area: { type: String, required: true }, //주소 검색
        detailedAddress: { type: String, required: true }, // 상세 주소
        extraNotes: { type: String } //전달 사항 입력
    },
    conditions: {
        hasCCTV: { type: Boolean, required: true }, //cctv
        hasObstacles: { type: Boolean, required: true }, // 반려 동물
        partnerParkingAvailable: { type: Boolean, required: true } // 주차
    },
    schedule: {
        date: { type: Date, required: true }, // 날짜
        time: { type: String, required: true }, // 시간
        estimatedDuration: { type: String, required: true } //예상 소요 시간
    },
    // calendarId: { type: mongoose.Schema.Types.ObjectId }, // 백앤드 작업(달력) 
    payment: {
        serviceFee: { type: Number, required: true }, //비용
        currency: { type: String, required: true } //통화?
    },
    partnerPreference: { 
        gender: { type: String, enum: ['male', 'female', 'none'], required: true }, //성별
        ageRange: { type: String }, //연령대?
        otherPreferences: { type: String } //기타?
    },
    createdAt: { type: Date, default: Date.now }, // 심부름 신청 시간
    updatedAt: { type: Date, default: Date.now } // 수정 시간
});

const Errand = mongoose.model('Errand', ErrandSchema);

export async function create(data) {
    try {
        const newErrand = new Errand(data);
        return await newErrand.save();
    } catch (error) {
        console.error('Error creating errand:', error);
        throw error;
    }
}
