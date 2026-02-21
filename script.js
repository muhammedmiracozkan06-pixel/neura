const GK = "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";
// DİKKAT: Buradaki URL, sunucunu canlıya (Render/Vercel) aldığında değişecek!
const BACKEND_URL = "http://localhost:3000"; 

let isVerified = false;
let isLoading = false;
let currentChatId = null; // Mevcut sohbetin ID'si

/* CAPTCHA VE LOGIN AYNI KALDI */
window.unlock = (token) => {
    if (!token) return;
    isVerified = true;
    document.getElementById("captcha-box").classList.add("hidden");
    document.getElementById("login-options").classList.remove("hidden");
};

window.onSignIn = (resp) => {
    try {
        const payload = JSON.parse(atob(resp.credential.split('.')[1]));
        enterApp(payload.name, "Google");
    } catch {
        alert("Giriş hatası!");
    }
};

window.enterAsGuest = () => {
    if (!isVerified) return alert("Önce doğrulamayı yap patron! 🤖");
    enterApp("Misafir", "Guest");
};

function enterApp(name, provider) {
    document.getElementById("auth-overlay").style.display = "none";
    document.getElementById("main-app").style.display = "flex";
    document.getElementById("u-tag").textContent = "| " + provider;
    addMsg(`Selam ${name}, Neura MAX hafızası devrede. Size nasıl yardımcı olabilirim?`, "bot");
    loadHistory(); // Uygulama açılınca eski sohbetleri getir
}

/* 🧠 MONGO DB HAFIZA FONKSİYONLARI */
async function saveToCloud(userMsg, botMsg) {
    try {
        await fetch(`${BACKEND_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: userMsg.substring(0, 20) + "...", // İlk 20 harfi başlık yap
                messages: [
                    { sender: "User", text: userMsg },
                    { sender: "Neura", text: botMsg }
                ]
            })
        });
    } catch (e) { console.log("Buluta kaydedilemedi."); }
}

async function loadHistory() {
    try {
        const r = await fetch(`${BACKEND_URL}/history`);
        const data = await r.json();
        console.log("Eski Sohbetler:", data);
        // Burada istersen bir yan menüde sohbet başlıklarını listeleyebiliriz!
    } catch (e) { console.log("Geçmiş yüklenemedi."); }
}

/* CHAT FONKSİYONU */
async function talk() {
    if (isLoading) return;
    const qInput = document.getElementById("q");
    const val = qInput.value.trim();
    if (!val) return;

    isLoading = true;
    qInput.value = "";
    addMsg(val, "user");

    const loadDiv = addMsg("Düşünüyorum... 🧠", "bot");

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GK}`
            },
            body: JSON.stringify({
                model: document.getElementById("model-select").value,
                messages: [{ role: "user", content: val }]
            })
        });

        const data = await r.json();
        loadDiv.remove();
        const botReply = data.choices[0].message.content;
        
        addMsg(botReply, "bot");
        
        // ✨ İŞTE BURADA BULUTA KAYDEDİYORUZ!
        saveToCloud(val, botReply);

    } catch (e) {
        if (loadDiv) loadDiv.remove();
        addMsg("Bağlantı koptu patron.", "bot");
    }
    isLoading = false;
}

function addMsg(txt, cls) {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.textContent = txt;
    const box = document.getElementById("chat");
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
    return d;
}

document.getElementById("q").addEventListener("keypress", (e) => { if (e.key === "Enter") talk(); });
