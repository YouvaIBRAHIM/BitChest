import { useTheme } from '@emotion/react';
import { useMemo } from 'react';
import ReactApexChart from "react-apexcharts";
import colors from "../../services/Tailwind.service";
import { Card } from '@mui/material';

const PieChart = ({ data, labels }) => {  
  const theme = useTheme();

  const chart = useMemo(() => {
    if (data) {  
      const series = data;
      
      const options = {
        chart: {
          width: 380,
          type: 'pie',
          background: "transparent",

        },
        labels: labels,
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name]
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom'
            }
          }
        }],
        theme: {
          mode: theme.palette.mode,
          monochrome: {
            enabled: true,
            color: colors.green[600],
          }
        }
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
  }, [data, theme])

  return (
    <Card id="chart" className='w-full'>
      {
        data &&
        <ReactApexChart 
          options={chart.options} 
          series={chart.series} type="pie" 
        />
      }
    </Card>
  );
}

export default PieChart;