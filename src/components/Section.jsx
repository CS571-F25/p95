export default function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}