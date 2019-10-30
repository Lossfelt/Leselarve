import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
/* ideer til grafer:
terningkast, fra høyest til lavest, inkludert sprik innad
gjennomsnittlig år den enkelte velger bok fra, inkludert sprik
terningkast per person
bok per land, geografisk kart
*/
class Chart extends React.Component {
  render() {
    var books = this.props.books;
    var siderPrMedlem = [
      {
        Navn: "Levin",
        totaltSider: 0,
        antallBøker: 0,
        gjennomsnittligAntallSider: 0
      },
      {
        Navn: "Øivind",
        totaltSider: 0,
        antallBøker: 0,
        gjennomsnittligAntallSider: 0
      },
      {
        Navn: "Silje",
        totaltSider: 0,
        antallBøker: 0,
        gjennomsnittligAntallSider: 0
      },
      {
        Navn: "Ida",
        totaltSider: 0,
        antallBøker: 0,
        gjennomsnittligAntallSider: 0
      },
      {
        Navn: "Heidi",
        totaltSider: 0,
        antallBøker: 0,
        gjennomsnittligAntallSider: 0
      }
    ];

    books.forEach(element => {
      siderPrMedlem.forEach(medlem => {
        if (element.chosenBy === medlem.Navn) {
          medlem.totaltSider += element.pages;
          medlem.antallBøker += 1;
        }
      });
    });
    siderPrMedlem.forEach(entry => {
      entry.gjennomsnittligAntallSider = Math.floor(
        entry.totaltSider / entry.antallBøker
      );
    });
    //console.log(siderPrMedlem);

    var data = {
      labels: [],
      datasets: [
        {
          label: "Gjennomsnittlig antall sider",
          data: []
        }
      ]
    };

    siderPrMedlem.forEach(entry => {
      data.labels.push(entry.Navn);
      data.datasets[0].data.push(entry.gjennomsnittligAntallSider);
    });

    return (
      <div>
        <h1>Her kommer grafer</h1>
        <Bar data={data} options={{ maintainAspectRatio: false }} />
      </div>
    );
  }
}

export default Chart;
