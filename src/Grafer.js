import React from "react";
import Chart from "react-google-charts";
import { SiderPrMedlem } from "./DataTilGrafer/SiderPrMedlem";
import { BokerPrAarstall } from "./DataTilGrafer/BokerPrAarstall";
import { BokerPrLand } from "./DataTilGrafer/BokerPrLand";
import { TerningkastPrBok } from "./DataTilGrafer/TerningkastPrBok";

/* ideer til grafer:
- gjennomsnittlig år den enkelte velger bok fra, inkludert sprik
- terningkast per person
- ikke en graf, men mulight til å sortere på terningkast
*/

class Grafer extends React.Component {
  render() {
    var siderPrMedlem = SiderPrMedlem(this.props.books);
    var bokerPrAarstall = BokerPrAarstall(this.props.books);
    var bokerPrLand = BokerPrLand(this.props.books);
    var terningkastPrBok = TerningkastPrBok(this.props.books);

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
        <Chart
          width={"100%"}
          height={"300px"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={terningkastPrBok[0]}
          options={terningkastPrBok[1]}
          rootProps={{ "data-testid": "5" }}
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
