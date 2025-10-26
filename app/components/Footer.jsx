/**
 * Footer component displaying contact information, links, and social media icons
 */
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-top-content">
            <div className="footer-contact">
              <div className="footer-contact">
                <h3>TELEFON</h3>
                <p>+48 511 677 442</p>
              </div>
              <div className="footer-contact">
                <h3>E-MAIL</h3>
                <p>KRZYSZTOF@NGDESIGN.COM</p>
              </div>
            </div>
            <div className="footer-slogan">
              WE CREATE FURNITURE<br />
              YOU DREAM OF.
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            © NG DESIGN {new Date().getFullYear()}
          </div>
          <div className="footer-links">
            <a href="/regulamin">REGULAMIN I POLITYKA PRYWATNOŚCI</a>
            <a href="/dla-architektow">DLA ARCHITEKTÓW</a>
            <a href="/dostawa">DOSTAWA I ZWROTY</a>
          </div>

          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M12 8.4A3.6 3.6 0 0 0 8.4 12a3.6 3.6 0 0 0 3.6 3.6 3.6 3.6 0 0 0 3.6-3.6A3.6 3.6 0 0 0 12 8.4zm0 6a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8zm4.8-6.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0zm2.4.8c0-.8-.2-1.6-.5-2.3A3 3 0 0 0 17 5a4.3 4.3 0 0 0-2.3-.5c-1-.1-3.8-.1-4.8 0-.8 0-1.6.2-2.3.5a3 3 0 0 0-1.7 1.7 4.3 4.3 0 0 0-.5 2.3c-.1 1-.1 3.8 0 4.8 0 .8.2 1.6.5 2.3a3 3 0 0 0 1.7 1.7c.7.3 1.5.5 2.3.5 1 .1 3.8.1 4.8 0 .8 0 1.6-.2 2.3-.5a3 3 0 0 0 1.7-1.7c.3-.7.5-1.5.5-2.3.1-1 .1-3.8 0-4.8zM17.6 16a2.4 2.4 0 0 1-1.4 1.4c-1 .4-3.2.3-4.2.3-1 0-3.3.1-4.2-.3A2.4 2.4 0 0 1 6.4 16c-.4-1-.3-3.2-.3-4.2 0-1-.1-3.3.3-4.2A2.4 2.4 0 0 1 7.8 6.4c1-.4 3.2-.3 4.2-.3 1 0 3.3-.1 4.2.3a2.4 2.4 0 0 1 1.4 1.4c.4 1 .3 3.2.3 4.2 0 1 .1 3.3-.3 4.2z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */

