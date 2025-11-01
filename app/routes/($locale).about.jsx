/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'O nas | Hydrogen'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader() {
  // Return minimal data needed for the page
  return {};
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutContent />
    </div>
  );
}

/**
 * Main content section with text and images
 * Layout matches the design: text on left, two images on right (small top, large bottom)
 */
function AboutContent() {
  return (
    <section className="about-content">
      <div className="about-content-container">
        
        {/* Main content block - text left, images right */}
        <div className="about-main-block">
          
          {/* Left side - Text content */}
          <div className="about-text-column">
            <p className="about-paragraph">
              Nasza marka powstała z pasji do nietypowego designu. Meble, 
              które produkujemy, charakteryzują się najwyższą jakością oraz 
              dbałością o szczegóły. Każdy egzemplarz jest ręcznie wykonany 
              w Polsce, a jego projekt odbiega od tradycyjnych podejść do 
              aranżacji wnętrz. Celem naszej firmy jest nadanie każdemu 
              zaprojektowanemu przez nas przedmiotowi unikalnego 
              charakteru, czyniąc go formą samą w sobie.
            </p>
            
            <br />
            <br />
            <br />
            
            <div className="about-contact-info">
              <p className="about-contact-name">Krzysztof Karp</p>
              <p className="about-contact-phone">+48 511 677 442</p>
              <p className="about-contact-email">krzysztof@ngdesign.pl</p>
            </div>
          </div>

          {/* Right side - Images */}
          <div className="about-images-column">
            {/* Small image - left */}
            <div className="about-image-small">
              <img 
                src="https://cdn.shopify.com/s/files/1/0784/6769/4845/files/01_e52c583f-a4fd-4636-b86c-6a615aec2f12.png"
                alt="NG Design - zdjęcie 1"
                className="about-image"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </div>
            
            {/* Large image - right */}
            <div className="about-image-large">
              <img 
                src="https://cdn.shopify.com/s/files/1/0784/6769/4845/files/02.png"
                alt="NG Design - zdjęcie 2"
                className="about-image"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
