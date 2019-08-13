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
              <td colSpan="2">
                <b>{book.title}</b>
              </td>
            </tr>
            <tr>
              <td>
                <p />
              </td>
            </tr>
            <tr>
              <td width="30">
                <i className="fas fa-pencil-alt" />
              </td>
              <td> {book.author}</td>
            </tr>
            <tr>
              <td>
                <i className="far fa-calendar-alt" />
              </td>
              <td> {book.published}</td>
            </tr>
            <tr>
              <td>
                <i className="far fa-user" />
              </td>
              <td> {book.chosenBy}</td>
            </tr>
            <tr>
              <td>
                <i className="fas fa-book-open" />
              </td>
              <td> {book.pages}</td>
            </tr>
            <tr>
              <td>
                <i className="fas fa-dice" />
              </td>
              <td> {book.terningkast.Levin}</td>
            </tr>
          </tr>
        </table>
        <hr />
      </div>
    );
  }
}

export default Book;
