const form = document.getElementById('image-form')
const slider = document.getElementById('slider')
const img = document.getElementById('img')
let filePath = null; 


window.electron.getOutputPath().then((paths) => {
  document.getElementById('output-path').innerHTML =
    `📂 다운로드 폴더: ${paths.downloads} <br> 📁 프로젝트 폴더: ${paths.project}`;
});

// 파일 선택 버튼 클릭 시
document.getElementById('select-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  filePath = await window.electron.selectFile();
  if (filePath) {
    console.log('선택된 파일:', filePath);
    // 선택된 파일 경로를 input에 표시
    document.querySelector('.file-path').value = filePath;
  }
});

// 폼 제출 시
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!filePath) {
    alert('이미지 파일을 선택해주세요!');
    return;
  }

  const quality = slider.value;
  console.log('제출된 파일:', filePath);
  console.log('설정된 품질:', quality);
});