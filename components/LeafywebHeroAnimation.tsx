import styles from "./LeafywebHeroAnimation.module.css";

const nodes = [
  { top: "18%", left: "18%", delay: "0.35s" },
  { top: "22%", left: "66%", delay: "0.75s" },
  { top: "48%", left: "14%", delay: "1.05s" },
  { top: "64%", left: "68%", delay: "1.25s" },
  { top: "38%", left: "41%", delay: "0.95s" },
];

const modules = [
  { top: "8%", left: "10%", width: "94px", height: "60px", delay: "1.65s", floatOffset: "0s" },
  { top: "16%", right: "10%", width: "110px", height: "66px", delay: "1.95s", floatOffset: "1.1s" },
  { bottom: "18%", left: "12%", width: "94px", height: "52px", delay: "2.2s", floatOffset: "0.6s" },
  { bottom: "14%", right: "14%", width: "114px", height: "58px", delay: "2.4s", floatOffset: "0.9s" },
];

const lines = [
  { top: "24%", left: "22%", width: "28%", rotate: "8deg", delay: "1.1s", pulseDelay: "1.5s", pulseDuration: "3.2s" },
  { top: "42%", left: "20%", width: "34%", rotate: "-8deg", delay: "1.3s", pulseDelay: "1.7s", pulseDuration: "3.4s" },
  { top: "32%", left: "50%", width: "24%", rotate: "14deg", delay: "1.45s", pulseDelay: "1.85s", pulseDuration: "3.1s" },
  { top: "52%", left: "54%", width: "30%", rotate: "-10deg", delay: "1.55s", pulseDelay: "1.95s", pulseDuration: "3.6s" },
];

const centerSegments = [
  { transform: "translate(-55%, -42%) rotate(-26deg)", delay: "2.35s", width: "92px", height: "30px" },
  { transform: "translate(6%, -42%) rotate(26deg)", delay: "2.45s", width: "92px", height: "30px" },
  { transform: "translate(-24%, -2%) rotate(-10deg)", delay: "2.55s", width: "68px", height: "22px" },
  { transform: "translate(18%, 6%) rotate(10deg)", delay: "2.65s", width: "68px", height: "22px" },
  { transform: "translate(-4%, 30%) rotate(0deg)", delay: "2.75s", width: "52px", height: "18px" },
];

const energyDots = [
  { top: "22%", left: "24%", delay: "2.5s", duration: "3.8s" },
  { top: "44%", left: "24%", delay: "2.75s", duration: "4.2s" },
  { top: "34%", left: "54%", delay: "2.95s", duration: "3.9s" },
  { top: "60%", left: "66%", delay: "3.15s", duration: "4.4s" },
];

export default function LeafywebHeroAnimation() {
  return (
    <div className={styles.heroVisual} aria-hidden="true">
      <div className={styles.backgroundGlow} />
      <div className={styles.vignette} />
      <div className={styles.grid} />
      <div className={styles.lightSweep} />

      <div className={styles.lines}>
        {lines.map((line, index) => (
          <span
            key={index}
            className={styles.lineWrapper}
            style={{
              top: line.top,
              left: line.left,
              width: line.width,
              transform: `rotate(${line.rotate})`,
            }}
          >
            <span
              className={styles.line}
              style={{ animationDelay: line.delay }}
            />
            <span
              className={styles.linePulse}
              style={{
                animationDelay: line.pulseDelay,
                animationDuration: line.pulseDuration,
              }}
            />
          </span>
        ))}
      </div>

      <div className={styles.modules}>
        {modules.map((module, index) => (
          <div
            key={index}
            className={styles.module}
            style={{
              top: module.top,
              left: module.left,
              right: module.right,
              bottom: module.bottom,
              width: module.width,
              height: module.height,
              animationDelay: module.delay,
              animationDuration: `12s, 0.9s`,
            }}
          >
            <span className={styles.moduleGlow} />
            <span className={styles.moduleHeader} />
            <span className={styles.moduleRow} />
            <span className={styles.moduleRowSmall} />
          </div>
        ))}
      </div>

      <div className={styles.nodes}>
        {nodes.map((node, index) => (
          <span
            key={index}
            className={styles.node}
            style={{
              top: node.top,
              left: node.left,
              animationDelay: node.delay,
            }}
          />
        ))}
      </div>

      <div className={styles.center}>
        <span className={styles.centerHalo} />
        <span className={styles.centerCore} />
        {centerSegments.map((segment, index) => (
          <span
            key={index}
            className={styles.centerSegment}
            style={{
              transform: segment.transform,
              width: segment.width,
              height: segment.height,
              animationDelay: segment.delay,
            }}
          />
        ))}
      </div>

      <div className={styles.energy}>
        {energyDots.map((dot, index) => (
          <span
            key={index}
            className={styles.energyDot}
            style={{
              top: dot.top,
              left: dot.left,
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
