import { Component } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import Chart from 'react-apexcharts';
import { getAllProductsFetch } from '../../views/view-controllers/OrdersDashboard.view.controller';
import { Button } from '../../components/Button/Button';

const test123babalu = () => getAllProductsFetch;
interface DashboardState {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: number[];
    };
  };
  series: Array<{
    name: string;
    data: number[];
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
class Dashboard extends Component<{}, DashboardState> {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  constructor(props: {}) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'basic-bar',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        },
      },
      series: [
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91, 44],
        },
      ],
    };
  }

  render() {
    return (
      <AdminLayout>
        <div className="app">
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width="500"
              />
            </div>
          </div>
        </div>
        <Button
          label="Novo Produto"
          onClick={test123babalu}
          variant="primary"
        />
      </AdminLayout>
    );
  }
}

export default Dashboard;
