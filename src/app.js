const express = require('express');
const path = require('path');
const cors = require('cors'); // CORS 추가
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const app = express(); // 1. app을 먼저 생성합니다!
const PORT = process.env.PORT || 3000;

// 2. 공통 설정 (미들웨어)
app.use(cors()); // 다른 도메인(HTML파일)에서의 요청 허용
app.use(express.static(path.join(__dirname, '../public')));

// 3. 라우터 불러오기 및 연결
const hotspotRouter = require('./routes/hotspot');
app.use('/api', hotspotRouter);

// 4. 기본 경로 설정 (HTML 파일 보내기)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 5. 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});