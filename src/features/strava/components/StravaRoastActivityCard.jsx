import StravaActivityRoast from "./StravaActivityRoast";
import { formatTime, formatDistance, getPace } from '../../../utils'
import Weather from "../../../components/Weather";
import PRBadge from "../../../components/PRBadge";

export default function StravaRoastActivityCard(props) {
    return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.cardHeaderTop}>
          <div style={{ flex: 1 }}>
            <h2 style={styles.activityName}>{props.name}</h2>
            <div style={styles.dateContainer}>
              <span style={styles.dateText}>{ new Date (props.start_date).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {props.average_temp && <Weather average_temp={props.average_temp} />}
            <div style={styles.typeBadge}>{props.type}</div>
            {props.isPR && <PRBadge type="gold" size="small" />}
          </div>
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statsGrid}>
            {props.distance ? <div style={styles.statBox}>
            <div style={styles.statValue}>
              {formatDistance(props.distance)}
            </div>
            <div style={styles.statLabel}>
              Distance
            </div>
          </div> : <></>}
          <div style={styles.statBox}>
            <div style={styles.statValue}>
              🕐 {formatTime(props.moving_time)}
            </div>
            <div style={styles.statLabel}>
              Time
            </div>
          </div>
          {props.distance > 0 ? <div style={styles.statBox}>
            <div style={styles.statValue}>
              📈 {getPace(props.distance, props.moving_time)}
            </div>
            <div style={styles.statLabel}>
              Avg Pace
            </div>
          </div> : <></> }
        </div>

        <StravaActivityRoast {...props} />
      </div>
    </div>
  );
}

const isMobile = window.innerWidth <= 768;

const styles = {
  card: {
    maxWidth: isMobile ? '100%' : '50%',
    width: '100%',
    margin: '0 bottom',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '24px'
  },
  cardHeader: {
    background: 'linear-gradient(to right, #f97316, #ef4444)',
    padding: '20px',
    color: 'white'
  },
  cardHeaderTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  activityName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fed7aa'
  },
  dateText: {
    fontSize: '14px'
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(4px)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  statsContainer: {
    padding: '24px'
  },
  statsGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  statBox: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  },
  statValueSmall: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }
};