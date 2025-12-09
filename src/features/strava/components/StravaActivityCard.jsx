import PRBadge from '../../../components/PRBadge';
import { formatTime, formatDistance } from '../../../utils'

export default function StravaActivityCard(props) {
  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          {props.name}
          {props.isPR && <PRBadge type="gold" size="small" />}
        </h2>
        <div style={{ fontSize: '0.75em', opacity: 0.9 }}>
          {new Date(props.start_date).toLocaleDateString()} • {props.type}
        </div>
      </div>

      {/* Body */}
      <div style={styles.cardBody}>
        <div style={styles.statRow}>
          {props.distance ? (
            <div style={styles.statBox}>
              <div style={styles.statValue}>
                {formatDistance(props.distance)}
              </div>
              <div style={styles.statLabel}>
                Distance
              </div>
            </div>
          ) : null}

          <div style={styles.statBox}>
            <div style={styles.statValue}>
              {formatTime(props.moving_time)}
            </div>
            <div style={styles.statLabel}>
              Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        marginBottom: '16px',
        transition: 'transform 0.2s, box-shadow 0.2s'
    },
    cardHeader: {
        background: 'linear-gradient(to right, #f97316, #ef4444)',
        padding: '12px 16px',
        color: 'white'
    },
    cardTitle: {
        fontSize: '1em',
        fontWeight: 'bold',
        margin: 0
    },
    cardBody: {
        padding: '1em'
    },
    statRow: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '1em'
    },
    statBox: {
        flex: 1,
        textAlign: 'center'
    },
    statValue: {
        fontSize: '0.75em',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '4px'
    },
    statLabel: {
        fontSize: '0.75em',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    }
};