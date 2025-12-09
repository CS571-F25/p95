const Weather = ({ 
  average_temp,
  size = 'small',
}) => {
  // Convert Celsius to Fahrenheit
  const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  // Determine weather icon based on temperature
  const getWeatherIcon = (tempC) => {
    if (tempC < 0) return '❄️';
    if (tempC < 10) return '🥶';
    if (tempC < 15) return '😬';
    if (tempC < 20) return '😊';
    if (tempC < 25) return '☀️';
    if (tempC < 30) return '🌡️';
    return '🔥';
  };

  if (!average_temp && average_temp !== 0) {
    return null;
  }

  const tempF = celsiusToFahrenheit(average_temp);
  const icon = getWeatherIcon(average_temp);

  const styles = {
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: size === 'small' ? '4px 8px' : '6px 10px',
      background: 'linear-gradient(135deg, rgba(135, 206, 250, 0.15) 0%, rgba(100, 149, 237, 0.15) 100%)',
      borderRadius: '8px',
      border: '1px solid rgba(135, 206, 250, 0.3)',
      fontSize: size === 'small' ? '12px' : '14px',
      fontWeight: '600',
      color: '#1a1a1a',
      whiteSpace: 'nowrap',
    },
    icon: {
      fontSize: size === 'small' ? '14px' : '16px',
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.container}>
      <span style={styles.icon}>{icon}</span>
      <span>{tempF}°F</span>
    </div>
  );
};

export default Weather;