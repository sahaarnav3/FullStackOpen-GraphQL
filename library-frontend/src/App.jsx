import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("bookapp-user-token"),
  );
  const client = useApolloClient()
  function logoutHandler() {
    setToken(null);
    localStorage.removeItem("bookapp-user-token");
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommended")}>recommended</button>}
        {token ? (
          <button onClick={logoutHandler}>Logout</button>
        ) : (
          <button onClick={() => setPage("login")}>Login</button>
        )}
      </div>

      {page === "authors" && <Authors token={token} />}
      {page === "books" && <Books />}
      {page === "add" && <NewBook />}
      {page === "login" && <Login setToken={setToken} />}
      {page === "recommended" && <Recommended token={token} />}
    </div>
  );
};

export default App;
