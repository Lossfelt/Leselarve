import React from "react";
import Chart from "react-google-charts";
import { SiderPrMedlem } from "./DataTilGrafer/SiderPrMedlem";
import { BokerPrAarstall } from "./DataTilGrafer/BokerPrAarstall";

/* ideer til grafer:
- terningkast, fra høyest til lavest, inkludert sprik innad
- gjennomsnittlig år den enkelte velger bok fra, inkludert sprik
- terningkast per person
- bok per land, geografisk kart
*/

class Grafer extends React.Component {
  render() {
    var siderPrMedlem = SiderPrMedlem(this.props.books);
    var bokerPrAarstall = BokerPrAarstall(this.props.books);

    return (
      <div>
        <Chart
          chartType="ColumnChart"
          loader={<div>Loading Chart</div>}
          data={siderPrMedlem[0]}
          options={siderPrMedlem[1]}
          legendToggle
        />
        <hr />
        <Chart
          chartType="Histogram"
          loader={<div>Loading Chart</div>}
          data={bokerPrAarstall[0]}
          options={bokerPrAarstall[1]}
          legendToggle
        />
      </div>
    );
  }
}

export default Grafer;
