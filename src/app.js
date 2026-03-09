const express = require('express');
const path = require('path');
const cors = require('cors'); // CORS 추가
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express(); // 1. app을 먼저 생성합니다!
const PORT = process.env.PORT || 3000;


// EJS 엔진 설정
app.set('view engine', 'ejs');
// 보통 ejs 파일들은 views 폴더 안에 둡니다.
app.set('views', path.join(__dirname, '../public'));


// 2. 공통 설정 (미들웨어)
app.use(cors()); // 다른 도메인(HTML파일)에서의 요청 허용
app.use(express.static(path.join(__dirname, '../public')));

// 3. 라우터 불러오기 및 연결
const hotspotRouter = require('./routes/hotspot');
app.use('/api', hotspotRouter);

// 4. 기본 경로 설정 (HTML 파일 보내기)
app.get('/', (req, res) => {
    res.render('index', { kakaoKey: process.env.KAKAO_JS_KEY }); // EJS 템플릿에 카카오 앱 키 전달
});

// 5. 서버 실행
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});