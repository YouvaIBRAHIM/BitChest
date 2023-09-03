import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import ReactApexChart from "react-apexcharts";
import colors from "../../services/Tailwind.service";
import { Card } from '@mui/material';

const LineChart = ({ data }) => {  
  const theme = useTheme();

  const chart = useMemo(() => {
    if (data) {
      const dataLength = data.length;
      const lastValue = data[dataLength - 1][1];
  
      const series = [{
        color: colors.green[400],
        data: data
      }];
      
      const options = {
        chart: {
          id: 'area-datetime',
          type: 'area',
          zoom: {
            autoScaleYaxis: false
          },
          background: "transparent",
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
  
        },
        annotations: {
          yaxis: [
            {
              y: lastValue + (lastValue * 0.02),
              borderColor: '#00E396',
              label: {
                borderColor: 'none',
                style: {
                  color: '#fff',
                  background: colors.green[500],
                  fontSize: 24,
                },
                text: `${lastValue?.toFixed(2)}€`
              }
            }
          ]
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0,
          style: 'hollow',
        },
        xaxis: {
          type: 'datetime',
          tickAmount: 6,
        },
        yaxis: {
          show: false
        },
        tooltip: {
          x: {
            format: 'dd MMM yyyy'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.9,
            opacityTo: 0.9,
            stops: [0, 100]
          },
          colors: [colors.green[700], colors.green[600], colors.green[500], colors.green[400], colors.green[50]]
        },
        theme: {
          mode: theme.palette.mode,
        },
  
      }
  
      return {
        series,
        options
      }
    }
    return {
      series: [],
      options: {}
    }
  }, [data])

  return (
    <Card id="chart" className='w-full'>
      {
        data &&
        <ReactApexChart options={chart.options} series={chart.series} type="area" />
      }
    </Card>
  );
}

export default LineChart;