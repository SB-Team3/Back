import express from "express";
import mongoose from "mongoose";
import errandRouter from "./server/router/errandRouter.js";

const app = express();

// MongoDB 연결
const MONGO_URI = "mongodb://localhost:27017/errandApp"; // 본인의 MongoDB URI로 변경
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());

// 라우터 설정
app.use('/errand', errandRouter);

// 404 처리
app.use((req, res, next) => {
    res.sendStatus(404);
});

// 서버 실행
app.listen(3000, () => console.log("Server is running on http://localhost:3000"));
