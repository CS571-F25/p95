import React from 'react';

const PRBadge = ({ type = 'default', size = 'medium' }) => {
  const sizes = {
    small: {
      container: {
        padding: '2px 6px',
        fontSize: '10px',
      },
      icon: '12px',
    },
    medium: {
      container: {
        padding: '4px 8px',
        fontSize: '12px',
      },
      icon: '14px',
    },
    large: {
      container: {
        padding: '6px 12px',
        fontSize: '14px',
      },
      icon: '16px',
    },
  };

  const types = {
    default: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
    },
    gold: {
      background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      color: '#000000',
    },
    distance: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
      color: '#ffffff',
    },
    time: {
      background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
      color: '#000000',
    },
    pace: {
      background: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
      color: '#000000',
    },
  };

  const selectedSize = sizes[size];
  const selectedType = types[type];

  const styles = {
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: selectedType.background,
      color: selectedType.color,
      borderRadius: '12px',
      padding: selectedSize.container.padding,
      fontSize: selectedSize.container.fontSize,
      fontWeight: '700',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    icon: {
      fontSize: selectedSize.icon,
      lineHeight: 1,
    },
  };

  return (
    <div style={styles.badge}>
      <span style={styles.icon}>🏆</span>
      <span>PR</span>
    </div>
  );
};

export default PRBadge;