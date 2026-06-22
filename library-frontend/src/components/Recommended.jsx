import { ALL_BOOKS, ME } from "../queries";
import { useQuery } from "@apollo/client/react";

export default function Recommended({ token }) {
  let books = null;
  const { data: userDetails, loading: userLoading } = useQuery(ME, {
    skip: !token,
  });
  const favoriteGenre = userDetails?.me.favoriteGenre;
  const { data: bookData, loading: bookLoading } = useQuery(ALL_BOOKS, {
    skip: userLoading,
    variables: { genre: favoriteGenre },
  });

  if (!token) return <h1>Log In First.</h1>;

  if (userLoading || bookLoading) return <h2>Loading...</h2>;

  books = bookData?.allBooks || [];

  return (
    <div>
      <h1>recommendations</h1>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books &&
            books.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
