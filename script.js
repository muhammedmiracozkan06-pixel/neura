// 🔑 WIND DEVELOPER - NEURA MAX ÖZEL ANAHTARLAR
const GR_KEY = "gsk_vMTW5X8N8F1kR0S6R0S6WGdyb3FYM3S6R0S6R0S6R0S6R0S6"; 
const G_CLIENT = "513257852357-69h9l18s8e8j9m1j9m1j9m1j9m1j9m1j.apps.googleusercontent.com";

// 1. Google OAuth Giriş Sistemi
window.onload = () => {
    google.accounts.id.initialize({
        client_id: G_CLIENT,
        callback: onLogin
    });
    google.accounts.id.renderButton(
        document.getElementById("google-btn"), 
        { theme: "filled_blue", size: "large", text: "signin_with" }
    );
};

function onLogin(res) {
    // Google'dan gelen şifreli veriyi çözüp kullanıcı adını ve fotosunu alıyoruz
    const user = JSON.parse(atob(res.credential.split('.')[1]));
    
    // Arayüzü güncelle (Hoş geldin Mirac!)
    document.getElementById("pfp").src = user.picture;
    document.getElementById("user-name").innerText = user.name;
    
    // Giriş ekranını gizle, uygulamayı göster
    document.getElementById("login-page").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    
    addMsg("neura", `Selam ${user.given_name}! Neura Max sistemleri aktif. Wind Developer için çalışmaya hazırım. 🚀`);
}

// 2. Araçlar Menüsü (Sol Alt)
const tBtn = document.getElementById("tools-toggle");
const tMenu = document.getElementById("tools-popup");

tBtn.onclick = (e) => {
    e.stopPropagation();
    tMenu.classList.toggle("hidden");
};

// Menü dışına tıklayınca kapat
document.onclick = () => tMenu.classList.add("hidden");

// 3. Neura Max Mesajlaşma (Gemma 2 Modeli)
async function send() {
    const input = document.getElementById("msg-input");
    const val = input.value.trim();
    if (!val) return;

    addMsg("user", val);
    input.value = "";

    try {
        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${GR_KEY}`, 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                model: "gemma2-9b-it", // Mixtral yerine en güncel Gemma 2
                messages: [
                    { role: "system", content: "Sen Neura Max'sin. Kurucun Mirac'tır." },
                    { role: "user", content: val }
                ],
                temperature: 0.7
            })
        });
        
        const d = await r.json();
        const responseText = d.choices[0].message.content;
        addMsg("neura", responseText);
        
    } catch (e) {
        addMsg("neura", "Bir bağlantı hatası oluştu ");
        console.error(e);
    }
}

// Mesajı ekrana yazdıran fonksiyon
function addMsg(type, text) {
    const box = document.getElementById("chat-display");
    const d = document.createElement("div");
    d.className = `msg ${type}`;
    d.innerText = text;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
}

// Buton ve Enter tuşu dinleyicileri
document.getElementById("btn-send").onclick = send;
document.getElementById("msg-input").onkeypress = (e) => { if(e.key === 'Enter') send(); };

function logout() { location.reload(); }
