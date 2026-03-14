/* ================================================
   LUMITOP STORE – App JavaScript
   Cart, Gallery, Checkout & Razorpay Integration
   ================================================ */

(function () {
    'use strict';

    // ── Configuration ──
    const CONFIG = {
        product: {
            name: 'LUMITOP™ Sunset Projection LED Lamp',
            price: 549,
            comparePrice: 1499,
            currency: 'INR',
            image: 'images/product-1.jpg',
            variants: ['Sunset Orange', 'Rainbow RGB', 'Golden Warm', 'Purple Haze']
        },
        razorpay: {
            key: 'rzp_live_SR7VbTMGVdZW4f', // Updated with provided live key
            company: 'Lumitop Store',
            logo: '',
            color: '#FF4500'
        },
        supabase: {
            url: 'YOUR_SUPABASE_URL', // User needs to provide this
            key: 'YOUR_SUPABASE_ANON_KEY',
            table: 'orders'
        },
        googleSheets: {
            webhook: 'YOUR_GOOGLE_SHEETS_APPS_SCRIPT_URL' // User needs to provide this
        },
        shopify: {
            domain: 'mavis-1773032239.myshopify.com', 
            useRedirect: false 
        },
        gemini: {
            apiKey: 'AIzaSyBD645eE2e7tEAjMsSPF2h9cp85kHqUitA' 
        }
    };

    // ── State ──
    let cart = JSON.parse(localStorage.getItem('lumitop_cart') || '[]');
    let lastCheckoutPhone = ''; // To auto-fill tracking
    let currentSlide = 0;
    const totalSlides = 5;
    let touchStartX = 0;
    let touchEndX = 0;

    // ── DOM Elements ──
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const els = {
        hamburger: $('#hamburger-btn'),
        mobileNav: $('#mobile-nav'),
        mobileNavClose: $('#mobile-nav-close'),
        overlay: $('#overlay'),
        cartToggle: $('#cart-toggle-btn'),
        cartCount: $('#cart-count'),
        cartDrawer: $('#cart-drawer'),
        cartDrawerClose: $('#cart-drawer-close'),
        cartDrawerBody: $('#cart-drawer-body'),
        cartEmpty: $('#cart-empty'),
        cartItems: $('#cart-items'),
        cartDrawerFooter: $('#cart-drawer-footer'),
        cartSubtotal: $('#cart-subtotal-amount'),
        cartContinue: $('#cart-continue-shopping'),
        checkoutBtn: $('#checkout-btn'),
        checkoutModal: $('#checkout-modal'),
        checkoutClose: $('#checkout-close'),
        checkoutForm: $('#checkout-form'),
        checkoutSummary: $('#checkout-summary'),
        checkoutSubtotal: $('#checkout-subtotal'),
        checkoutTotal: $('#checkout-total-amount'),
        placeOrderBtn: $('#place-order-btn'),
        successModal: $('#success-modal'),
        successClose: $('#success-close-btn'),
        orderIdDisplay: $('#order-id-display'),
        gallerySlides: $$('.gallery-slide'),
        galleryDots: $$('.gallery-dot'),
        galleryThumbs: $$('.gallery-thumb'),
        galleryPrev: $('#gallery-prev'),
        galleryNext: $('#gallery-next'),
        galleryMain: $('#gallery-main'),
        colorSwatches: $$('.color-swatch'),
        selectedColorName: $('#selected-color-name'),
        qtyMinus: $('#qty-minus'),
        qtyPlus: $('#qty-plus'),
        qtyInput: $('#qty-input'),
        addToCartBtn: $('#add-to-cart-btn'),
        buyNowBtn: $('#buy-now-btn'),
        stickyAtc: $('#sticky-atc'),
        stickyAddToCart: $('#sticky-add-to-cart'),
        newsletterForm: $('#newsletter-form'),
        paymentMethods: $$('.payment-method'),
        chatbotWidget: $('#chatbot-widget'),
        chatbotWindow: $('#chatbot-window'),
        chatbotFab: $('#chatbot-fab'),
        chatbotClose: $('#chatbot-close'),
        chatbotMessages: $('#chatbot-messages'),
        chatbotInput: $('#chatbot-input'),
        chatbotSend: $('#chatbot-send'),
        fabIconChat: $('.fab-icon-chat'),
        fabIconClose: $('.fab-icon-close'),
        myOrdersLink: $('#my-orders-link'),
        ordersModal: $('#orders-modal'),
        ordersClose: $('#orders-close'),
        ordersLookupBtn: $('#orders-lookup-btn'),
        ordersLookupPhone: $('#orders-lookup-phone'),
        ordersResults: $('#orders-results'),
        successTrackBtn: $('#success-track-btn'),
        successWhatsAppBtn: $('#success-whatsapp-btn')
    };

    // ── Initialize ──
    function init() {
        updateCartUI();
        bindEvents();
        initStickyAtc();
        initScrollReveal();
        initChatbot();
    }

    // ── Event Bindings ──
    function bindEvents() {
        // Mobile Nav
        els.hamburger.addEventListener('click', openMobileNav);
        els.mobileNavClose.addEventListener('click', closeMobileNav);
        els.overlay.addEventListener('click', closeAll);

        // Mobile Nav Links
        $$('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });

        // Cart Drawer
        els.cartToggle.addEventListener('click', openCartDrawer);
        els.cartDrawerClose.addEventListener('click', closeCartDrawer);
        els.cartContinue.addEventListener('click', (e) => {
            e.preventDefault();
            closeCartDrawer();
        });

        // Gallery
        els.galleryPrev.addEventListener('click', () => changeSlide(currentSlide - 1, true));
        els.galleryNext.addEventListener('click', () => changeSlide(currentSlide + 1, true));
        els.galleryDots.forEach(dot => {
            dot.addEventListener('click', () => changeSlide(parseInt(dot.dataset.index), true));
        });
        els.galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => changeSlide(parseInt(thumb.dataset.index), true));
        });

        // Touch swipe for gallery
        els.galleryMain.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        els.galleryMain.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        // Color Swatches
        els.colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                els.colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                els.selectedColorName.textContent = swatch.dataset.color;
            });
        });

        // Quantity
        els.qtyMinus.addEventListener('click', () => {
            const val = parseInt(els.qtyInput.value);
            if (val > 1) els.qtyInput.value = val - 1;
        });
        els.qtyPlus.addEventListener('click', () => {
            const val = parseInt(els.qtyInput.value);
            if (val < 10) els.qtyInput.value = val + 1;
        });

        // Add to Cart
        els.addToCartBtn.addEventListener('click', addToCart);
        els.stickyAddToCart.addEventListener('click', addToCart);

        // Buy Now
        els.buyNowBtn.addEventListener('click', () => {
            addToCart();
            setTimeout(() => {
                closeCartDrawer();
                openCheckoutModal();
            }, 300);
        });

        // Checkout
        els.checkoutBtn.addEventListener('click', () => {
            if (CONFIG.shopify.useRedirect) {
                // Direct integration redirect to Shopify Cart
                window.location.href = `https://${CONFIG.shopify.domain}/`;
            } else {
                closeCartDrawer();
                openCheckoutModal();
            }
        });
        els.checkoutClose.addEventListener('click', closeCheckoutModal);
        els.checkoutForm.addEventListener('submit', handleCheckout);

        // Payment method switching
        els.paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                els.paymentMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                method.querySelector('input').checked = true;
            });
        });

        // Success
        els.successClose.addEventListener('click', () => {
            els.successModal.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
        
        if (els.successTrackBtn) {
            els.successTrackBtn.addEventListener('click', () => {
                els.successModal.classList.remove('open');
                openOrdersModal();
                if (lastCheckoutPhone) {
                    els.ordersLookupPhone.value = lastCheckoutPhone;
                    handleOrderLookup();
                }
            });
        }

        // Newsletter
        els.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('✓ Subscribed successfully!');
            els.newsletterForm.reset();
        });

        // My Orders
        els.myOrdersLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileNav();
            openOrdersModal();
        });
        els.ordersClose.addEventListener('click', closeOrdersModal);
        els.ordersLookupBtn.addEventListener('click', handleOrderLookup);
        els.ordersLookupPhone.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleOrderLookup();
        });

        // Pincode & Geo
        const pincodeInp = $('#checkout-pincode');
        if (pincodeInp) pincodeInp.addEventListener('input', handlePincodeLookup);
        
        const geoBtn = $('#btn-geo');
        if (geoBtn) geoBtn.addEventListener('click', handleGeolocation);

        // Initializations for Pro features
        initSocialProof();
        initScarcityTimer();
        
        // Auto-play gallery
        setInterval(() => {
            if (!document.hidden) {
                changeSlide((currentSlide + 1) % totalSlides, false);
            }
        }, 5000);
    }

    // ── Mobile Nav ──
    function openMobileNav() {
        els.mobileNav.classList.add('open');
        els.overlay.classList.add('visible');
        els.hamburger.classList.add('active');
        document.body.classList.add('no-scroll');
    }

    function closeMobileNav() {
        els.mobileNav.classList.remove('open');
        els.overlay.classList.remove('visible');
        els.hamburger.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // ── Orders Modal ──
    function openOrdersModal() {
        els.ordersModal.classList.add('open');
        document.body.classList.add('no-scroll');
    }

    function closeOrdersModal() {
        els.ordersModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    async function handleOrderLookup() {
        const phone = els.ordersLookupPhone.value.trim();
        if (phone.length !== 10) {
            showToast('⚠ Please enter a valid 10-digit phone number');
            return;
        }

        els.ordersResults.innerHTML = '<div class="loading">Searching...</div>';
        els.ordersLookupBtn.disabled = true;

        try {
            // 1. Check LocalStorage first (Immediate results)
            const localOrders = JSON.parse(localStorage.getItem('lumitop_orders') || '[]');
            const filteredLocal = localOrders.filter(o => o.phone === phone);

            // 2. Check Supabase (Global results)
            let globalOrders = [];
            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient
                    .from(CONFIG.supabase.table)
                    .select('*')
                    .eq('phone', phone)
                    .order('timestamp', { ascending: false });

                if (!error && data) globalOrders = data;
            }

            // Merge and de-duplicate by orderId
            const allOrders = [...filteredLocal, ...globalOrders];
            const uniqueOrders = Array.from(new Map(allOrders.map(o => [o.orderId, o])).values());
            
            // Sort by timestamp
            uniqueOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            if (uniqueOrders.length > 0) {
                renderOrderResults(uniqueOrders);
            } else {
                els.ordersResults.innerHTML = '<div class="no-results">No orders found for this number.</div>';
            }
        } catch (err) {
            console.error('Order lookup error:', err);
            els.ordersResults.innerHTML = '<div class="error">Error searching orders.</div>';
        } finally {
            els.ordersLookupBtn.disabled = false;
        }
    }

    function renderOrderResults(orders) {
        els.ordersResults.innerHTML = orders.map(order => `
            <div class="order-result-card">
                <div class="order-result-header">
                    <span class="order-id-track">#${order.orderId}</span>
                    <span class="order-status">${order.status || 'Received'}</span>
                </div>
                <div class="order-items-list">
                    ${Array.isArray(order.items) ? order.items.map(i => `${i.name} (${i.color}) ×${i.quantity}`).join('<br>') : 'Items loading...'}
                </div>
                <div class="order-result-header" style="margin-top:10px; margin-bottom:0; font-size: 0.8rem; color: #777;">
                    <span>${new Date(order.timestamp).toLocaleDateString()}</span>
                    <span>₹${order.total}</span>
                </div>
            </div>
        `).join('');
    }

    // ── Cart Drawer ──
    function openCartDrawer() {
        els.cartDrawer.classList.add('open');
        els.overlay.classList.add('visible');
        document.body.classList.add('no-scroll');
    }

    function closeCartDrawer() {
        els.cartDrawer.classList.remove('open');
        els.overlay.classList.remove('visible');
        document.body.classList.remove('no-scroll');
    }

    function closeAll() {
        closeMobileNav();
        closeCartDrawer();
    }

    // ── Gallery ──
    function changeSlide(index, isUserInteraction = false) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        els.gallerySlides.forEach(slide => slide.classList.remove('active'));
        els.galleryDots.forEach(dot => dot.classList.remove('active'));
        els.galleryThumbs.forEach(thumb => thumb.classList.remove('active'));

        els.gallerySlides[index].classList.add('active');
        els.galleryDots[index].classList.add('active');
        els.galleryThumbs[index].classList.add('active');

        // Only scroll thumb into view if triggered by user (prevents auto-play jumps)
        if (isUserInteraction) {
            els.galleryThumbs[index].scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest'
            });
        }

        currentSlide = index;
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                changeSlide(currentSlide + 1, true);
            } else {
                changeSlide(currentSlide - 1, true);
            }
        }
    }

    // ── Cart Management ──
    function addToCart() {
        const selectedColor = document.querySelector('.color-swatch.active').dataset.color;
        const quantity = parseInt(els.qtyInput.value);

        // Check if item with same color already exists
        const existingIndex = cart.findIndex(item => item.color === selectedColor);
        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({
                id: Date.now(),
                name: CONFIG.product.name,
                price: CONFIG.product.price,
                comparePrice: CONFIG.product.comparePrice,
                color: selectedColor,
                quantity: quantity,
                image: CONFIG.product.image
            });
        }

        saveCart();
        updateCartUI();
        openCartDrawer();
        showToast('✓ Added to cart!');

        // Animate cart count
        els.cartCount.style.transform = 'scale(1.4)';
        setTimeout(() => { els.cartCount.style.transform = 'scale(1)'; }, 200);
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    function updateCartItemQty(id, delta) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(id);
                return;
            }
            saveCart();
            updateCartUI();
        }
    }

    function saveCart() {
        localStorage.setItem('lumitop_cart', JSON.stringify(cart));
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    function getCartCount() {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function updateCartUI() {
        const count = getCartCount();
        const total = getCartTotal();

        // Update cart count badge
        els.cartCount.textContent = count;
        if (count > 0) {
            els.cartCount.classList.add('visible');
        } else {
            els.cartCount.classList.remove('visible');
        }

        // Toggle empty/items state
        if (count === 0) {
            els.cartEmpty.style.display = 'flex';
            els.cartItems.innerHTML = '';
            els.cartDrawerFooter.style.display = 'none';
        } else {
            els.cartEmpty.style.display = 'none';
            els.cartDrawerFooter.style.display = 'block';
            renderCartItems();
        }

        // Update subtotal
        els.cartSubtotal.textContent = formatPrice(total);
    }

    function renderCartItems() {
        els.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-variant">${item.color}</div>
                    <div class="cart-item-bottom">
                        <div class="cart-item-qty">
                            <button onclick="window._lumitop.updateQty(${item.id}, -1)" aria-label="Decrease">−</button>
                            <span>${item.quantity}</span>
                            <button onclick="window._lumitop.updateQty(${item.id}, 1)" aria-label="Increase">+</button>
                        </div>
                        <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                    </div>
                    <button class="cart-item-remove" onclick="window._lumitop.remove(${item.id})">Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Expose cart functions globally for inline handlers
    window._lumitop = {
        updateQty: updateCartItemQty,
        remove: removeFromCart
    };

    // ── Checkout ──
    function openCheckoutModal() {
        renderCheckoutSummary();
        els.checkoutModal.classList.add('open');
        document.body.classList.add('no-scroll');
    }

    function closeCheckoutModal() {
        els.checkoutModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }

    function renderCheckoutSummary() {
        const total = getCartTotal();
        els.checkoutSummary.innerHTML = cart.map(item => `
            <div class="checkout-summary-item">
                <img src="${item.image}" alt="${item.name}" class="checkout-summary-img">
                <div class="checkout-summary-info">
                    <div class="checkout-summary-title">${item.name}</div>
                    <div class="checkout-summary-meta">${item.color} × ${item.quantity}</div>
                </div>
                <div class="checkout-summary-price">${formatPrice(item.price * item.quantity)}</div>
            </div>
        `).join('');

        els.checkoutSubtotal.textContent = formatPrice(total);
        els.checkoutTotal.textContent = formatPrice(total);
    }

    function handleCheckout(e) {
        e.preventDefault();

        // 1. Bot Protection (Honeypot)
        if ($('#checkout-honeypot').value) {
            console.warn('Bot detected via honeypot');
            return;
        }

        const formData = {
            name: $('#checkout-name').value.trim(),
            email: $('#checkout-email').value.trim(),
            phone: $('#checkout-phone').value.trim(),
            address: $('#checkout-address').value.trim(),
            city: $('#checkout-city').value.trim(),
            pincode: $('#checkout-pincode').value.trim(),
            state: $('#checkout-state').value.trim()
        };

        // 2. Robust Validation
        let hasError = false;
        
        // Reset previous errors
        $$('.form-row').forEach(row => row.classList.remove('has-error'));

        const showError = (id, condition) => {
            if (condition) {
                $(`#${id}`).parentElement.classList.add('has-error');
                hasError = true;
            }
        };

        showError('checkout-name', formData.name.length < 3);
        showError('checkout-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
        showError('checkout-phone', !/^[6-9]{1}[0-9]{9}$/.test(formData.phone));
        showError('checkout-address', formData.address.length < 10);
        showError('checkout-pincode', formData.pincode.length !== 6);
        showError('checkout-city', !formData.city);
        showError('checkout-state', !formData.state);

        if (hasError) {
            showToast('⚠ Please fix the errors in the form');
            return;
        }

        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // 3. AI Confirmation Flow (OpenClaw)
        startAIConfirmation(formData, paymentMethod);
    }

    async function startAIConfirmation(formData, paymentMethod) {
        closeCheckoutModal();
        
        // Open Chatbot
        const chatbotFab = $('#chatbot-fab');
        if (chatbotFab && !els.chatbotWindow.classList.contains('open')) {
            chatbotFab.click();
        }

        const summary = `🛒 *Order Summary:*
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}, ${formData.city} - ${formData.pincode}
Payment: ${paymentMethod.toUpperCase()}
Total: ${els.checkoutTotal.textContent}

*Please reply with "YES" or "CONFIRM" to place your order!*`;

        addChatMessage(summary, 'bot');
        
        // Temporarily override the chatbot's message handler
        const originalSendMessage = els.chatbotSend.onclick;
        
        const confirmationHandler = async () => {
            const reply = els.chatbotInput.value.trim().toLowerCase();
            if (reply.includes('yes') || reply.includes('confirm')) {
                els.chatbotInput.value = '';
                addChatMessage(reply, 'user');
                addChatMessage("Perfect! Processing your order now... 🚀", 'bot');
                
                // Proceed to payment or order placement
                if (paymentMethod === 'razorpay') {
                    initiateRazorpayPayment(formData);
                } else {
                    placeOrder(formData, 'COD', null);
                }
                
                // Restore original handler
                els.chatbotSend.removeEventListener('click', confirmationHandler);
                els.chatbotInput.removeEventListener('keypress', enterHandler);
            } else {
                addChatMessage("I need a clear 'YES' or 'CONFIRM' to proceed, or let me know if you want to change something! 😊", 'bot');
            }
        };

        const enterHandler = (e) => { if (e.key === 'Enter') confirmationHandler(); };

        els.chatbotSend.addEventListener('click', confirmationHandler);
        els.chatbotInput.addEventListener('keypress', enterHandler);
    }

    async function handlePincodeLookup(e) {
        const pincode = e.target.value.trim();
        if (pincode.length === 6) {
            lookupPincode(pincode);
        }
    }

    async function lookupPincode(pincode) {
        const cityInput = $('#checkout-city');
        const stateInput = $('#checkout-state');

        // Visual feedback
        cityInput.value = ''; 
        stateInput.value = '';
        cityInput.placeholder = 'Detecting...';
        stateInput.placeholder = 'Detecting...';

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data && data[0].Status === 'Success') {
                const postOffice = data[0].PostOffice[0];
                cityInput.value = postOffice.District;
                stateInput.value = postOffice.State;
                showToast(`✓ Detected: ${postOffice.District}, ${postOffice.State}`);
            } else {
                showToast('⚠ Pincode not found');
            }
        } catch (err) {
            console.error('Pincode API error:', err);
            showToast('⚠ Location detection failed');
        } finally {
            cityInput.placeholder = 'City *';
            stateInput.placeholder = 'State *';
        }
    }

    function handleGeolocation() {
        if (!navigator.geolocation) {
            showToast('⚠ Geolocation not supported');
            return;
        }

        const geoBtn = $('#btn-geo');
        geoBtn.textContent = '⏳';

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                // Using Reverse Geocoding via BigDataCloud (Free, no key needed for small use)
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await response.json();
                
                if (data.postcode) {
                    $('#checkout-pincode').value = data.postcode;
                    lookupPincode(data.postcode);
                } else {
                    $('#checkout-city').value = data.city || data.locality || '';
                    $('#checkout-state').value = data.principalSubdivision || '';
                    showToast('✓ Location detected');
                }
            } catch (err) {
                showToast('⚠ Error detecting location');
            } finally {
                geoBtn.textContent = '📍';
            }
        }, () => {
            showToast('⚠ Permission denied');
            geoBtn.textContent = '📍';
        });
    }

    function initiateRazorpayPayment(formData) {
        const total = getCartTotal();

        const options = {
            key: CONFIG.razorpay.key,
            amount: total * 100, // Razorpay expects amount in paise
            currency: CONFIG.product.currency,
            name: CONFIG.razorpay.company,
            description: cart.map(item => `${item.name} (${item.color}) ×${item.quantity}`).join(', '),
            image: CONFIG.razorpay.logo,
            handler: function (response) {
                placeOrder(formData, 'Razorpay', response.razorpay_payment_id);
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone
            },
            notes: {
                address: formData.address,
                city: formData.city,
                pincode: formData.pincode,
                state: formData.state
            },
            theme: {
                color: CONFIG.razorpay.color
            },
            modal: {
                ondismiss: function () {
                    showToast('Payment cancelled');
                }
            }
        };

        try {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', function (response) {
                showToast('⚠ Payment failed. Please try again.');
                console.error('Payment failed:', response.error);
            });
            rzp.open();
        } catch (error) {
            console.error('Razorpay error:', error);
            showToast('⚠ Payment gateway error. Using demo mode.');
            // Demo mode: simulate successful payment
            setTimeout(() => {
                placeOrder(formData, 'Demo Payment', 'DEMO_' + Date.now());
            }, 500);
        }
    }

    function placeOrder(formData, paymentMethod, paymentId) {
        const orderId = 'LMT-' + Date.now().toString(36).toUpperCase();
        lastCheckoutPhone = formData.phone; 

        const orderData = {
            orderId,
            ...formData,
            paymentMethod,
            paymentId,
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: new Date().toISOString()
        };

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('lumitop_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('lumitop_orders', JSON.stringify(orders));

        // PRODUCTION: Sync with External Services
        syncOrderWithBackend(orderData);

        // Clear cart
        cart = [];
        saveCart();
        updateCartUI();

        // Close checkout and show success
        closeCheckoutModal();
        if (els.checkoutForm) els.checkoutForm.reset();

        if (els.orderIdDisplay) els.orderIdDisplay.textContent = `Order ID: ${orderId}`;
        
        // Set WhatsApp Link
        const waMsg = `Hi! I just placed an order for ${orderData.items[0].name}. Order ID: ${orderId}. Please confirm my order!`;
        const waLink = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(waMsg)}`; // Placeholder number
        if ($('#success-whatsapp-btn')) {
            $('#success-whatsapp-btn').onclick = () => window.open(waLink, '_blank');
        }

        els.successModal.classList.add('open');
        document.body.classList.add('no-scroll');
    }

    // ── Pro Features ──
    function initSocialProof() {
        const names = ['Arav', 'Priya', 'Vikram', 'Anjali', 'Rahul', 'Sneha', 'Deepak'];
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
        
        let proofEl = $('.social-proof');
        if (!proofEl) {
            proofEl = document.createElement('div');
            proofEl.className = 'social-proof';
            document.body.appendChild(proofEl);
        }

        function showProof() {
            const name = names[Math.floor(Math.random() * names.length)];
            const city = cities[Math.floor(Math.random() * cities.length)];
            const time = Math.floor(Math.random() * 50) + 5;
            
            proofEl.innerHTML = `
                <img src="images/product-1.jpg" class="social-proof-img">
                <div class="social-proof-text">
                    <b>${name}</b> from <b>${city}</b><br>
                    Just bought a Sunset Lamp ${time}m ago!
                </div>
            `;
            
            proofEl.classList.add('visible');
            setTimeout(() => proofEl.classList.remove('visible'), 5000);
            
            // Next proof in 15-30s
            setTimeout(showProof, (Math.random() * 15000) + 15000);
        }

        setTimeout(showProof, 8000);
    }

    function initScarcityTimer() {
        const scarcityText = $('.scarcity-badge');
        const scarcityBar = $('.sales-progress-bar');
        if (!scarcityText || !scarcityBar) return;

        let count = 7;
        setInterval(() => {
            if (Math.random() > 0.8 && count > 2) {
                count--;
                scarcityText.textContent = `🔥 Limited Stock: Only ${count} packs remaining today!`;
                scarcityBar.style.width = `${89 + (7 - count)}%`;
            }
        }, 30000);
    }

    async function syncOrderWithBackend(orderData) {
        // 1. Log to Supabase
        if (CONFIG.supabase.url !== 'YOUR_SUPABASE_URL') {
            try {
                const { data, error } = await window.supabaseClient
                    .from(CONFIG.supabase.table)
                    .insert([orderData]);
                if (error) throw error;
                console.log('Synced with Supabase successfully');
            } catch (err) {
                console.error('Supabase Sync Error:', err);
            }
        }

        // 2. Sync with Google Sheets (via Webhook)
        if (CONFIG.googleSheets.webhook !== 'YOUR_GOOGLE_SHEETS_APPS_SCRIPT_URL') {
            try {
                await fetch(CONFIG.googleSheets.webhook, {
                    method: 'POST',
                    mode: 'no-cors',
                    cache: 'no-cache',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                console.log('Synced with Google Sheets successfully');
            } catch (err) {
                console.error('Google Sheets Sync Error:', err);
            }
        }
    }

    // ── Sticky Add to Cart ──
    function initStickyAtc() {
        const productActions = $('.product-actions');
        if (!productActions) return;

        let lastState = false;
        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = !entry.isIntersecting;
                if (isVisible !== lastState) {
                    lastState = isVisible;
                    if (isVisible) {
                        els.stickyAtc.classList.add('visible');
                    } else {
                        els.stickyAtc.classList.remove('visible');
                    }
                }
            },
            { 
                threshold: [0, 1], 
                rootMargin: '0px 0px -100px 0px' 
            }
        );

        observer.observe(productActions);
    }

    // ── Toast ──
    function showToast(message) {
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // ── Helpers ──
    function formatPrice(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }

    // ── Smooth scroll for anchor links ──
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ── Scroll Reveal ──
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (!revealElements.length) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target); // Only reveal once
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ── Chatbot Integration (Gemini) ──
    function initChatbot() {
        if (!els.chatbotWidget) return;

        let isChatOpen = false;

        function toggleChat() {
            isChatOpen = !isChatOpen;
            if (isChatOpen) {
                els.chatbotWindow.classList.add('open');
                els.fabIconChat.style.display = 'none';
                els.fabIconClose.style.display = 'block';
                els.chatbotInput.focus();
            } else {
                els.chatbotWindow.classList.remove('open');
                els.fabIconChat.style.display = 'block';
                els.fabIconClose.style.display = 'none';
            }
        }

        els.chatbotFab.addEventListener('click', toggleChat);
        els.chatbotClose.addEventListener('click', toggleChat);

        async function sendMessage() {
            const text = els.chatbotInput.value.trim();
            if (!text) return;

            // Add user message
            addChatMessage(text, 'user');
            els.chatbotInput.value = '';

            if (CONFIG.gemini.apiKey === 'YOUR_GEMINI_API_KEY') {
                setTimeout(() => {
                    addChatMessage("Hey there! 😊 Lumi here. My AI brain is currently sleeping because I need a Gemini API Key to talk to you. <br><br>Please grab a free key from <a href='https://aistudio.google.com/app/apikey' target='_blank' style='color:var(--color-accent);text-decoration:underline;'>Google AI Studio</a> and paste it into <strong>app.js (line 30)</strong> where it says `apiKey: 'YOUR_KEY_HERE'`.", 'bot');
                }, 500);
                return;
            }

            // Show typing indicator
            const typingId = 'typing-' + Date.now();
            addChatMessage('...', 'bot', typingId);

            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${CONFIG.gemini.apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ 
                                text: `You are Lumi, a highly empathetic and friendly human customer support representative for our premium store. We sell the 'LUMITOP Sunset Projection LED Lamp'.
Rule 1: NEVER say you are an AI, bot, or virtual assistant. Act exactly like a real human texting a customer (casual, friendly, use emojis, empathetic).
Rule 2: Keep replies short, conversational, and punchy. Don't write long essays.
Rule 3: The lamp costs ₹549 (on sale from ₹1,499).
Rule 4: Shipping is Free and Cash on Delivery (COD) is available anywhere in India.
Rule 5: The lamp has 4 variants: Sunset Orange, Rainbow RGB, Golden Warm, Purple Haze.
Customer says: "${text}"` 
                            }]
                        }]
                    })
                });

                const data = await response.json();
                removeChatMessage(typingId);

                if (data && data.candidates && data.candidates[0].content) {
                    const botReply = data.candidates[0].content.parts[0].text;
                    addChatMessage(botReply, 'bot');
                } else if (data && data.error) {
                    console.log('Gemini API Exhausted or Error:', data.error.message);
                    addChatMessage("I'm currently helping so many customers right now that my brain is full! 😅 Please leave your email or WhatsApp number and my human team will get right back to you!", 'bot');
                } else {
                    addChatMessage("I'm sorry, I couldn't process that right now. Could you rephrase?", 'bot');
                }
            } catch (error) {
                console.error('Gemini API Error:', error);
                removeChatMessage(typingId);
                addChatMessage("Network error connecting to AI. Please try again.", 'bot');
            }
        }

        els.chatbotSend.addEventListener('click', sendMessage);
        els.chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function addChatMessage(text, sender, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;
        if (id) msgDiv.id = id;
        
        // Simple markdown boldness parsing
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        
        els.chatbotMessages.appendChild(msgDiv);
        els.chatbotMessages.scrollTop = els.chatbotMessages.scrollHeight;
    }

    function removeChatMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    // ── Init on DOM ready ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
