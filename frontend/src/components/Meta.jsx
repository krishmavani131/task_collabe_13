 import { Helmet } from 'react-helmet-async';

const Meta = ({
  title,
  description,
  keywords,
}) => {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>

      <meta
        name='description'
        content={description}
      />

      <meta
        name='keywords'
        content={keywords}
      />

      <meta
        name='author'
        content='Your Store'
      />

      {/* Open Graph */}
      <meta
        property='og:title'
        content={title}
      />

      <meta
        property='og:description'
        content={description}
      />

      <meta
        property='og:type'
        content='website'
      />

      {/* Mobile */}
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1'
      />

      <meta
        name='theme-color'
        content='#0d6efd'
      />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'ShopSphere | Premium Online Store',

  description:
    'Discover premium electronics, fashion, accessories, and more with fast delivery and secure checkout.',

  keywords:
    'online shopping, electronics, fashion, accessories, ecommerce, buy online, premium store',
};

export default Meta;
