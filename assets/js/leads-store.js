/**
 * THILLAI AMMAN CIVIL SUPPLIERS (TCS)
 * Lead Management & Storage Engine
 * 
 * Provides robust offline-first lead capture (localStorage) + asynchronous backend synchronization.
 * Supports Admin lead viewing, status tracking, and CSV/JSON export.
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'tcs_leads_v2';
  const API_BASE = window.TCS_API_BASE || 'http://localhost:5000';

  const LeadStore = {
    /**
     * Retrieve all leads from localStorage
     * @returns {Array} Array of lead objects
     */
    getLeads: function () {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (err) {
        console.warn('[TCS LeadStore] Failed to read leads from storage', err);
        return [];
      }
    },

    /**
     * Save leads list to localStorage
     * @param {Array} leads 
     */
    saveAll: function (leads) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      } catch (err) {
        console.error('[TCS LeadStore] Failed to save leads', err);
      }
    },

    /**
     * Record a new lead
     * @param {Object} data 
     * @returns {Object} saved lead
     */
    addLead: async function (data) {
      const now = new Date();
      const leadId = 'TCS-' + now.getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

      const lead = {
        id: leadId,
        type: data.type || 'quote', // 'quote' | 'booking' | 'contact'
        name: data.name || '',
        mobile: data.mobile || '',
        email: data.email || '',
        item: data.material || data.equipment || data.service || '',
        quantity: data.quantity || '',
        unit: data.unit || '',
        location: data.location || data.deliveryLocation || '',
        preferredDate: data.preferredDate || '',
        requiredTime: data.requiredTime || '',
        duration: data.duration || '',
        workType: data.workType || '',
        projectType: data.projectType || '',
        message: data.message || '',
        status: 'NEW', // 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
        createdAt: now.toISOString(),
        syncedToBackend: false
      };

      // 1. Save to local storage immediately
      const leads = this.getLeads();
      leads.unshift(lead);
      this.saveAll(leads);

      // 2. Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('tcs:lead_added', { detail: lead }));

      // 3. Attempt async backend submission if online
      this.syncWithBackend(lead, data.file);

      return lead;
    },

    /**
     * Asynchronously sync lead to backend API
     * @param {Object} lead 
     * @param {File} file optional drawing file
     */
    syncWithBackend: async function (lead, file) {
      let endpoint = '/api/quote';
      if (lead.type === 'booking') endpoint = '/api/booking';
      if (lead.type === 'contact') endpoint = '/api/contact';

      try {
        let response;
        if (file) {
          const formData = new FormData();
          Object.keys(lead).forEach(k => formData.append(k, lead[k]));
          formData.append('drawing', file);
          response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            body: formData
          });
        } else {
          response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead)
          });
        }

        if (response.ok) {
          const resData = await response.json();
          // Mark synced
          const leads = this.getLeads();
          const target = leads.find(l => l.id === lead.id);
          if (target) {
            target.syncedToBackend = true;
            if (resData.id) target.backendId = resData.id;
            this.saveAll(leads);
          }
          console.log('[TCS Backend Sync] Lead successfully synced:', lead.id);
        }
      } catch (err) {
        // Backend offline or unreachable — perfectly normal in static GitHub Pages deployment
        console.log('[TCS Backend Sync] Backend is offline or unreachable; lead safely recorded in local storage.');
      }
    },

    /**
     * Update lead status
     * @param {string} leadId 
     * @param {string} newStatus 
     */
    updateStatus: function (leadId, newStatus) {
      const leads = this.getLeads();
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        lead.status = newStatus;
        lead.updatedAt = new Date().toISOString();
        this.saveAll(leads);
        window.dispatchEvent(new CustomEvent('tcs:lead_updated', { detail: lead }));
      }
    },

    /**
     * Delete a lead
     * @param {string} leadId 
     */
    deleteLead: function (leadId) {
      let leads = this.getLeads();
      leads = leads.filter(l => l.id !== leadId);
      this.saveAll(leads);
      window.dispatchEvent(new CustomEvent('tcs:leads_changed'));
    },

    /**
     * Export all leads to CSV format
     */
    exportCSV: function () {
      const leads = this.getLeads();
      if (!leads.length) {
        alert('No leads recorded yet to export.');
        return;
      }

      const headers = ['ID', 'Type', 'Name', 'Mobile', 'Email', 'Item/Material', 'Quantity', 'Location', 'Date', 'Project Type', 'Status', 'Created At'];
      const rows = leads.map(l => [
        `"${l.id}"`,
        `"${l.type}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${l.mobile}"`,
        `"${l.email || ''}"`,
        `"${(l.item || '').replace(/"/g, '""')}"`,
        `"${(l.quantity || '') + ' ' + (l.unit || '')}"`,
        `"${(l.location || '').replace(/"/g, '""')}"`,
        `"${l.preferredDate || ''}"`,
        `"${l.projectType || l.workType || ''}"`,
        `"${l.status}"`,
        `"${l.createdAt}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `TCS_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  window.TCS_LeadStore = LeadStore;
})(window);
