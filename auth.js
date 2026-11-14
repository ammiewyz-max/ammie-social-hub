
const supabase = window.supabaseClient;

document.addEventListener("DOMContentLoaded", async () => {
  if (!supabase) {
    alert("Supabase connection failed. Check supabase.js");
    return;
  }

  const style = document.createElement("style");
  style.textContent = `
    #authScreen {
      position:fixed; inset:0; z-index:9999;
      background:#0c1220; display:flex;
      align-items:center; justify-content:center;
      padding:20px; font-family:Arial,sans-serif;
    }
    .authBox {
      background:#162338; border:1px solid #293a54;
      border-radius:14px; padding:28px;
      width:100%; max-width:390px;
    }
    .authBox h2 {color:white}
    .authBox p {color:#aab6c8;font-size:14px}
    .authBox input {
      width:100%; box-sizing:border-box;
      padding:13px; margin:8px 0;
      background:#101b2d;color:white;
      border:1px solid #35445b;border-radius:8px;
    }
    .authBox button {
      width:100%;padding:13px;margin-top:10px;
      border:0;border-radius:8px;
      background:#ff725e;color:white;
      cursor:pointer;font-weight:bold;
    }
    #authMessage {color:#ffb5a9;font-size:13px}
  `;
  document.head.appendChild(style);

  const screen = document.createElement("div");
  screen.id = "authScreen";
  screen.innerHTML = `
    <div class="authBox">
      <h2>AMMIE <span style="color:#ff725e">HUB</span></h2>
      <p>Sign in or create your Social Hub account.</p>
      <input id="authEmail" type="email" placeholder="Email address">
      <input id="authPassword" type="password" placeholder="Password (minimum 6 characters)">
      <button id="loginBtn">Sign in</button>
      <button id="signupBtn">Create account</button>
      <p id="authMessage"></p>
    </div>
  `;
  document.body.appendChild(screen);

  const message = document.getElementById("authMessage");

  async function checkSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      message.textContent = error.message;
      return;
    }
    if (data.session) {
      screen.remove();
    }
  }

  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    if (!email || !password) {
      message.textContent = "Enter your email and password.";
      return;
    }

    message.textContent = "Signing in...";

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      message.textContent = error.message;
    } else {
      screen.remove();
    }
  };

  document.getElementById("signupBtn").onclick = async () => {
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;

    if (!email || password.length < 6) {
      message.textContent = "Enter a valid email and password of at least 6 characters.";
      return;
    }

    message.textContent = "Creating account...";

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      message.textContent = error.message;
      return;
    }

    if (data.session) {
      screen.remove();
    } else {
      message.textContent = "Account created. Check your email to confirm, then sign in.";
    }
  };

  await checkSession();

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
      location.reload();
    }
  });
});
