import React from "react";

class Book extends React.Component {
  render() {
    const book = this.props.book;
    return (
      <div>
        <table>
          <tr>
            <td rowSpan="6">
              <img
                src={book.picture}
                alt="bokens forside"
                heigth="100"
                width="100"
              />
            </td>
            <td width="12" />
            <tr>
              <td>
                <b>{book.title}</b>
              </td>
            </tr>
            <tr>
              <td>
                <p />
              </td>
            </tr>
            <tr>
              <td>Forfatter: {book.author}</td>
            </tr>
            <tr>
              <td>Publisert: {book.published}</td>
            </tr>
            <tr>
              <td>Valgt av: {book.chosenBy}</td>
            </tr>
            <tr>
              <td>Antall sider: {book.pages}</td>
            </tr>
          </tr>
        </table>
        <hr />
      </div>
    );
  }
}

export default Book;
