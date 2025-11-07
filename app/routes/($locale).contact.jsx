import {useLoaderData} from 'react-router';
import {useState} from 'react';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Kontakt | NG Design'}];
};

/**
 * Form submission handler - Client-side submission to Web3Forms
 * 
 * @param {Route.ActionArgs}
 */
export async function action({request}) {
  const formData = await request.formData();
  const firstName = formData.get('firstName') || '';
  const lastName = formData.get('lastName') || '';
  const email = formData.get('email');
  const phone = formData.get('phone') || '';
  const message = formData.get('message');

  // Validate only required fields: email and message
  if (!email || !message) {
    return new Response(
      JSON.stringify({error: 'Wypełnij wymagane pola (Email i Treść wiadomości)', success: false}),
      {status: 400, headers: {'Content-Type': 'application/json'}}
    );
  }

  // Return validation success - actual submission happens client-side
  return new Response(
    JSON.stringify({success: true, clientSubmit: true}),
    {status: 200, headers: {'Content-Type': 'application/json'}}
  );
}

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  try {
    // Fetch the contact image from Shopify
    const {metaobject} = await context.storefront.query(CONTACT_IMAGE_QUERY, {
      variables: {
        handle: 'contact-photo-0vicgqyl',
      },
    });

    return {contactImage: metaobject};
  } catch {
    // If fetching fails, return null to use placeholder
    return {contactImage: null};
  }
}

export default function Contact() {
  const {contactImage} = useLoaderData();
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract image URL from metaobject and optimize size
  const rawImageUrl = contactImage?.fields?.find(
    (field) => field.reference?.__typename === 'MediaImage'
  )?.reference?.image?.url;

  // Add Shopify image transformation for better quality at smaller size
  const imageUrl = rawImageUrl 
    ? `${rawImageUrl}&width=1400&height=1900` 
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus(null);

    const formData = new FormData(e.target);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Web3Forms response:', result);

      if (result.success) {
        setFormStatus('success');
        e.target.reset(); // Clear the form
      } else {
        console.error('Web3Forms error:', result.message);
        setFormStatus('error');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        {/* Left side - Image (70% width) */}
        <div className="contact-image-section">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt="Contact" 
              className="contact-image"
              loading="eager"
              decoding="async"
            />
          ) : (
            <img 
              src="https://via.placeholder.com/1200x1600/8B7355/FFFFFF?text=Contact+Image" 
              alt="Contact" 
              className="contact-image"
              loading="eager"
            />
          )}
        </div>

        {/* Right side - Form and info */}
        <div className="contact-form-section">
          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-info-item">
              <h3>Telefon</h3>
              <p>+48 511 677 442</p>
            </div>
            <div className="contact-info-item">
              <h3>E-mail</h3>
              <p>krzysztof@ngdesign.com</p>
            </div>
          </div>

          {/* Form */}
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Napisz do nas</h2>
            
            <form 
              onSubmit={handleSubmit}
              className="contact-form"
            >
              <input type="hidden" name="access_key" value="fea92865-b2b4-4c13-a06e-f07e480e9ad7" />
              <input type="hidden" name="subject" value="Nowa wiadomość z formularza kontaktowego NG Design" />
              
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Imię"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nazwisko"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Mail*"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Telefon"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Treść wiadomości*"
                  required
                  rows="5"
                  className="form-textarea"
                />
              </div>

              <div className="form-footer">
                <p className="form-required">*pola wymagane</p>
                <button 
                  type="submit" 
                  className="form-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wysyłanie...' : 'Wyślij wiadomość'}
                </button>
              </div>
            </form>

            {/* Success/Error Popup */}
            {formStatus === 'success' && (
              <div 
                className="form-popup form-popup-success"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  background: 'white',
                  padding: '2rem 3rem',
                  borderRadius: '0',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  zIndex: 999999,
                  textAlign: 'center',
                  minWidth: '300px',
                  border: 'none',
                  color: 'black'
                }}
              >
                <p style={{color: 'black', margin: '0 0 1.5rem 0', fontSize: '1.1rem'}}>
                  Dziękujemy za kontakt, wkrótce otrzymasz odpowiedź na twoje pytanie.
                </p>
                <button onClick={() => setFormStatus(null)} className="popup-close">Zamknij</button>
              </div>
            )}
            
            {formStatus === 'error' && (
              <div 
                className="form-popup form-popup-error"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  background: 'white',
                  padding: '2rem 3rem',
                  borderRadius: '0',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  zIndex: 999999,
                  textAlign: 'center',
                  minWidth: '300px',
                  border: 'none',
                  color: 'black'
                }}
              >
                <p style={{color: '#8e0000', margin: '0 0 1.5rem 0', fontSize: '1.1rem'}}>
                  Wystąpił błąd podczas wysyłania wiadomości
                </p>
                <button onClick={() => setFormStatus(null)} className="popup-close">Zamknij</button>
              </div>
            )}
          </div>

          {/* Custom Footer for Contact Page */}
          <div className="contact-page-footer">
            <div className="contact-footer-content">
              <p className="contact-copyright">© NG DESIGN {new Date().getFullYear()}</p>
              <div className="contact-footer-right">
                <div className="contact-social">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 8.4A3.6 3.6 0 0 0 8.4 12a3.6 3.6 0 0 0 3.6 3.6 3.6 3.6 0 0 0 3.6-3.6A3.6 3.6 0 0 0 12 8.4zm0 6a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8zm4.8-6.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0zm2.4.8c0-.8-.2-1.6-.5-2.3A3 3 0 0 0 17 5a4.3 4.3 0 0 0-2.3-.5c-1-.1-3.8-.1-4.8 0-.8 0-1.6.2-2.3.5a3 3 0 0 0-1.7 1.7 4.3 4.3 0 0 0-.5 2.3c-.1 1-.1 3.8 0 4.8 0 .8.2 1.6.5 2.3a3 3 0 0 0 1.7 1.7c.7.3 1.5.5 2.3.5 1 .1 3.8.1 4.8 0 .8 0 1.6-.2 2.3-.5a3 3 0 0 0 1.7-1.7c.3-.7.5-1.5.5-2.3.1-1 .1-3.8 0-4.8zM17.6 16a2.4 2.4 0 0 1-1.4 1.4c-1 .4-3.2.3-4.2.3-1 0-3.3.1-4.2-.3A2.4 2.4 0 0 1 6.4 16c-.4-1-.3-3.2-.3-4.2 0-1-.1-3.3.3-4.2A2.4 2.4 0 0 1 7.8 6.4c1-.4 3.2-.3 4.2-.3 1 0 3.3-.1 4.2.3a2.4 2.4 0 0 1 1.4 1.4c.4 1 .3 3.2.3 4.2 0 1 .1 3.3-.3 4.2z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/>
                    </svg>
                  </a>
                </div>
                <div className="contact-footer-links">
                  <a href="/regulamin">REGULAMIN I POLITYKA PRYWATNOŚCI</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CONTACT_IMAGE_QUERY = `#graphql
  query ContactImage($handle: String!) {
    metaobject(handle: {type: "contact_photo", handle: $handle}) {
      id
      fields {
        key
        value
        reference {
          __typename
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').ActionFunctionArgs} ActionFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
