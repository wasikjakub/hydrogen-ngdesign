import {PageLayout} from '~/components/PageLayout';

export default function RegulaminPage() {
  return (
    <PageLayout>
      <div className="regulamin-page">
        <div className="regulamin-content">
          {/* Place your content here */}
          <div className="placeholder-text">
            [MIEJSCE NA TREŚĆ REGULAMINU I POLITYKI PRYWATNOŚCI]
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export function meta() {
  return [
    {title: 'Regulamin i Polityka Prywatności | NG Design'},
    {description: 'Regulamin i polityka prywatności NG Design'},
  ];
}