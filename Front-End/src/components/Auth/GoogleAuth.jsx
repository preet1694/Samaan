import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  const handleGoogleLogin = (googleCredential) => {
    setIsLoading(true);
    setErrorMessage("");

    fetch("https://samaan-pooling.onrender.com/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: googleCredential }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isNew) {
          setIsNewUser(true);
          setUserEmail(data.email);
          setUserName(data.name);
          setUserId(data._id);
        } else {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userId", data._id);
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("email", data.email);
          localStorage.setItem("name", data.name);

          navigate("/dashboard");
        }
      })
      .catch(() => {
        setErrorMessage("Google login failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRoleSelection = () => {
    if (!userRole) {
      setErrorMessage("Please select a role.");
      return;
    }

    setIsLoading(true);

    fetch("https://samaan-pooling.onrender.com/api/auth/google/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userRole,
        userEmail,
        userName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", data._id || userId); // use returned ID or fallback
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("name", userName);

        navigate("/dashboard");
      })
      .catch(() => {
        setErrorMessage("Role assignment failed. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoogleLoginSuccess = (response) => {
    handleGoogleLogin(response.credential);
  };

  const handleRoleChange = (event) => {
    setUserRole(event.target.value);
  };

  return (
    <div className="google-auth-container">
      {isLoading && <div className="loading-spinner">Loading...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!isNewUser ? (
        <div>
          <h2>Login with Google</h2>
          <div id="google-signin-button"></div>
          <script
            src="https://accounts.google.com/gsi/client"
            async
            defer
            onLoad={() => {
              google.accounts.id.initialize({
                client_id: "YOUR_GOOGLE_CLIENT_ID",
                callback: handleGoogleLoginSuccess,
              });
              google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                {
                  theme: "outline",
                  size: "large",
                }
              );
            }}
          ></script>
        </div>
      ) : (
        <div>
          <h2>Welcome {userName}, Please Select Your Role</h2>
          <div className="role-selection">
            <label>
              <input
                type="radio"
                value="Sender"
                checked={userRole === "Sender"}
                onChange={handleRoleChange}
              />
              Sender
            </label>
            <label>
              <input
                type="radio"
                value="Carrier"
                checked={userRole === "Carrier"}
                onChange={handleRoleChange}
              />
              Carrier
            </label>
          </div>
          <button onClick={handleRoleSelection} disabled={isLoading}>
            {isLoading ? "Registering..." : "Register and Continue"}
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;