import React, { useMemo } from 'react'
import {
  VictoryGroup,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryLegend,
  VictoryChart
} from 'victory'
import { rounded } from '../../../utility'


function ProgressChart(props) {
  const { showLegend, chartData, qTypes, metric } = props
  const data = chartData.chartData.data[metric]
  const domainMaxY = metric === 'attempts' ? chartData.chartData.domainMaxYAtt : chartData.chartData.domainMaxYTime
  const yLabel = metric === 'attempts' ? '# ATTEMPTS' : 'TIME (secs)'
  const labelsX = chartData.chartData.labelsX
  // const colorScale = ['#b7b8bc', '#898a8d', '#9fbfdf', '#6699cc', '#5b5c5e', '#26AD5E']
  const colorScale = metric === 'attempts' ? chartData.chartData.colorScaleAtt : chartData.chartData.colorScaleTime
  //not sure useMemo helps here because data will always be different because object identity??
  const chartLines = useMemo(() => {
    return qTypes.map( type => {
      return (
        <VictoryGroup
          data={data[type]}
          key={type}
          >
          <VictoryLine/>
          <VictoryScatter/>
        </VictoryGroup>
      )
    })
  }, [qTypes, data])
  return (
    <VictoryChart domainPadding={{x: 0}} style={{parent: {maxHeight: '40%'}}}>
      {showLegend && <VictoryLegend x={75} y={0}
        orientation="horizontal"
        gutter={20}
        style={{ border: { stroke: "black"}, flexShrink:1} }
        data={chartData.chartData.legend}
        colorScale={colorScale}
        />}
      <VictoryAxis
        style={{axisLabel: {fontFamily: "'Thintel', monospace", fontSize: 28, padding: 18}, tickLabels: {fontFamily: "'Thintel', monospace", fontSize: 22, padding: 5}}}
        tickValues={labelsX}
        tickFormat={(t) => `${Math.round(t)}`}
        label={'ROUNDS'}
        />
      <VictoryAxis
        dependentAxis
        label={yLabel}
        style={{axisLabel: {fontFamily: "'Thintel', monospace", fontSize: 28, padding: 30}, tickLabels: {fontFamily: "'Thintel', monospace", fontSize: 22, padding: 5}}}
        domain={{y: [0, domainMaxY]}}
        tickFormat={(t) => rounded(t, 2)}
        />
      <VictoryGroup offset={20} colorScale={colorScale}>
        {chartLines}
      </VictoryGroup>
    </VictoryChart>
  )
}

export default React.memo(ProgressChart)
