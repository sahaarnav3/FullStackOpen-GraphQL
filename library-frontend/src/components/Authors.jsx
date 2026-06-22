import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useQuery, useMutation } from "@apollo/client/react";

const Authors = ({ token }) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const result = useQuery(ALL_AUTHORS);
  if (result.loading) return <h2>Loading...</h2>;

  const authors = result.data.allAuthors;

  async function updateAuthorHandler(e) {
    e.preventDefault();
    if (!name) return alert("Please Select an Author from dropdown");
    if (!birthYear) return alert("Please put Birth Year");

    await editAuthor({ variables: { name, setBornTo: birthYear } });
    setName("");
    setBirthYear("");
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && <div>
        <h2>Set birthyear</h2>
        <form onSubmit={updateAuthorHandler}>
          <label>name</label>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option>Please Select An Author</option>
            {authors.map((a) => (
              <option key={a.id}>{a.name}</option>
            ))}
          </select>
          <br />
          <label>born</label>
          <input
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
          />
          <br />
          <button type="submit">update author</button>
        </form>
      </div>}
    </div>
  );
};

export default Authors;
