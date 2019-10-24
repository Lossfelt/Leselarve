import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";

class Chart extends React.Component {
  render() {
    var books = this.props.books;
    var bøkene = [];
    var antallSider = [];
    books.forEach(element => {
      bøkene.push(element.title);
      antallSider.push(element.pages);
    });

    var data = {
      labels: [],
      datasets: [
        {
          label: "Antall sider",
          data: []
        }
      ]
    };

    data.labels = bøkene;
    data.datasets[0].data = antallSider;

    return (
      <div>
        <h1>Her kommer grafer</h1>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
    );
  }
}

export default Chart;
