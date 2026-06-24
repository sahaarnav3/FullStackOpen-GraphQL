import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";

const Login = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("bookapp-user-token", token);
      setError(null)
    },
    onError: (error) => {
      console.log(error);
      setError("login failed");
    },
  });

  async function loginHandler(e) {
    e.preventDefault();
    await login({ variables: { username, password } });
    setUsername("");
    setPassword("");
    window.location.reload();
  }

  return (
    <div>
      <form onSubmit={loginHandler}>
        <div>
          username{" "}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            aria-label="username"
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            aria-label="password"
          />
        </div>
        <button type="submit">login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
