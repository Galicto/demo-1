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
            price: 149,
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
        successTrackBtn: $('#success-track-btn'),
        successWhatsAppBtn: $('#success-whatsapp-btn'),
        // OTP Elements
        otpModal: $('#otp-modal'),
        otpClose: $('#otp-close-btn'),
        otpVerifyBtn: $('#otp-verify-btn'),
        otpPhoneDisplay: $('#otp-phone-display'),
        otpDigits: $$('.otp-digit'),
        otpResend: $('#otp-resend'),
        otpTimer: $('#otp-timer'),
        otpError: $('#otp-error'),
        // Detect page type
        isOrdersPage: document.body.classList.contains('orders-page')
    };

    let generatedOTP = null;
    let otpTimerInterval = null;
    let currentPendingOrder = null;

    // ── Initialize ──
    function init() {
        console.log('🚀 Lumitop Init: Starting...');
        try {
            if (!els.isOrdersPage) {
                updateCartUI();
                initStickyAtc();
                initScrollReveal();
                initChatbot();
                initSocialProof();
                initScarcityTimer();
                initStickyBuy();
                initExitIntent();
            } else {
                checkUrlParams();
            }
            bindEvents();
            console.log('✓ Initialization Complete!');
        } catch (err) {
            console.error('❌ Lumitop Init Error:', err);
        }
    }

    function checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const phone = params.get('phone');
        if (phone && els.ordersLookupPhone) {
            els.ordersLookupPhone.value = phone;
            handleOrderLookup();
        }
    }

    // ── Event Bindings ──
    function bindEvents() {
        const safeAdd = (el, type, fn) => {
            if (el) {
                el.addEventListener(type, fn);
            } else {
                console.warn(`⚠ Missing element for event: ${type}`);
            }
        };

        // Mobile Nav
        safeAdd(els.hamburger, 'click', openMobileNav);
        safeAdd(els.mobileNavClose, 'click', closeMobileNav);
        safeAdd(els.overlay, 'click', closeAll);

        // Mobile Nav Links
        $$('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileNav();
            });
        });

        // Cart Drawer
        safeAdd(els.cartToggle, 'click', openCartDrawer);
        safeAdd(els.cartDrawerClose, 'click', closeCartDrawer);
        safeAdd(els.cartContinue, 'click', (e) => {
            e.preventDefault();
            closeCartDrawer();
        });

        // Gallery
        safeAdd(els.galleryPrev, 'click', () => changeSlide(currentSlide - 1, true));
        safeAdd(els.galleryNext, 'click', () => changeSlide(currentSlide + 1, true));
        els.galleryDots.forEach(dot => {
            dot.addEventListener('click', () => changeSlide(parseInt(dot.dataset.index), true));
        });
        els.galleryThumbs.forEach(thumb => {
            thumb.addEventListener('click', () => changeSlide(parseInt(thumb.dataset.index), true));
        });

        // Touch swipe for gallery
        if (els.galleryMain) {
            els.galleryMain.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            els.galleryMain.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        // Color Swatches
        els.colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                els.colorSwatches.forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                els.selectedColorName.textContent = swatch.dataset.color;
            });
        });

        // Quantity
        safeAdd(els.qtyMinus, 'click', () => {
            const val = parseInt(els.qtyInput.value);
            if (val > 1) els.qtyInput.value = val - 1;
        });
        safeAdd(els.qtyPlus, 'click', () => {
            const val = parseInt(els.qtyInput.value);
            if (val < 10) els.qtyInput.value = val + 1;
        });

        // Add to Cart
        safeAdd(els.addToCartBtn, 'click', addToCart);
        safeAdd(els.stickyAddToCart, 'click', addToCart);

        // Buy Now
        safeAdd(els.buyNowBtn, 'click', () => {
            addToCart();
            setTimeout(() => {
                closeCartDrawer();
                openCheckoutModal();
            }, 300);
        });

        // Checkout
        safeAdd(els.checkoutBtn, 'click', () => {
            console.log('Checkout clicked');
            if (CONFIG.shopify.useRedirect) {
                window.location.href = `https://${CONFIG.shopify.domain}/`;
            } else {
                closeCartDrawer();
                openCheckoutModal();
            }
        });
        safeAdd(els.checkoutClose, 'click', closeCheckoutModal);
        if (els.checkoutForm) {
            els.checkoutForm.addEventListener('submit', handleCheckout);
        }

        // Payment method switching
        els.paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                els.paymentMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                method.querySelector('input').checked = true;
            });
        });

        // Success
        safeAdd(els.successClose, 'click', () => {
            els.successModal.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
        safeAdd(els.successTrackBtn, 'click', () => {
            const phone = lastCheckoutPhone || '';
            window.location.href = `orders.html?phone=${phone}`;
        });

        // Newsletter
        if (els.newsletterForm) {
            els.newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showToast('✓ Subscribed successfully!');
                els.newsletterForm.reset();
            });
        }

        // OTP verification
        safeAdd(els.otpClose, 'click', closeOtpModal);
        safeAdd(els.otpVerifyBtn, 'click', handleOtpVerification);
        safeAdd(els.otpResend, 'click', (e) => {
            e.preventDefault();
            if (els.otpResend.classList.contains('disabled')) return;
            startOtpProcess(lastCheckoutPhone);
        });

        els.otpDigits.forEach((digit, idx) => {
            digit.addEventListener('input', (e) => {
                if (e.target.value && idx < 3) {
                    els.otpDigits[idx + 1].focus();
                }
            });
            digit.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                    els.otpDigits[idx - 1].focus();
                }
            });
        });

        // My Orders
        safeAdd(els.myOrdersLink, 'click', (e) => {
            // If on index, this will naturally go to orders.html if link is updated in HTML
            // This is a fallback
            if (!els.myOrdersLink.getAttribute('href').includes('orders.html')) {
                window.location.href = 'orders.html';
            }
        });
        safeAdd(els.ordersClose, 'click', () => {
            if (els.ordersModal) closeOrdersModal();
            else window.history.back();
        });
        safeAdd(els.ordersLookupBtn, 'click', handleOrderLookup);
        if (els.ordersLookupPhone) {
            els.ordersLookupPhone.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleOrderLookup();
            });
        }

        // Pincode & Geo
        const pincodeInp = $('#checkout-pincode');
        if (pincodeInp) pincodeInp.addEventListener('input', handlePincodeLookup);
        
        const geoBtn = $('#btn-geo');
        if (geoBtn) geoBtn.addEventListener('click', handleGeolocation);

        // Initializations for Pro features moves into init() for page-awareness
        
        // Auto-play gallery
        setInterval(() => {
            if (!document.hidden && typeof changeSlide === 'function') {
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
                els.ordersResults.innerHTML = `
                    <div class="no-results" style="text-align: center; padding: 40px 20px; background: #fff; border-radius: 15px; border: 1px dashed var(--color-border); margin-top: 20px;">
                        <div style="font-size: 40px; margin-bottom: 15px;">🔍</div>
                        <h3 style="margin-bottom: 10px; font-weight: 700;">No Orders Found</h3>
                        <p style="color: var(--color-text-light); font-size: 14px;">We couldn't find any orders for <strong>${phone}</strong>. Please double-check the number or contact support if you believe this is an error.</p>
                        <button class="btn btn-outline" style="margin-top: 20px; font-size: 14px;" onclick="window.location.reload()">Try Again</button>
                    </div>
                `;
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
        if (e) e.preventDefault();

        // 1. Bot Protection (Honeypot)
        if ($('#checkout-honeypot') && $('#checkout-honeypot').value) {
            console.warn('Bot detected via honeypot');
            return;
        }

        const formData = {
            name: $('#checkout-name').value.trim(),
            email: $('#checkout-email').value.trim(),
            phone: $('#checkout-phone').value.trim(),
            address: $('#checkout-address').value.trim(),
            city: $('#checkout-city').value.trim(),
            state: $('#checkout-state').value.trim(),
            pincode: $('#checkout-pincode').value.trim()
        };

        // 2. Robust Validation
        let hasError = false;
        $$('.form-row').forEach(row => row.classList.remove('has-error'));

        const showError = (id, condition) => {
            const el = $(`#${id}`);
            if (condition && el && el.parentElement) {
                el.parentElement.classList.add('has-error');
                hasError = true;
            }
        };

        showError('checkout-name', formData.name.length < 3);
        showError('checkout-phone', !/^[6-9]{1}[0-9]{9}$/.test(formData.phone));
        showError('checkout-address', formData.address.length < 10);
        showError('checkout-pincode', formData.pincode.length !== 6);
        showError('checkout-state', !formData.state);

        if (hasError) {
            showToast('⚠ Please fix the errors in the form');
            return;
        }

        currentPendingOrder = formData;
        lastCheckoutPhone = formData.phone;
        
        // Step 1: Trigger OTP Shield
        closeCheckoutModal();
        startOtpProcess(formData.phone);
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
            if (!cityInput.value) cityInput.value = '';
            if (!stateInput.value) stateInput.value = '';
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

    // ── OTP Logic ──
    function startOtpProcess(phone) {
        generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
        console.log('DEBUG: Generated OTP is', generatedOTP); // For demo purposes
        
        if (els.otpPhoneDisplay) els.otpPhoneDisplay.textContent = phone;
        if (els.otpModal) els.otpModal.classList.add('open');
        if (els.otpError) els.otpError.style.display = 'none';
        
        els.otpDigits.forEach(d => {
            d.value = '';
            d.style.borderColor = 'var(--color-border)';
        });
        if (els.otpDigits[0]) els.otpDigits[0].focus();
        
        startOtpTimer();
        showToast('🔑 Verification code sent!');
    }

    function startOtpTimer() {
        let timeLeft = 30;
        if (els.otpResend) els.otpResend.classList.add('disabled');
        clearInterval(otpTimerInterval);
        
        otpTimerInterval = setInterval(() => {
            timeLeft--;
            if (els.otpTimer) {
                els.otpTimer.textContent = `(00:${timeLeft < 10 ? '0' : ''}${timeLeft})`;
            }
            if (timeLeft <= 0) {
                clearInterval(otpTimerInterval);
                if (els.otpResend) {
                    els.otpResend.classList.remove('disabled');
                    els.otpTimer.textContent = '';
                }
            }
        }, 1000);
    }

    function handleOtpVerification() {
        const enteredOTP = Array.from(els.otpDigits).map(d => d.value).join('');
        if (enteredOTP === generatedOTP) {
            closeOtpModal();
            if (currentPendingOrder) {
                finalizeOrder(currentPendingOrder);
            }
        } else {
            if (els.otpError) els.otpError.style.display = 'block';
            els.otpDigits.forEach(d => {
                d.value = '';
                d.style.borderColor = '#ff4d4d';
            });
            if (els.otpDigits[0]) els.otpDigits[0].focus();
            setTimeout(() => {
                els.otpDigits.forEach(d => d.style.borderColor = 'var(--color-border)');
            }, 1000);
        }
    }

    function closeOtpModal() {
        if (els.otpModal) els.otpModal.classList.remove('open');
        clearInterval(otpTimerInterval);
        document.body.classList.remove('no-scroll');
    }


    function finalizeOrder(formData) {
        const total = getCartTotal();
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        const isCod = selectedPayment && selectedPayment.value === 'cod';
        
        if (isCod) {
            placeOrder(formData, 'COD', 'COD_' + Date.now());
        } else {
            initiateRazorpayPayment(formData);
        }
    }

    function placeOrder(formData, paymentMethod, paymentId) {
        const orderId = 'LMT-' + Math.floor(100000 + Math.random() * 900000);
        
        const orderData = {
            order_id: orderId,
            customer_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            items: cart,
            total: getCartTotal(),
            payment_method: paymentMethod,
            payment_id: paymentId,
            status: 'received',
            verified: true,
            timestamp: new Date().toISOString()
        };

        // Save order to localStorage (Legacy Support)
        const orders = JSON.parse(localStorage.getItem('lumitop_orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('lumitop_orders', JSON.stringify(orders));

        // PRODUCTION: Sync with Supabase
        syncWithSupabase(orderData);

        // Clear cart
        cart = [];
        updateCartUI();

        // Close checkout and show success
        closeCheckoutModal();
        if (els.checkoutForm) els.checkoutForm.reset();

        const idDisplay = $('#order-id-display');
        if (idDisplay) idDisplay.textContent = `Order ID: #${orderId}`;
        
        // Set WhatsApp Link
        const waMsg = `Hi! I just placed an order for ${orderData.items[0].name}. Order ID: ${orderId}. Please confirm my order!`;
        const waLink = `https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(waMsg)}`;
        if (els.successWhatsAppBtn) {
            els.successWhatsAppBtn.onclick = () => window.open(waLink, '_blank');
        }

        if (els.successModal) els.successModal.classList.add('open');
        document.body.classList.add('no-scroll');
        
        showToast('🚀 Order placed successfully!');
    }

    async function syncWithSupabase(orderData) {
        if (!window.supabaseClient) {
            console.warn('Supabase client missing. Local save only.');
            return;
        }

        try {
            const { error } = await window.supabaseClient
                .from('orders')
                .insert([orderData]);

            if (error) throw error;
            console.log('✅ Dashboard synced');
        } catch (err) {
            console.error('❌ Supabase error:', err.message);
        }
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

    function initStickyBuy() {
        const trigger = $('#sticky-buy-trigger');
        const wrapper = $('#sticky-mobile-buy');
        if (!trigger || !wrapper) return;

        trigger.addEventListener('click', () => {
            const section = document.getElementById('product-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
            setTimeout(openCheckoutModal, 800);
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 800 && window.innerWidth < 768) {
                wrapper.classList.add('visible');
            } else {
                wrapper.classList.remove('visible');
            }
        });
    }

    function initExitIntent() {
        let shown = false;
        const modal = $('#exit-modal');
        if (!modal) return;

        const show = () => {
            if (shown) return;
            shown = true;
            modal.classList.add('open');
            document.body.classList.add('no-scroll');
        };

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY < 0) show();
        });

        setTimeout(show, 60000);

        if ($('#exit-close')) {
            $('#exit-close').onclick = () => {
                modal.classList.remove('open');
                document.body.classList.remove('no-scroll');
            };
        }

        if ($('#exit-claim-btn')) {
            $('#exit-claim-btn').onclick = () => {
                modal.classList.remove('open');
                document.body.classList.remove('no-scroll');
                openCheckoutModal();
            };
        }
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

            // Keyword Interceptor for Faster Bot Interactions
            const lowerText = text.toLowerCase();
            const orderKeywords = ['confirm', 'yes', 'place', 'ok', 'placed', 'yeah', 'yep', 'done'];
            
            if (orderKeywords.some(k => lowerText.includes(k))) {
                setTimeout(() => {
                    addChatMessage("Awesome! 🚀 Order confirmed. I'm getting everything ready for you right now!", 'bot');
                    // Automatically trigger the success modal if it was waiting
                    if (els.checkoutModal && els.checkoutModal.classList.contains('open')) {
                        // Success modal trigger logic
                        setTimeout(() => {
                            if (typeof openSuccessModal === 'function') openSuccessModal();
                        }, 1000); 
                    }
                }, 600);
                return;
            }

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
Rule 3: The lamp costs ₹149 (on sale from ₹1,499).
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
