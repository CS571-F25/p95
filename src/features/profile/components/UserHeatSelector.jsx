import { useEffect, useState } from "react";

export default function UserHeatSelector() {
  const DEFAULT_HEAT_LEVEL = 3;
  const heatLevels = [1, 2, 3, 4, 5];

  const [heatLevel, setHeatLevel] = useState(DEFAULT_HEAT_LEVEL);

  useEffect(() => {
    const stored = localStorage.getItem("heatLevel");

    if (stored) {
      setHeatLevel(Number(stored));
    } else {
      localStorage.setItem("heatLevel", DEFAULT_HEAT_LEVEL);
    }
  }, []);

  function UpdateHeatLevel(newHeatLevel) {
    localStorage.setItem("heatLevel", newHeatLevel);
    setHeatLevel(newHeatLevel);
    removeRoastsWithWrongHeat();
  }

  function removeRoastsWithWrongHeat() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                
                // Removes expired roasts 30 days or older since they are unlikely to be used again
                if (key && key.startsWith('strava_roast_') || key.startsWith('strava_week_roast_')) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            if (keysToRemove.length > 0) {
                console.log(`Cleaned up ${keysToRemove.length} expired roast(s) from cache`);
            }
        } catch (err) {
            console.error('Error cleaning up expired cache:', err);
        }
    }

  return (
  <div className="text-center">
    <h5 className="mb-3">Heat Level</h5>
    <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "0.5rem" }}>
      {heatLevels.map((number) => (
        <button
          key={number}
          onClick={() => UpdateHeatLevel(number)}
          style={{
            width: 45,
            height: 45,
            fontWeight: "600",
            fontSize: "16px",
            backgroundColor: number === heatLevel ? "#FC4C02" : "transparent",
            border: "2px solid #FC4C02",
            color: number === heatLevel ? "#FFFFFF" : "#FC4C02",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (number !== heatLevel) {
              e.currentTarget.style.backgroundColor = "#FC4C0220";
            }
          }}
          onMouseLeave={(e) => {
            if (number !== heatLevel) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {number}
        </button>
      ))}
    </div>

    <div className="mt-2">
      Selected: <strong>{heatLevel}</strong> 🔥
    </div>
  </div>
);
}