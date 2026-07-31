import styles from "./LeafywebBrandBackground.module.css";

type Stage = "home" | "order" | "success" | "website";

interface Props {
  stage: Stage;
}

const particles = [
  { top: "12%", left: "18%", duration: "14s", delay: "0s", scale: 0.85 },
  { top: "14%", left: "40%", duration: "10s", delay: "0.4s", scale: 1.05 },
  { top: "27%", left: "78%", duration: "16s", delay: "0.8s", scale: 0.92 },
  { top: "41%", left: "12%", duration: "12.5s", delay: "1.1s", scale: 0.78 },
  { top: "52%", left: "28%", duration: "18s", delay: "1.4s", scale: 1.0 },
  { top: "62%", left: "55%", duration: "13.5s", delay: "1.7s", scale: 0.88 },
  { top: "73%", left: "72%", duration: "20s", delay: "2s", scale: 1.08 },
  { top: "82%", left: "35%", duration: "11.5s", delay: "2.3s", scale: 0.72 },
  { top: "68%", left: "12%", duration: "17s", delay: "2.6s", scale: 0.96 },
  { top: "22%", left: "64%", duration: "15.2s", delay: "2.9s", scale: 0.9 },
];

const trails = [
  { top: "32%", left: "8%", width: "18%", delay: "0.3s", duration: "4.4s" },
  { top: "50%", left: "30%", width: "22%", delay: "0.7s", duration: "5s" },
  { top: "62%", right: "20%", width: "16%", delay: "1s", duration: "4.8s" },
];

const pulses = [
  { top: "18%", right: "14%", size: "108px", delay: "0s", duration: "8.5s" },
  { bottom: "12%", left: "14%", size: "120px", delay: "2.2s", duration: "9.2s" },
];

export default function LeafywebBrandBackground({ stage }: Props) {
  const stageClass = styles[`stage-${stage}`];

  return (
    <div className={`${styles["leafyweb-brand-bg"]} ${stageClass}`} aria-hidden="true">
      <div className={styles["leafyweb-brand-bg__grid"]} />
      <div className={styles["leafyweb-brand-bg__halo"]} />

      <div className={styles["leafyweb-brand-bg__pulses"]}>
        {pulses.map((pulse, index) => (
          <span
            key={index}
            className={styles["leafyweb-brand-bg__pulse"]}
            style={{
              top: pulse.top,
              right: pulse.right,
              bottom: pulse.bottom,
              left: pulse.left,
              width: pulse.size,
              height: pulse.size,
              animationDelay: pulse.delay,
              animationDuration: pulse.duration,
            }}
          />
        ))}
      </div>

      <div className={styles["leafyweb-brand-bg__trails"]}>
        {trails.map((trail, index) => (
          <span
            key={index}
            className={styles["leafyweb-brand-bg__trail"]}
            style={{
              top: trail.top,
              left: trail.left,
              right: trail.right,
              width: trail.width,
              animationDelay: trail.delay,
              animationDuration: trail.duration,
            }}
          />
        ))}
      </div>

      <div className={styles["leafyweb-brand-bg__lines"]}>
        <span className={`${styles["leafyweb-brand-bg__line"]} ${styles["line-1"]}`} />
        <span className={`${styles["leafyweb-brand-bg__line"]} ${styles["line-2"]}`} />
        <span className={`${styles["leafyweb-brand-bg__line"]} ${styles["line-3"]}`} />
        <span className={`${styles["leafyweb-brand-bg__line"]} ${styles["line-4"]}`} />
      </div>

      <div className={styles["leafyweb-brand-bg__nodes"]}>
        <span className={`${styles["leafyweb-brand-bg__node"]} ${styles["node-1"]}`} />
        <span className={`${styles["leafyweb-brand-bg__node"]} ${styles["node-2"]}`} />
        <span className={`${styles["leafyweb-brand-bg__node"]} ${styles["node-3"]}`} />
        <span className={`${styles["leafyweb-brand-bg__node"]} ${styles["node-4"]}`} />
        <span className={`${styles["leafyweb-brand-bg__node"]} ${styles["node-center"]}`} />
      </div>

      <div className={styles["leafyweb-brand-bg__particles"]}>
        {particles.map((particle, index) => (
          <span
            key={index}
            className={styles["leafyweb-brand-bg__particle"]}
            style={{
              top: particle.top,
              left: particle.left,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
              transform: `scale(${particle.scale})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
