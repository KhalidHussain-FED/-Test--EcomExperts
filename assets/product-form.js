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
            } else 
if (!this.cart) {
  const currentURL = window.location.href;

  if (currentURL === 'https://khalid-hussain-test.myshopify.com/products/product-1?variant=44127900663962') {
    const FreeProductTitle = 'Soft Winter Jacket';
    const MainProductId = 123456789; // Set the correct ID for the main product
    const FreeProductId = 44158968135834; // Set the correct Free Product ID

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
  } else {
    fetch(window.Shopify.routes.root + 'cart.js')
      .then(response => response.json())
      .then(cartData => {
        console.log('Cart Data:', cartData);

        if (cartData.items && cartData.items.length > 0) {
          // Filter out both the main product and the free product
          let productsToRemove = cartData.items.filter(item => item.id === MainProductId || item.id === FreeProductId);

          console.log('Products to Remove:', productsToRemove);

          if (productsToRemove.length > 0) {
            // Choose one product to remove randomly
            let randomIndex = Math.floor(Math.random() * productsToRemove.length);
            let productToRemove = productsToRemove[randomIndex];

            console.log('Removing Product:', productToRemove);

            let removeFormData = {
              'updates': {
                [productToRemove.id]: 0
              }
            };

            // Remove the selected product
            return fetch(window.Shopify.routes.root + 'cart/update.js', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(removeFormData)
            });
          }
        }
      })
      .then(response => response.json())
      .then(() => {
        console.log('Product Removed Successfully!');
        // After removing the product, reload the window
        window.location.reload();
      })
      .catch(error => console.error('Error removing product:', error));
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
