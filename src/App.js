import React, { useState } from 'react';
import InputTab from './components/InputTab';
import AstrologyChart from './components/AstrologyChart';
import AnimationControl from './components/AnimationControl';
import LoadingScreen from './components/LoadingScreen';
import { calculateChart } from './utils/chartCalculator';

export default function App() {
  const [chartData, setChartData] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isInputTabVisible, setInputTabVisibility] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (data) => {
    setInputTabVisibility(false); // Hide InputTab on submit
    setIsLoading(true); // Start loading
    setChartData(null); // Clear existing chart data

    setTimeout(() => {
      const chart = calculateChart(data.birthTime, data.location);
      setChartData(chart);
      setIsLoading(false); // Stop loading after chart calculation and 3 seconds
    }, 3000); // Minimum 3 seconds of loading

  };

  const toggleInputTab = () => {
    setInputTabVisibility(!isInputTabVisible);
  };
  const handleAnimate = (planet) => {
    setSelectedPlanet(planet);
  };

  return (
    <div>
      {isLoading && <LoadingScreen />}
      <InputTab onSubmit={handleSubmit} isVisible={isInputTabVisible} onToggle={toggleInputTab} />
      {chartData && <AstrologyChart chartData={chartData} />}
      <AnimationControl onAnimate={handleAnimate} />
    </div>
  );
}
