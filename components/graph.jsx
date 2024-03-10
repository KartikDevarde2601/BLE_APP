import {useRef, useEffect, useState} from 'react';
import * as echarts from 'echarts/core';
import {Dimensions, StyleSheet, View, Pressable, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {LineChart} from 'echarts/charts';
import {
  TooltipComponent,
  DataZoomComponent,
  LegendComponent,
  TitleComponent,
  GridComponent,
  VisualMapComponent,
} from 'echarts/components';
import {SVGRenderer, SvgChart} from '@wuba/react-native-echarts';

echarts.use([
  VisualMapComponent,
  GridComponent,
  TitleComponent,
  SVGRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
]);

import {setsettingBelt} from '../redux/slices/bluetoothSlice';

const GraphScreen = () => {
  const dispatch = useDispatch();
  const [numPoints, setNumPoints] = useState([]);
  const {collecting} = useSelector(state => state.bluetooth);
  const svgRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const generateData = () => {
      intervalId = setInterval(() => {
        const newData = [];
        for (let i = 0; i < 100; i++) {
          let magnitude = Math.random() * (79 - 77) + 77; // Random magnitude between 77 and 79
          let phase = Math.random() * (-162 - -192) - 192; // Random phase between -192 and -162
          let time = new Date().toLocaleTimeString();
          newData.push({magnitude: magnitude, phase: phase, time: time});
        }
        setNumPoints(newData);
      }, 2000);
    };

    if (collecting) {
      generateData();
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [collecting]);

  useEffect(() => {
    const option = {
      visualMap: [
        {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          min: 0,
          max: 200,
        },
        {
          show: false,
          type: 'continuous',
          seriesIndex: 1,
          dimension: 0,
          min: 0,
          max: numPoints.length - 1,
        },
      ],
      title: [
        {
          left: 'center',
          text: 'Bioimpedance Analysis (BIA) Graph',
        },
        {
          top: '50%',
          left: 'center',
          text: 'PhaseAngle Graph',
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
      xAxis: [
        {
          data: numPoints.map(item => item.time),
        },
        {
          data: numPoints.map(item => item.time),
          gridIndex: 1,
        },
      ],
      yAxis: [
        {},
        {
          gridIndex: 1,
        },
      ],
      grid: [
        {
          bottom: '60%',
        },
        {
          top: '60%',
        },
      ],
      series: [
        {
          type: 'line',
          showSymbol: false,
          data: numPoints.map(item => item.magnitude),
        },
        {
          type: 'line',
          showSymbol: false,
          data: numPoints.map(item => item.phase),
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
      ],
    };

    let chart;

    if (svgRef.current) {
      chart = echarts.init(svgRef.current, 'light', {
        renderer: 'svg',
        width: Dimensions.get('screen').width - 20,
        height: 550,
      });
      chart.setOption(option);
    }

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [numPoints]);

  handleBackToSettingBelt = () => {
    dispatch(setsettingBelt(false));
  };

  return (
    <>
      <View style={styles.container}>
        <SvgChart ref={svgRef} />
      </View>
      <View>
        <Pressable onPress={handleBackToSettingBelt}>
          <Text style={{color: 'blue', fontSize: 16}}>
            GO back to Instruction
          </Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GraphScreen;
