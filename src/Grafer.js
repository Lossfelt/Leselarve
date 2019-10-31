import React from "react";
import Chart from "react-google-charts";
import { SiderPrMedlem } from "./DataTilGrafer/SiderPrMedlem";

/* ideer til grafer:
terningkast, fra høyest til lavest, inkludert sprik innad
gjennomsnittlig år den enkelte velger bok fra, inkludert sprik
terningkast per person
bok per land, geografisk kart
antall bøker per år, et histogram
*/

class Grafer extends React.Component {
  render() {
    var siderPrMedlem = SiderPrMedlem(this.props.books);

    return (
      <div>
        <h1>Dette er Google Charts</h1>

        <Chart
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={siderPrMedlem[0]}
          options={siderPrMedlem[1]}
          legendToggle
        />
      </div>
    );
  }
}

export default Grafer;
