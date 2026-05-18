import { Chart } from "react-google-charts";
import { SiderPrMedlem } from "./DataTilGrafer/SiderPrMedlem.js";
import { BokerPrAarstall } from "./DataTilGrafer/BokerPrAarstall.js";
import { BokerPrLand } from "./DataTilGrafer/BokerPrLand.js";
import { TerningkastPrBok } from "./DataTilGrafer/TerningkastPrBok.js";
import { TerningkastPrMedlem } from "./DataTilGrafer/TerningkastPrMedlem.js";

const LOADER = <div>Laster graf …</div>;

export default function Grafer({ books }) {
  const [siderData, siderOpts] = SiderPrMedlem(books);
  const [aarData, aarOpts] = BokerPrAarstall(books);
  const [landData, landOpts] = BokerPrLand(books);
  const [terningBokData, terningBokOpts] = TerningkastPrBok(books);
  const [terningMedlemData, terningMedlemOpts] = TerningkastPrMedlem(books);

  return (
    <div>
      <Chart
        chartType="ColumnChart"
        loader={LOADER}
        data={siderData}
        options={siderOpts}
        legendToggle
      />
      <hr />
      <Chart
        chartType="Histogram"
        loader={LOADER}
        data={aarData}
        options={aarOpts}
        legendToggle
      />
      <hr />
      <Chart
        width="100%"
        height="300px"
        chartType="ColumnChart"
        loader={LOADER}
        data={terningMedlemData}
        options={terningMedlemOpts}
      />
      <hr />
      <Chart
        width="100%"
        height="300px"
        chartType="LineChart"
        loader={LOADER}
        data={terningBokData}
        options={terningBokOpts}
      />
      <hr />
      <h5 style={{ textAlign: "center" }}>Bøker pr land</h5>
      <Chart
        chartType="GeoChart"
        data={landData}
        options={landOpts}
        mapsApiKey="AIzaSyCy8HEF8HJnKpwk2yU2N27lumj1XVym-R4"
      />
    </div>
  );
}
