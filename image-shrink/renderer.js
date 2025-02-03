document.getElementById('selectBtn').addEventListener('click', async () => {
    const path = await window.electron.selectPath();
    document.getElementById('output-path').innerText = `선택된 경로: ${path}`;
  });