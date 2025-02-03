window.electron.getOutputPath().then((paths) => {
  document.getElementById('output-path').innerHTML =
    `📂 다운로드 폴더: ${paths.downloads} <br> 📁 프로젝트 폴더: ${paths.project}`;
});