import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Welcome To ProShop';
const DEFAULT_DESCRIPTION = 'We sell the best products for cheap';
const DEFAULT_KEYWORDS = 'electronics, buy electronics, cheap electroincs';

function Meta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
}

export default Meta;