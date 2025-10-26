import regulaminHtml from "../assets/regulamin.html?raw";

export default function RegulaminPage() {
  return (
    <div className="regulamin-page">
      <div
        className="regulamin-content"
        dangerouslySetInnerHTML={{ __html: regulaminHtml }}
      />
    </div>
  );
}

export function meta() {
  return [
    { title: 'Regulamin i Polityka Prywatności | NG Design' },
    { description: 'Regulamin i polityka prywatności NG Design' },
  ];
}