/**
 * ==============================================================================
 * Web Technology Project: JS Validation
 * Title: Personal Wellness Dashboard (VitalityPulse)
 * Description:
 * Client-side and Admin-side JavaScript form validation with localStorage
 * data persistence (username, email, mobile phone, password, and registration date).
 * ==============================================================================
 */

// Global navigation helper
function showApplication(role) {
  if (role === "admin") {
    window.location.href = "admin/index.html";
  } else {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Panels & Tabs
  const clientTabBtn = document.getElementById("clientTabBtn");
  const adminTabBtn = document.getElementById("adminTabBtn");
  const clientPanel = document.getElementById("clientPanel");
  const adminPanel = document.getElementById("adminPanel");

  const clientSignupPanel = document.getElementById("clientSignupPanel");
  const clientLoginPanel = document.getElementById("clientLoginPanel");
  const showLoginLink = document.getElementById("showLoginLink");
  const showSignupLink = document.getElementById("showSignupLink");

  // Tab Switching (Member vs Admin)
  if (clientTabBtn && adminTabBtn) {
    clientTabBtn.addEventListener("click", () => {
      clientTabBtn.classList.add("active");
      adminTabBtn.classList.remove("active");
      clientPanel.hidden = false;
      adminPanel.hidden = true;
    });

    adminTabBtn.addEventListener("click", () => {
      adminTabBtn.classList.add("active");
      clientTabBtn.classList.remove("active");
      adminPanel.hidden = false;
      clientPanel.hidden = true;
    });
  }

  // Toggle between Member Sign In & Member Create Account
  if (showLoginLink && showSignupLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      clientSignupPanel.hidden = true;
      clientLoginPanel.hidden = false;
      const signupErr = document.getElementById("signupError");
      if (signupErr) signupErr.textContent = "";
    });

    showSignupLink.addEventListener("click", (e) => {
      e.preventDefault();
      clientLoginPanel.hidden = true;
      clientSignupPanel.hidden = false;
      const loginErr = document.getElementById("clientLoginError");
      if (loginErr) loginErr.textContent = "";
      const loginSucc = document.getElementById("clientLoginSuccess");
      if (loginSucc) loginSucc.textContent = "";
    });
  }

  // ============================================================================
  // 1. CLIENT / MEMBER SIGNUP VALIDATION
  // ============================================================================
  const clientSignupForm = document.getElementById("clientSignupForm");
  if (clientSignupForm) {
    clientSignupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("signupUsername").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const phone = document.getElementById("signupPhone").value.trim();
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const error = document.getElementById("signupError");

      // 1. Username validation (Min 3 characters)
      if (username.length < 3) {
        error.textContent = "Username must contain at least 3 characters.";
        return;
      }

      // 2. Email format validation (standard RFC email)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        error.textContent = "Please enter a valid email address.";
        return;
      }

      // 3. Mobile phone number validation (10 digits)
      if (!/^[0-9]{10}$/.test(phone)) {
        error.textContent = "Enter a valid 10-digit mobile number.";
        return;
      }

      // 4. Password length validation (Min 6 characters)
      if (password.length < 6) {
        error.textContent = "Password must contain at least 6 characters.";
        return;
      }

      // 5. Password confirmation validation
      if (password !== confirmPassword) {
        error.textContent = "Passwords do not match.";
        return;
      }

      // Member Data Object with registration date
      const registeredClient = {
        username: username,
        email: email,
        phone: phone,
        password: password,
        registrationDate: new Date().toLocaleString(),
        role: "member"
      };

      // Save registered member account in browser storage
      localStorage.setItem(
        "wellness_registered_client",
        JSON.stringify(registeredClient)
      );
      // Also store under medicare_registered_client for curriculum compatibility
      localStorage.setItem(
        "medicare_registered_client",
        JSON.stringify(registeredClient)
      );

      // Reset form and transition to login panel
      clientSignupForm.reset();
      if (clientSignupPanel && clientLoginPanel) {
        clientSignupPanel.hidden = true;
        clientLoginPanel.hidden = false;
      }

      const clientLoginSuccess = document.getElementById("clientLoginSuccess");
      if (clientLoginSuccess) {
        clientLoginSuccess.textContent = "Account created successfully! Please login.";
      }
      error.textContent = "";
    });
  }

  // ============================================================================
  // 2. CLIENT / MEMBER LOGIN VALIDATION
  // ============================================================================
  const clientLoginForm = document.getElementById("clientLoginForm");
  if (clientLoginForm) {
    clientLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("clientLoginEmail").value.trim().toLowerCase();
      const password = document.getElementById("clientLoginPassword").value;
      const error = document.getElementById("clientLoginError");
      const success = document.getElementById("clientLoginSuccess");

      if (email === "") {
        error.textContent = "Please enter your email or username.";
        return;
      }

      if (password === "") {
        error.textContent = "Please enter your password.";
        return;
      }

      // Retrieve registered user from localStorage
      const storedData = localStorage.getItem("wellness_registered_client") ||
                         localStorage.getItem("medicare_registered_client");
      let registeredUser = null;
      if (storedData) {
        try {
          registeredUser = JSON.parse(storedData);
        } catch (err) {
          console.error("Storage parse error", err);
        }
      }

      // Validate against registered user
      if (
        registeredUser &&
        (registeredUser.email.toLowerCase() === email || registeredUser.username.toLowerCase() === email) &&
        registeredUser.password === password
      ) {
        error.textContent = "";
        success.textContent = "Login successful! Redirecting to Wellness Dashboard...";
        setTimeout(() => {
          showApplication("client");
        }, 700);
        return;
      }

      // Pre-configured default wellness credentials for demonstration
      if (
        (email === "member@wellness.com" || email === "maya@vitalitypulse.com" || email === "user@wellness.com" || email === "client@medicare.com") &&
        (password === "wellness123" || password === "client123" || password === "password123")
      ) {
        error.textContent = "";
        success.textContent = "Login successful! Redirecting to Wellness Dashboard...";
        setTimeout(() => {
          showApplication("client");
        }, 700);
        return;
      }

      error.textContent = "Invalid email/username or password.";
    });
  }

  // ============================================================================
  // 3. ADMIN SIDE LOGIN VALIDATION
  // ============================================================================
  const adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("adminEmail").value.trim().toLowerCase();
      const password = document.getElementById("adminPassword").value;
      const error = document.getElementById("adminLoginError");

      // 1. Empty email
      if (email === "") {
        error.textContent = "Please enter admin email.";
        return;
      }

      // 2. Invalid email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        error.textContent = "Please enter a valid email address.";
        return;
      }

      // 3. Empty password
      if (password === "") {
        error.textContent = "Please enter your password.";
        return;
      }

      // 4. Password shorter than 8 characters
      if (password.length < 8) {
        error.textContent = "Password must contain at least 8 characters.";
        return;
      }

      // 5. Incorrect credentials (Fixed Wellness Admin Credentials)
      const validAdminEmails = ["admin@wellness.com", "admin@vitalitypulse.com", "admin@medicare.com"];
      const validAdminPasswords = ["admin123", "admin1234"];

      if (!validAdminEmails.includes(email) || !validAdminPasswords.includes(password)) {
        error.textContent = "Incorrect admin email or password.";
        return;
      }

      // Successful admin login
      error.textContent = "";
      showApplication("admin");
    });
  }
});
