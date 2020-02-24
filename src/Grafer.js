import React from "react";
import Chart from "react-google-charts";
import { SiderPrMedlem } from "./DataTilGrafer/SiderPrMedlem";
import { BokerPrAarstall } from "./DataTilGrafer/BokerPrAarstall";
import { BokerPrLand } from "./DataTilGrafer/BokerPrLand";

/* ideer til grafer:
- terningkast, fra høyest til lavest, inkludert sprik innad
- gjennomsnittlig år den enkelte velger bok fra, inkludert sprik
- terningkast per person
- ikke en graf, men mulight til å sortere på terningkast
*/

class Grafer extends React.Component {
  render() {
    var siderPrMedlem = SiderPrMedlem(this.props.books);
    var bokerPrAarstall = BokerPrAarstall(this.props.books);
    var bokerPrLand = BokerPrLand(this.props.books);

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
        <hr />
        <h5 align="center">Bøker pr land</h5>
        <Chart
          chartType="GeoChart"
          data={bokerPrLand[0]}
          options={bokerPrLand[1]}
          mapsApiKey="AIzaSyCy8HEF8HJnKpwk2yU2N27lumj1XVym-R4"
        />
      </div>
    );
  }
}

export default Grafer;
