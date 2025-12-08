export default function ParagraphBlock({ paragraphs = [] }) {
  return paragraphs.map((text, idx) => <p key={idx}>{text}</p>);
}