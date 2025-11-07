import {NavLink, useLocation} from 'react-router';
import {useAside} from '~/components/Aside';
import {useState, useEffect} from 'react';
import logoWhiteUrl from '../assets/logo-white.png';
import logoDarkUrl from '../assets/logo.png';

/**
 * @param {HeaderProps}
 */
export function Header({header}) {
  const {shop, collections} = header;
  const location = useLocation();
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = location.pathname;
  const isProductPage = pathname.includes('/products/');
  const isContactPage = pathname.includes('/contact');
  
  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Determine if we should use dark theme (white background, black logo)
  const isDarkTheme = pathname.includes('/about') ||
                      pathname.includes('/collections') ||
                      pathname.includes('/regulamin') ||
                      isContactPage ||
                      isProductPage;
  
  // Use dark logo on pages with white background or when scrolled
  const logoUrl = (isDarkTheme || isScrolled) ? logoDarkUrl : logoWhiteUrl;
  
  // Add special class for different pages
  let headerClass = 'header';
  if (isContactPage) {
    headerClass = 'header header-contact';
  } else if (isProductPage) {
    headerClass = 'header header-product';
  }
  
  // Add scrolled class
  if (isScrolled) {
    headerClass += ' header-scrolled';
  }
  
  // Determine background color based on page and scroll state
  let backgroundColor = 'transparent';
  if (isProductPage) {
    backgroundColor = '#FAFAF8'; // Always white on product pages
  } else if (isScrolled) {
    backgroundColor = '#FAFAF8'; // White when scrolled on other pages
  }
  
  const headerStyle = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    right: '0px',
    zIndex: 9999,
    width: '100%',
    backgroundColor,
    transition: 'background-color 0.3s ease'
  };

  return (
    <header
      className={headerClass}
      data-page={isProductPage ? 'product' : undefined}
      style={headerStyle}
    >
      <nav className="header-left-nav">
        <div className="nav-dropdown">
          <NavLink prefetch="intent" to="/collections" className="nav-link">
            Sklep
          </NavLink>
          <button 
            className="dropdown-arrow"
            onMouseEnter={() => setIsShopDropdownOpen(true)}
            onMouseLeave={() => setIsShopDropdownOpen(false)}
          >
            ▼
          </button>
          {isShopDropdownOpen && collections?.nodes && collections.nodes.length > 0 && (
            <div 
              className="dropdown-menu"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <NavLink 
                prefetch="intent" 
                to="/collections" 
                className="dropdown-item"
              >
                Wszystkie produkty
              </NavLink>
              {collections.nodes.map((collection) => (
                <NavLink
                  key={collection.id}
                  prefetch="intent"
                  to={`/collections/${collection.handle}`}
                  className="dropdown-item"
                >
                  {collection.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <NavLink prefetch="intent" to="/about" className="nav-link">
          O Nas
        </NavLink>
        <NavLink prefetch="intent" to="/contact" className="nav-link">
          Kontakt
        </NavLink>
      </nav>

      <div className="header-logo">
        <NavLink prefetch="intent" to="/">
          <img src={logoUrl} alt={shop?.name || 'NG Design'} className="site-logo" />
        </NavLink>
      </div>

      <div className="header-right">
        <button className="language-toggle">EN | PL</button>
        {/* Cart toggle hidden for now per request */}
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/** Header CTAs were removed; Cart toggle is used directly in the Header component. */

// Mobile toggle and search toggle were removed because header layout uses simplified controls.

/**
 * @param {{count: number | null}}
 */
/* Cart UI (badge/toggle) removed from header per request. */

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
