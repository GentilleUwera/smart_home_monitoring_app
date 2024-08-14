import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import { useStepContext } from '../context/StepContext';

const screenWidth = Dimensions.get('window').width;

const Chart = () => {
  const { stepCounts } = useStepContext();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxSteps = Math.max(...stepCounts);

  const lineChartData = {
    labels: days,
    datasets: [
      {
        data: stepCounts.length ? stepCounts : [0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const progressChartData = {
    labels: days,
    data: stepCounts.length ? stepCounts.map(steps => steps / (maxSteps || 1)) : [0],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ff7e5f', // Orange gradient start color
    backgroundGradientTo: '#feb47b', // Orange gradient end color
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White color for chart lines
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const totalSteps = stepCounts.reduce((a, b) => a + b, 0);
  const bestDay = Math.max(...stepCounts);
  const dailyAverage = Math.round(totalSteps / 7);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Weekly Step Progress</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalSteps}</Text>
          </View>
          <Text style={styles.statLabel}>Total Steps</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{bestDay}</Text>
          </View>
          <Text style={styles.statLabel}>Best Day</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{dailyAverage}</Text>
          </View>
          <Text style={styles.statLabel}>Daily Average</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={lineChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
        
        <ProgressChart
          data={progressChartData}
          width={screenWidth - 40}
          height={220}
          strokeWidth={16}
          radius={32}
          chartConfig={chartConfig}
          hideLegend={false}
          style={styles.chart}
        />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  chartContainer: {
    width: '100', // Ensures the charts fit the container width
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statBox: {
    backgroundColor: '#ff7e5f', // Orange gradient background
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // White text color
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
});

export default Chart;
