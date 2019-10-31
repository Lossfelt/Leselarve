import React from "react";

class Topnav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentlyActive: "numberInLine" };
    this.state = { visibilityClassOfMenu: "dropdown-content-invisible" };
    this.handleSortClick = this.handleSortClick.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    this.handleGrafEllerBøkerClick = this.handleGrafEllerBøkerClick.bind(this);
  }

  handleSortClick(e) {
    this.props.handleSortClick(e.target.id);
    this.setState({ currentlyActive: e.target.id });
    this.setState({ visibilityClassOfMenu: "dropdown-content-invisible" });
  }

  handleIconClick() {
    this.state.visibilityClassOfMenu === "dropdown-content-invisible"
      ? this.setState({ visibilityClassOfMenu: "dropdown-content-visible" })
      : this.setState({ visibilityClassOfMenu: "dropdown-content-invisible" });
  }

  handleGrafEllerBøkerClick(e) {
    this.props.handleGrafEllerBøkerClick(e.target.id);
    this.setState({ visibilityClassOfMenu: "dropdown-content-invisible" });
  }

  render() {
    var nyeste = ["numberInLine", "button"];
    var tittel = ["title", "button"];
    var forfatter = ["author", "button"];
    var publisert = ["published", "button"];
    var sider = ["pages", "button"];
    var Heidi = ["Heidi", "button"];
    var Ida = ["Ida", "button"];
    var Levin = ["Levin", "button"];
    var Silje = ["Silje", "button"];
    var Øivind = ["Øivind", "button"];
    var buttonlist = [
      nyeste,
      tittel,
      forfatter,
      publisert,
      sider,
      Heidi,
      Ida,
      Levin,
      Silje,
      Øivind
    ];
    buttonlist.forEach(buttonClass => {
      if (buttonClass[0] === this.state.currentlyActive) {
        buttonClass[1] = "button active";
      }
    });

    var sortingArrow = this.props.desc
      ? "fas fa-angle-double-down"
      : "fas fa-angle-double-up";

    return (
      <div className={this.props.myTopnavClass} id="myTopnav">
        <div className="dropdown">
          <button className="dropbtn" onClick={this.handleIconClick}>
            <i className="fa fa-bars" />
          </button>
          <div className={this.state.visibilityClassOfMenu}>
            <button
              className="button"
              id="Grafer"
              onClick={this.handleGrafEllerBøkerClick}
            >
              Grafer
            </button>
            <button
              className="button"
              id="Bøker"
              onClick={this.handleGrafEllerBøkerClick}
            >
              Bøker
            </button>
            <button className="headerbtn">
              Sortering <i className={sortingArrow} />
            </button>
            <button
              id="numberInLine"
              className={nyeste[1]}
              onClick={this.handleSortClick}
            >
              Nyeste
            </button>
            <button
              id="title"
              className={tittel[1]}
              onClick={this.handleSortClick}
            >
              Tittel
            </button>
            <button
              id="author"
              className={forfatter[1]}
              onClick={this.handleSortClick}
            >
              Forfatter
            </button>
            <button
              id="published"
              className={publisert[1]}
              onClick={this.handleSortClick}
            >
              Publisert
            </button>
            <button
              id="Heidi"
              className={Heidi[1]}
              onClick={this.handleSortClick}
            >
              Heidi
            </button>
            <button id="Ida" className={Ida[1]} onClick={this.handleSortClick}>
              Ida
            </button>
            <button
              id="Levin"
              className={Levin[1]}
              onClick={this.handleSortClick}
            >
              Levin
            </button>
            <button
              id="Silje"
              className={Silje[1]}
              onClick={this.handleSortClick}
            >
              Silje
            </button>
            <button
              id="Øivind"
              className={Øivind[1]}
              onClick={this.handleSortClick}
            >
              Øivind
            </button>
            <button
              id="pages"
              className={sider[1]}
              onClick={this.handleSortClick}
            >
              Sider
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Topnav;
