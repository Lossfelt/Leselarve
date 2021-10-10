import React from "react";
import Book from "./Book";
import Topnav from "./Topnav";
import Grafer from "./Grafer.js";

class Presentation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myTopnavClass: "topnav",
      sortBy: "numberInLine",
      desc: true,
      grafEllerBøker: "Bøker"
    };
    this.handleSortClick = this.handleSortClick.bind(this);
    this.handleGrafEllerBøkerClick = this.handleGrafEllerBøkerClick.bind(this);
  }

  handleSortClick(mottatt) {
    if (this.state.grafEllerBøker === "Grafer") {
      this.setState({ sortBy: mottatt, grafEllerBøker: "Bøker" });
    } else {
      this.setState({ sortBy: mottatt });
    }
    if (this.state.sortBy === mottatt) {
      if (this.state.desc) {
        this.setState({ desc: false });
      } else {
        this.setState({ desc: true });
      }
    }
  }

  handleGrafEllerBøkerClick(e) {
    this.setState({ grafEllerBøker: e });
  }

  render() {
    function compare(key, order = "asc") {
      return function (a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          //property doesn't exist on either object
          return 0;
        }
        const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
        const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return order === "desc" ? comparison * -1 : comparison;
      };
    }

    var books = [];
    if (
      ["Kyrre", "Heidi", "Ida", "Levin", "Silje", "Øivind"].includes(
        this.state.sortBy
      )
    ) {
      var booksIntermediary = this.props.books;
      books = booksIntermediary.filter(
        (book) => book.chosenBy === this.state.sortBy
      );
    } else {
      books = this.props.books;
      books.sort(compare(this.state.sortBy, this.state.desc ? "desc" : "asc"));
    }
    const liste = [];
    books.forEach((entry) => {
      liste.push(
        <div>
          <Book book={entry} />
        </div>
      );
    });

    var grafEllerBøker = "";
    if (this.state.grafEllerBøker === "Bøker") {
      grafEllerBøker = <div className="flex-container">{liste}</div>;
    } else {
      grafEllerBøker = <Grafer books={this.props.books} />;
    }

    return (
      <div>
        <Topnav
          myTopnavClass={this.state.myTopnavClass}
          handleSortClick={this.handleSortClick}
          desc={this.state.desc}
          handleGrafEllerBøkerClick={this.handleGrafEllerBøkerClick}
        />
        {grafEllerBøker}
      </div>
    );
  }
}

export default Presentation;
