/**
 * THILLAI AMMAN CIVIL SUPPLIERS (TCS)
 * Enterprise Frontend Application Logic
 * 
 * Includes:
 * - Dynamic Navigation & Active Scroll Spy
 * - Accessible Modal System (Quote, Booking, Contact, Admin)
 * - Lightbox Image Gallery with Keyboard Controls
 * - Client-Side Materials Filtering & Instant Search
 * - Project & Gallery Category Filtering
 * - Contextual WhatsApp Deep-Links
 * - Lead Validation & Local/Backend Submission
 * - Admin Lead Management Dashboard with Passcode Protection & CSV Export
 */

(function () {
  'use strict';

  // Constants
  const WHATSAPP_PHONE = '917339301146';
  const ADMIN_PASSCODE = 'tcs2026'; // Default owner passcode to view customer leads

  // DOM Elements
  const header = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const toastContainer = document.getElementById('toastContainer');

  // -------------------------------------------------------------
  // 1. HEADER SCROLL & MOBILE DRAWER
  // -------------------------------------------------------------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      mobileMenuBtn.innerHTML = isOpen ? 
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' :
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close drawer when clicking any nav link
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }

  // Active link scroll spy
  const sections = document.querySelectorAll('section[id], footer[id]');
  const observerOptions = { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

  // -------------------------------------------------------------
  // 2. MODAL SYSTEM
  // -------------------------------------------------------------
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Global trigger listener
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalType = btn.getAttribute('data-open-modal');
      const modalId = 'modal-' + modalType;

      // Check for pre-filled material
      if (modalType === 'quote' && btn.hasAttribute('data-material')) {
        const materialName = btn.getAttribute('data-material');
        const sel = document.getElementById('quote-material');
        if (sel) sel.value = materialName;
        const badge = document.getElementById('quote-active-item');
        if (badge) {
          badge.textContent = 'Selected: ' + materialName;
          badge.style.display = 'inline-flex';
        }
      }

      // Check for pre-filled equipment
      if (modalType === 'booking' && btn.hasAttribute('data-equipment')) {
        const equipName = btn.getAttribute('data-equipment');
        const hiddenInp = document.getElementById('booking-equipment-input');
        if (hiddenInp) hiddenInp.value = equipName;
        const badge = document.getElementById('booking-active-item');
        if (badge) {
          badge.textContent = 'Selected Equipment: ' + equipName;
          badge.style.display = 'inline-flex';
        }
      }

      // Check for pre-filled service
      if (modalType === 'quote' && btn.hasAttribute('data-service')) {
        const serviceName = btn.getAttribute('data-service');
        const sel = document.getElementById('quote-material');
        if (sel) sel.value = serviceName;
        const badge = document.getElementById('quote-active-item');
        if (badge) {
          badge.textContent = 'Selected Service: ' + serviceName;
          badge.style.display = 'inline-flex';
        }
      }

      openModal(modalId);
    });
  });

  // Close buttons and backdrop clicks
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal(backdrop);
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.closest('.modal-backdrop'));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(closeModal);
      closeLightbox();
    }
  });

  // -------------------------------------------------------------
  // 3. TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------
  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    if (type === 'success') {
      icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    }
    toast.innerHTML = `${icon}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // -------------------------------------------------------------
  // 4. CONTEXTUAL WHATSAPP GENERATOR
  // -------------------------------------------------------------
  function buildWhatsAppUrl(text) {
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text.trim())}`;
  }

  // Material direct WhatsApp CTA
  document.querySelectorAll('[data-wa-material]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mat = btn.getAttribute('data-wa-material') || 'Construction Materials';
      const msg = `Hello TCS,\n\nI would like to enquire about ${mat}.\nQuantity: \nDelivery Location: Coimbatore\nRequired Date: `;
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener');
    });
  });

  // Equipment direct WhatsApp CTA
  document.querySelectorAll('[data-wa-equipment]').forEach(btn => {
    btn.addEventListener('click', () => {
      const eq = btn.getAttribute('data-wa-equipment') || 'Heavy Equipment';
      const msg = `Hello TCS,\n\nI would like to enquire about ${eq} rental.\nSite Location: Coimbatore\nRequired Date: \nDuration / Shift: \nWork Type: `;
      window.open(buildWhatsAppUrl(msg), '_blank', 'noopener');
    });
  });

  // -------------------------------------------------------------
  // 5. MATERIALS SEARCH & CATEGORY FILTER
  // -------------------------------------------------------------
  const materialFilterBtns = document.querySelectorAll('[data-material-filter]');
  const materialCards = document.querySelectorAll('.material-card');
  const materialSearchInp = document.getElementById('materialSearch');
  const materialsEmptyState = document.getElementById('materialsEmptyState');

  let activeMaterialCategory = 'ALL';
  let materialSearchQuery = '';

  function filterMaterials() {
    let matchCount = 0;

    materialCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category') || '';
      const cardTitle = (card.querySelector('h3') ? card.querySelector('h3').textContent : '').toLowerCase();
      const cardDesc = (card.querySelector('.material-card-desc') ? card.querySelector('.material-card-desc').textContent : '').toLowerCase();
      
      const matchesCategory = (activeMaterialCategory === 'ALL' || cardCategory === activeMaterialCategory);
      const matchesSearch = (!materialSearchQuery || cardTitle.includes(materialSearchQuery) || cardDesc.includes(materialSearchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (materialsEmptyState) {
      materialsEmptyState.style.display = matchCount === 0 ? 'block' : 'none';
    }
  }

  materialFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      materialFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMaterialCategory = btn.getAttribute('data-material-filter');
      filterMaterials();
    });
  });

  if (materialSearchInp) {
    materialSearchInp.addEventListener('input', (e) => {
      materialSearchQuery = e.target.value.toLowerCase().trim();
      filterMaterials();
    });
  }

  // -------------------------------------------------------------
  // 6. PROJECTS FILTER
  // -------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (cat === 'ALL' || cardCat === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------
  // 7. GALLERY FILTER & LIGHTBOX
  // -------------------------------------------------------------
  const galleryFilterBtns = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCat = document.getElementById('lightboxCat');
  let currentGalleryIndex = 0;
  let visibleGalleryItems = [];

  function updateVisibleGallery() {
    visibleGalleryItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
  }

  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-gallery-filter');

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'ALL' || itemCat === cat) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
      updateVisibleGallery();
    });
  });

  updateVisibleGallery();

  function showLightboxIndex(index) {
    if (!visibleGalleryItems.length) return;
    if (index < 0) index = visibleGalleryItems.length - 1;
    if (index >= visibleGalleryItems.length) index = 0;
    currentGalleryIndex = index;

    const item = visibleGalleryItems[currentGalleryIndex];
    const imgUrl = item.getAttribute('data-image');
    const title = item.getAttribute('data-title');
    const cat = item.getAttribute('data-category');

    lightboxImg.src = imgUrl;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxCat.textContent = cat;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateVisibleGallery();
      const idx = visibleGalleryItems.indexOf(item);
      if (idx !== -1) showLightboxIndex(idx);
    });
  });

  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxIndex(currentGalleryIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxIndex(currentGalleryIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'ArrowLeft') showLightboxIndex(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') showLightboxIndex(currentGalleryIndex + 1);
    }
  });

  // -------------------------------------------------------------
  // 8. FORM SUBMISSION & VALIDATION
  // -------------------------------------------------------------
  function validateIndianMobile(phone) {
    const cleaned = (phone || '').replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  }

  // ---- Form: Request Quote ----
  const formQuote = document.getElementById('form-quote');
  const alertQuote = document.getElementById('alert-quote');
  const btnQuoteWa = document.getElementById('btn-quote-whatsapp-fallback');

  if (formQuote) {
    formQuote.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertQuote.className = 'form-alert';
      alertQuote.textContent = '';

      const formData = new FormData(formQuote);
      const name = formData.get('name')?.trim();
      const mobile = formData.get('mobile')?.trim();
      const material = formData.get('material');
      const location = formData.get('location')?.trim();

      if (!name) {
        showAlert(alertQuote, 'Please enter your full name.', 'error');
        return;
      }
      if (!validateIndianMobile(mobile)) {
        showAlert(alertQuote, 'Please enter a valid 10-digit Indian mobile number.', 'error');
        return;
      }
      if (!material) {
        showAlert(alertQuote, 'Please select the required material or service.', 'error');
        return;
      }
      if (!location) {
        showAlert(alertQuote, 'Please specify your site/delivery location.', 'error');
        return;
      }

      const submitBtn = formQuote.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Request…';

      try {
        const leadObj = {
          type: 'quote',
          name,
          mobile,
          email: formData.get('email')?.trim(),
          material,
          quantity: formData.get('quantity')?.trim(),
          unit: formData.get('unit'),
          location,
          preferredDate: formData.get('preferredDate'),
          projectType: formData.get('projectType'),
          message: formData.get('message')?.trim(),
          file: formData.get('drawing')
        };

        await window.TCS_LeadStore.addLead(leadObj);

        showAlert(alertQuote, 'Thank you for contacting TCS. Your quote request has been received. Our team will contact you shortly.', 'success');
        showToast('Quote request submitted successfully!', 'success');
        formQuote.reset();

        setTimeout(() => {
          closeModal(document.getElementById('modal-quote'));
          alertQuote.className = 'form-alert';
        }, 3000);
      } catch (err) {
        showAlert(alertQuote, 'Could not complete submission. Please call us directly at 73393 01146.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Quote Request';
      }
    });

    if (btnQuoteWa) {
      btnQuoteWa.addEventListener('click', () => {
        const formData = new FormData(formQuote);
        const name = formData.get('name')?.trim() || '';
        const material = formData.get('material') || 'Construction Material';
        const qty = formData.get('quantity')?.trim() || '';
        const unit = formData.get('unit') || '';
        const loc = formData.get('location')?.trim() || 'Coimbatore';
        const date = formData.get('preferredDate') || '';

        const msg = `Hello TCS,\n\nI would like to request a quote.\nName: ${name}\nMaterial: ${material}\nQuantity: ${qty} ${unit}\nLocation: ${loc}\nRequired Date: ${date}`;
        window.open(buildWhatsAppUrl(msg), '_blank', 'noopener');
      });
    }
  }

  // ---- Form: Equipment Booking ----
  const formBooking = document.getElementById('form-booking');
  const alertBooking = document.getElementById('alert-booking');
  const btnBookingWa = document.getElementById('btn-booking-whatsapp-fallback');

  if (formBooking) {
    formBooking.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertBooking.className = 'form-alert';
      alertBooking.textContent = '';

      const formData = new FormData(formBooking);
      const name = formData.get('name')?.trim();
      const mobile = formData.get('mobile')?.trim();
      const equipment = formData.get('equipment')?.trim() || 'Heavy Equipment';
      const location = formData.get('location')?.trim();

      if (!name) {
        showAlert(alertBooking, 'Please enter your name.', 'error');
        return;
      }
      if (!validateIndianMobile(mobile)) {
        showAlert(alertBooking, 'Please enter a valid 10-digit mobile number.', 'error');
        return;
      }
      if (!location) {
        showAlert(alertBooking, 'Please enter the site location in Coimbatore.', 'error');
        return;
      }

      const submitBtn = formBooking.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting Booking…';

      try {
        const leadObj = {
          type: 'booking',
          name,
          mobile,
          email: formData.get('email')?.trim(),
          equipment,
          location,
          preferredDate: formData.get('preferredDate'),
          requiredTime: formData.get('requiredTime'),
          duration: formData.get('duration'),
          workType: formData.get('workType'),
          message: formData.get('message')?.trim()
        };

        await window.TCS_LeadStore.addLead(leadObj);

        showAlert(alertBooking, 'Thank you. Your equipment booking enquiry has been received. TCS will contact you shortly.', 'success');
        showToast('Booking request received!', 'success');
        formBooking.reset();

        setTimeout(() => {
          closeModal(document.getElementById('modal-booking'));
          alertBooking.className = 'form-alert';
        }, 3000);
      } catch (err) {
        showAlert(alertBooking, 'Could not complete booking. Please call 73393 01146 directly.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking Request';
      }
    });

    if (btnBookingWa) {
      btnBookingWa.addEventListener('click', () => {
        const formData = new FormData(formBooking);
        const name = formData.get('name')?.trim() || '';
        const equip = formData.get('equipment') || 'Heavy Equipment';
        const loc = formData.get('location')?.trim() || 'Coimbatore';
        const date = formData.get('preferredDate') || '';
        const dur = formData.get('duration') || '';

        const msg = `Hello TCS,\n\nI want to book equipment.\nName: ${name}\nEquipment: ${equip}\nSite Location: ${loc}\nDate: ${date}\nDuration: ${dur}`;
        window.open(buildWhatsAppUrl(msg), '_blank', 'noopener');
      });
    }
  }

  // ---- Form: Contact Section ----
  const formContact = document.getElementById('form-contact');
  const alertContact = document.getElementById('alert-contact');

  if (formContact) {
    formContact.addEventListener('submit', async (e) => {
      e.preventDefault();
      alertContact.className = 'form-alert';
      alertContact.textContent = '';

      const formData = new FormData(formContact);
      const name = formData.get('name')?.trim();
      const mobile = formData.get('mobile')?.trim();
      const message = formData.get('message')?.trim();

      if (!name || !validateIndianMobile(mobile) || !message) {
        showAlert(alertContact, 'Please complete all required fields with a valid 10-digit mobile number.', 'error');
        return;
      }

      const submitBtn = formContact.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message…';

      try {
        const leadObj = {
          type: 'contact',
          name,
          mobile,
          email: formData.get('email')?.trim(),
          message,
          location: 'Coimbatore General Enquiry'
        };

        await window.TCS_LeadStore.addLead(leadObj);

        showAlert(alertContact, 'Thank you! Your message has been delivered to TCS. We will respond promptly.', 'success');
        showToast('Message sent successfully!', 'success');
        formContact.reset();
      } catch (err) {
        showAlert(alertContact, 'Could not send message. Please call 73393 01146.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  function showAlert(alertEl, msg, type) {
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = `form-alert ${type}`;
  }

  // -------------------------------------------------------------
  // 9. ADMIN LEAD MANAGEMENT DASHBOARD
  // -------------------------------------------------------------
  const adminBtn = document.getElementById('adminAccessBtn');
  const adminModal = document.getElementById('modal-admin');
  const adminLeadsTbody = document.getElementById('adminLeadsTbody');
  const adminExportCsvBtn = document.getElementById('adminExportCsvBtn');
  const adminFilterBtns = document.querySelectorAll('[data-admin-filter]');
  let activeAdminFilter = 'ALL';
  let isAdminAuthenticated = false;

  function renderAdminLeads() {
    if (!adminLeadsTbody) return;
    let leads = window.TCS_LeadStore.getLeads();

    if (activeAdminFilter !== 'ALL') {
      leads = leads.filter(l => l.status === activeAdminFilter);
    }

    if (!leads.length) {
      adminLeadsTbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--silver-mute);">No customer enquiries found in this view.</td></tr>`;
      return;
    }

    adminLeadsTbody.innerHTML = leads.map(l => {
      const dateStr = new Date(l.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      const statusClass = 'status-' + l.status.toLowerCase();
      const followUpWa = `https://wa.me/91${l.mobile}?text=${encodeURIComponent('Hello ' + l.name + ', this is Thillai Amman Civil Suppliers regarding your enquiry for ' + (l.item || 'materials/equipment') + '.')}`;

      return `
        <tr>
          <td><strong style="color:var(--white);font-size:0.78rem;">${l.id}</strong><br><span style="font-size:0.7rem;color:var(--silver-mute);">${dateStr}</span></td>
          <td><span class="lead-status-pill status-${l.type}">${l.type}</span></td>
          <td>
            <strong style="color:var(--white);">${l.name}</strong><br>
            <a href="tel:${l.mobile}" style="font-size:0.8rem;color:var(--sky);">${l.mobile}</a>
          </td>
          <td>
            <strong>${l.item || 'General'}</strong>
            ${l.quantity ? `<br><span style="font-size:0.75rem;color:var(--silver-mute);">${l.quantity} ${l.unit || ''}</span>` : ''}
          </td>
          <td style="font-size:0.8rem;">${l.location || '—'}</td>
          <td>
            <select class="lead-status-select" data-lead-id="${l.id}" style="background:#0A1622;color:var(--white);border:1px solid var(--navy-border);border-radius:4px;padding:4px 6px;font-size:0.76rem;">
              <option value="NEW" ${l.status === 'NEW' ? 'selected' : ''}>NEW</option>
              <option value="CONTACTED" ${l.status === 'CONTACTED' ? 'selected' : ''}>CONTACTED</option>
              <option value="QUOTED" ${l.status === 'QUOTED' ? 'selected' : ''}>QUOTED</option>
              <option value="CONFIRMED" ${l.status === 'CONFIRMED' ? 'selected' : ''}>CONFIRMED</option>
              <option value="COMPLETED" ${l.status === 'COMPLETED' ? 'selected' : ''}>COMPLETED</option>
              <option value="CANCELLED" ${l.status === 'CANCELLED' ? 'selected' : ''}>CANCELLED</option>
            </select>
          </td>
          <td>
            <div style="display:flex;gap:6px;">
              <a href="${followUpWa}" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp" style="padding:4px 8px;font-size:0.7rem;" title="Chat with customer on WhatsApp">WA</a>
              <button type="button" class="btn btn-sm btn-secondary delete-lead-btn" data-delete-id="${l.id}" style="padding:4px 8px;font-size:0.7rem;" title="Delete Lead">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Wire up status dropdown change
    adminLeadsTbody.querySelectorAll('.lead-status-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const id = sel.getAttribute('data-lead-id');
        const newStatus = e.target.value;
        window.TCS_LeadStore.updateStatus(id, newStatus);
        showToast(`Lead ${id} status updated to ${newStatus}`, 'info');
      });
    });

    // Wire up delete button
    adminLeadsTbody.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-id');
        if (confirm(`Are you sure you want to remove lead ${id}?`)) {
          window.TCS_LeadStore.deleteLead(id);
          renderAdminLeads();
          showToast(`Lead ${id} removed.`, 'info');
        }
      });
    });
  }

  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      if (!isAdminAuthenticated) {
        const code = prompt('Enter TCS Owner Security Passcode:');
        if (code === ADMIN_PASSCODE) {
          isAdminAuthenticated = true;
          openModal('modal-admin');
          renderAdminLeads();
        } else if (code !== null) {
          alert('Incorrect security passcode.');
        }
      } else {
        openModal('modal-admin');
        renderAdminLeads();
      }
    });
  }

  adminFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      adminFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAdminFilter = btn.getAttribute('data-admin-filter');
      renderAdminLeads();
    });
  });

  if (adminExportCsvBtn) {
    adminExportCsvBtn.addEventListener('click', () => {
      window.TCS_LeadStore.exportCSV();
    });
  }

  // Listen for storage updates
  window.addEventListener('tcs:lead_added', () => {
    if (adminModal && adminModal.classList.contains('open')) {
      renderAdminLeads();
    }
  });

})();
