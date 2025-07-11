let text = document.getElementById("text");
let voicesList = document.getElementById("voices");
let voices = [];
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voicesList.innerHTML = "";
  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `${voice.name} (${voice.lang})`;
    voicesList.appendChild(option);
  });
}
function speak() {
  let talk = new SpeechSynthesisUtterance(text.value);
  talk.voice = voices[voicesList.value];
  speechSynthesis.speak(talk);
}
// Load voices when they are loaded or changed
window.speechSynthesis.onvoiceschanged = loadVoices;
// Also call once on page load
window.onload = loadVoices;

let mediaRecorder;
let audioChunks = [];

// Start Recording
document.getElementById("startBtn").onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = (e) => {
    audioChunks.push(e.data);
  };

  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-audio.webm";
    a.click();
    audioChunks = []; // clear after download
  };

  mediaRecorder.start();
  alert("🎙️ Recording started...");
};

// Stop Recording
document.getElementById("stopBtn").onclick = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    alert("🛑 Recording stopped. File will download now.");
  }
};

// Dark mode toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.onclick = () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.textContent = "☀️";
  } else {
    darkModeToggle.textContent = "🌙";
  }
};
