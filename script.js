:root {
    --bg-dark: #050505;
    --card-bg: rgba(20, 20, 20, 0.7);
    --accent: #007bff;
    --accent-glow: rgba(0, 123, 255, 0.3);
    --text-main: #ffffff;
    --text-dim: #a0a0a0;
    --border: rgba(255, 255, 255, 0.08);
}

* { box-sizing: border-box; margin: 0; padding: 0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

body, html {
    height: 100%;
    font-family: 'Inter', sans-serif;
    background-color: var(--bg-dark);
    color: var(--text-main);
    overflow: hidden;
}

/* Giriş Ekranı (Glassmorphism) */
.overlay {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at center, #111 0%, #000 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    visibility: visible;
}

.auth-card {
    position: relative;
    background: var(--card-bg);
    padding: 60px 40px;
    border-radius: 40px;
    border: 1px solid var(--border);
    text-align: center;
    backdrop-filter: blur(25px);
    box-shadow: 0 30px 60px rgba(0,0,0,0.8);
    width: 90%;
    max-width: 400px;
    overflow: hidden;
}

.glow-effect {
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
    pointer-events: none;
}

.auth-card h1 {
    font-size: 3.2rem;
    font-weight: 800;
    letter-spacing: -3px;
    margin-bottom: 5px;
}

.auth-card h1 span { color: var(--accent); text-shadow: 0 0 20px var(--accent-glow); }

.auth-card p {
    color: var(--text-dim);
    margin-bottom: 40px;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 4px;
}

.auth-buttons { display: flex; flex-direction: column; gap: 15px; align-items: center; width: 100%; }

.divider { margin: 10px 0; color: #333; font-size: 0.7rem; text-transform: uppercase; }

.guest-btn {
    width: 100%;
    padding: 16px;
    border-radius: 18px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
    color: white;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
}

.guest-btn:hover {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 30px var(--accent-glow);
    transform: translateY(-3px);
}

/* Ana Uygulama */
.app-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 900px;
    margin: 0 auto;
}

header {
    padding: 20px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border);
}

.logo { font-weight: 800; font-size: 1.2rem; }
.logo span { color: var(--text-dim); font-weight: 400; font-size: 0.8rem; margin-left: 5px; }

.user-header { align-items: center; gap: 10px; }
#user-pfp { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid var(--accent); }

/* Sohbet Bölümü */
.chat-box {
    flex: 1;
    overflow-y: auto;
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    scrollbar-width: none;
}

.msg {
    padding: 12px 18px;
    border-radius: 20px;
    max-width: 80%;
    line-height: 1.5;
    font-size: 0.95rem;
    animation: slideUp 0.4s ease;
}

@keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.user { align-self: flex-end; background: var(--accent); border-bottom-right-radius: 4px; }
.bot { align-self: flex-start; background: #1a1a1a; border: 1px solid var(--border); border-bottom-left-radius: 4px; }

/* Giriş Çubuğu */
footer { padding: 20px; background: linear-gradient(transparent, var(--bg-dark) 40%); }

.input-container {
    background: #121212;
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 12px;
}

textarea {
    width: 100%; background: transparent; border: none; color: white;
    padding: 8px 12px; resize: none; outline: none; font-size: 1rem;
    max-height: 150px;
}

.bottom-bar {
    display: flex; justify-content: space-between; align-items: center;
    margin-top: 10px; padding-top: 10px; border-top: 1px solid #222;
}

.model-buttons { display: flex; gap: 5px; }

.model-buttons button {
    background: #1a1a1a; border: 1px solid var(--border); color: #777;
    padding: 6px 12px; border-radius: 10px; cursor: pointer; font-size: 0.75rem; font-weight: 600;
}

.model-buttons button.active { background: var(--accent-glow); border-color: var(--accent); color: white; }

#send-btn {
    background: var(--accent); color: white; border: none;
    width: 38px; height: 38px; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
}

#send-btn:hover { transform: scale(1.1); box-shadow: 0 0 15px var(--accent-glow); }
