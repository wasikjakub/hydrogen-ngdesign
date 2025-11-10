import {useState} from 'react';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import '../styles/AddToCartSection.css';

/**
 * @param {{
 *   selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
 * }}
 */
export function AddToCartSection({selectedVariant}) {
  const {open} = useAside();
  const [quantity, setQuantity] = useState(1);
  
  return (
    <div className="add-to-cart-section">
      <div className="add-to-cart-row">
        {/* Quantity Selector */}
        <div className="product-quantity">
          <label htmlFor="quantity" className="product-quantity-label">Ilość:</label>
          <div className="quantity-selector">
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <div className="quantity-arrows">
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
              >
                <span>&#9650;</span>
              </button>
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <span>&#9660;</span>
              </button>
            </div>
          </div>
        </div>
        <div style={{marginLeft: '1.5rem'}}>
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity,
                      selectedVariant,
                    },
                  ]
                : []
            }
            className="add-to-cart-btn-custom"
          >
            {selectedVariant?.availableForSale ? 'Dodaj do koszyka' : 'Sold out'}
          </AddToCartButton>
        </div>
      </div>
      <div className="shipping-info-grey">
        Wysyłka w 20-40 dni roboczych
      </div>
    </div>
  );
}

/** @typedef {import('storefrontapi.generated').ProductFragment} ProductFragment */
