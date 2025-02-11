// Set model
window.electron.getComInfo().then((data) => {
  document.getElementById("cpu-model").innerHTML = data.model;
  document.getElementById("comp-name").innerHTML = data.compName;
  // document.getElementById('cpu-model').innerHTML = JSON.stringify(data, null, 2);
  document.getElementById("os").innerHTML = data.osInfo;
  document.getElementById("mem-total").innerHTML = data.memInfo.totalMemMb;
  console.log(data);
});

// CPU 및 Uptime 업데이트 함수
async function updateStats() {
    const cpuUsage = await window.electron.getCpuUsage();
    const uptime = await window.electron.getUptime();

    document.getElementById('cpu-usage').innerText = `${cpuUsage}%`;
    document.getElementById('cpu-free').innerText = `${100 - cpuUsage}%`;
    document.getElementById('sys-uptime').innerText = formatUptime(uptime);

    // 프로그레스 바 업데이트
    document.getElementById('cpu-progress').style.width = `${cpuUsage}%`;
}

// 2초마다 CPU 및 시스템 가동 시간 업데이트
setInterval(updateStats, 2000);

// Uptime을 시, 분, 초 형식으로 변환하는 함수
function formatUptime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60); // 소수점 없이 정수로 변환
    return `${hrs}h ${mins}m ${secs}s`;
}