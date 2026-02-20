/ Mirac'ın özel Groq anahtarı 🔑
const GROQ_API_KEY = "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";
let isLoading = false;

// Google Giriş Kontrolü
// Google Giriş Yanıtı
window.handleCredentialResponse = function(response) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("user-display").textContent = `| ${payload.name}`;
    
    addMessage(`Hoş geldin ${payload.name}! Neura Max asistanın hizmetine hazır.`, "bot");
    addMessage(`Hoş geldin ${payload.name}! Neura Max hazır.`, "bot");
};

// Groq ile Sohbet Fonksiyonu
// Ana Sohbet Fonksiyonu
async function talk() {
    if (isLoading) return;
    
    const input = document.getElementById("q");
    const model = document.getElementById("model-select").value;
    const query = input.value.trim();
    
    const model = document.getElementById("model-select").value;

    if (!query) return;

    isLoading = true;
    input.value = "";
    addMessage(query, "user");

    const status = document.getElementById("status");
    status.innerHTML = `<div class="status-text">${model} işliyor...</div>`;
    status.innerHTML = `<div class="status-text">${model} yanıt hazırlıyor...</div>`;

    try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
@@ -38,10 +37,7 @@ async function talk() {
            body: JSON.stringify({
                model: model,
                messages: [
                    { 
                        role: "system", 
                        content: "Sen Wind Developer tarafından geliştirilen, 10 yaşındaki entrepreneur Mirac'ın asistanı Neura Max'sin. Samimi, zeki ve profesyonel ol." 
                    },
                    { role: "system", content: "Sen Wind Developer tarafından geliştirilen zeki bir asistan olan Neura Max'sin." },
                    { role: "user", content: query }
                ]
            })
@@ -53,28 +49,32 @@ async function talk() {
        if (data.choices && data.choices[0]) {
            addMessage(data.choices[0].message.content, "bot");
        } else {
            addMessage("Hata: " + (data.error?.message || "Groq yanıt vermedi."), "bot");
            addMessage("Hata: " + (data.error?.message || "Bir sorun oluştu."), "bot");
        }
    } catch (e) {
        status.innerHTML = "";
        addMessage("Bağlantı sorunu! Lütfen internetini kontrol et.", "bot");
        addMessage("Bağlantı hatası oluştu!", "bot");
    }
    isLoading = false;
}

// Mesaj Baloncuğu Ekleme
// Mesajı Ekrana Yazma
function addMessage(text, side) {
    const div = document.createElement("div");
    div.className = `msg ${side}`;
    div.textContent = text;
    const chat = document.getElementById("chat");
    chat.appendChild(div);
    
    // Otomatik aşağı kaydır
    chat.scrollTop = chat.scrollHeight;
}

// Enter Tuşu Dinleyici
document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Enter") talk();
// Olay Dinleyicileri (Buton ve Enter Tuşu)
document.addEventListener('DOMContentLoaded', () => {
    // Gönder butonu dinleyicisi
    document.getElementById("send-btn").addEventListener("click", talk);
    
    // Enter tuşu dinleyicisi
    document.getElementById("q").addEventListener("keydown", (e) => {
        if (e.key === "Enter") talk();
    });
