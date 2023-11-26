if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.form.querySelector('[name=id]').disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButton.querySelector('span').classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else  // Check if the cart is empty
// Check if the cart is empty
if (!this.cart) {
  const currentURL = window.location.href;

  if (currentURL === 'https://khalid-hussain-test.myshopify.com/products/product-1?variant=44127900663962') {
    const FreeProductTitle = 'Soft Winter Jacket';
    const MainProductId = 44127900663962; // Set the correct ID for the main product
    const FreeProductId = 44158968135834; // Set the correct Free Product ID
    const HandbagId = 44127900663962; // Set the correct handbag ID
    const LeatherBagId = 44158968135834; // Set the correct Leather Bag ID

    let freeProductFormData = {
      'items': [
        {
          'id': FreeProductId,
          'quantity': 1,
        }
      ]
    };

    fetch(window.Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(freeProductFormData)
    })
      .then(freeProductResponse => {
        console.log('Add Free Product to Cart Response:', freeProductResponse);
        window.location = window.routes.cart_url;
        return freeProductResponse.json();
      })
      .catch(error => console.error('Error adding free product:', error));

    // Use the Shopify AJAX API to handle cart updates
    document.addEventListener('cart:updated', () => {
      const cart = JSON.parse(localStorage.getItem('cart'));

      console.log('Updated Cart:', cart);

      // Check if "handbag (black, medium)" is removed from the cart
      const handbagRemoved = !cart.items.some(item => item.variant_id === HandbagId);

      if (handbagRemoved) {
        const softWinterJacketId = 44158968135834; // Set the correct ID for the soft winter jacket product
        const leatherBagId = 44158968135834; // Set the correct ID for the leather bag product

        // Construct data to remove "soft winter jacket" and "leather bag" from the cart
        let removeProductsFormData = {
          'updates': {
            [softWinterJacketId]: 0, // Set quantity to 0 to remove the soft winter jacket
            [leatherBagId]: 0, // Set quantity to 0 to remove the leather bag
          }
        };

        // Send request to update the cart and remove products
        fetch(window.Shopify.routes.cart_change_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(removeProductsFormData)
        })
          .then(removeProductsResponse => {
            console.log('Remove Products from Cart Response:', removeProductsResponse);
            window.location.reload(); // Reload the page to show an empty cart
            return removeProductsResponse.json();
          })
          .catch(error => console.error('Error removing products:', error));
      }
    });
  } else {
    window.location = window.routes.cart_url;
  }
}
return;


            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }
    }
  );
}
