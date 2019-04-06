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
              <td colspan="2">
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
                <i class="fas fa-pencil-alt" />
              </td>
              <td> {book.author}</td>
            </tr>
            <tr>
              <td>
                <i class="far fa-calendar-alt" />
              </td>
              <td> {book.published}</td>
            </tr>
            <tr>
              <td>
                <i class="far fa-user" />
              </td>
              <td> {book.chosenBy}</td>
            </tr>
            <tr>
              <td>
                <i class="fas fa-book-open" />
              </td>
              <td> {book.pages}</td>
            </tr>
          </tr>
        </table>
        <hr />
      </div>
    );
  }
}

export default Book;
