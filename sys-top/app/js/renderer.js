
window.electron.on("settings:get", (settings) => {
    console.log("설정 데이터:", settings);
    document.getElementById('cpu-overload').value = settings.cpuOverload
    document.getElementById('alert-frequency').value = settings.alertFrequency
});


const settingsForm = document.getElementById("settings-form"); // 폼 요소 선택
settingsForm.addEventListener('submit', e => {
    e.preventDefault()
    const cpuOverload = document.getElementById('cpu-overload').value
    const alertFrequency = document.getElementById('alert-frequency').value

    // 메인 프로세스로 데이터 전송
    window.electron.send("settings:set", { cpuOverload, alertFrequency });
    showAlert('Setting Saved')
})

function showAlert(msg) {
    const alert = document.getElementById('alert');
    alert.classList.remove('hide')
    alert.classList.add('alert')
    alert.innerText = msg

    setTimeout(() => {
        alert.classList.add('hide')
    },3000)
}