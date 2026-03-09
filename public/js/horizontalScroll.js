// public/js/horizontalScroll.js
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.getElementById('recommendationList');
    
    // 요소가 존재할 때만 실행 (에러 방지)
    if (!scrollContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // 1. 세로 휠을 가로로 변환하는 기능 추가 (마우스 휠 사용 유저용)
    scrollContainer.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        scrollContainer.scrollLeft += evt.deltaY;
    }, { passive: false });

    // 2. 클릭 드래그 스크롤 기능 (Swipe)
    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.style.cursor = 'grabbing';
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.style.cursor = 'grab';
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도
        scrollContainer.scrollLeft = scrollLeft - walk;
    });
});