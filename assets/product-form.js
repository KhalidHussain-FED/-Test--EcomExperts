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
  } 
  
  else {
window.location = window.routes.cart_url;
  }
  }

return;

               document.addEventListener("DOMContentLoaded", function () {
              // Find all cart-remove-button elements
              var removeButtons = document.getElementById('44158968135834');

        var k = 111;

              console.log(k);
              // Add click event listener to each remove button
              removeButtons.forEach(function (button) {

                button.addEventListener('click', function (event) {
                  event.preventDefault();
    console.log(k);
                  // Log the clicked button's attributes for debugging
                  console.log('Clicked button attributes:', button.attributes);

                  // Get the index from the data-index attribute
                  var dataIndex = button.getAttribute('data-index');

                  // Perform the removal of the selected item
                  removeItem(dataIndex);
                });
              });

              function removeItem(index) {
                // Fetch API or Ajax call to remove the selected item
                fetch("/cart/change", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: index,  // Use the appropriate identifier for your cart item
                    quantity: 0,
                  }),
                })
                  .then(response => response.json())
                  .then(data => {
                    console.log('Remove Product from Cart Response:', data);

                    // Check if there are two or more items in the cart
                    if (data.item_count >= 2) {
                      // Use Fetch API to remove a random product
                      const randomProductIndex = Math.floor(Math.random() * data.items.length);
                      const randomProductId = data.items[randomProductIndex].id;

                      // Recursively call the removeItem function to remove another item
                      removeItem(randomProductId);
                    }
                  })
                  .catch(error => console.error('Error removing product:', error));
              }
            });


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
