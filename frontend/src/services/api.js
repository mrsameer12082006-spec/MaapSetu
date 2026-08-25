/**
 * Isolated Mock API Layer for Legal Metrology Verification Platform (MaapSetu)
 *
 * All components invoke functions from this file.
 * To integrate a real backend, replace the internal simulated delay & state calls
 * with real fetch/axios requests. Component interfaces will remain unchanged!
 */

import { OCR_SAMPLE_PRESETS } from '../data/initialData';

const MOCK_LATENCY = 400; // Simulated latency in ms

const sleep = (ms = MOCK_LATENCY) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApiService = {
  // --- OCR / AI Extractor Service ---
  /**
   * Simulates OCR scanning of an uploaded instrument identification plate photo
   * @param {File | string} file - Uploaded image or preset
   * @returns {Promise<{success: boolean, extractedData: object, confidence: object}>}
   */
  async extractInstrumentPlateData(file) {
    await sleep(900); // OCR simulated processing delay
    
    // Return realistic OCR extracted parameters with confidence metrics
    const preset = OCR_SAMPLE_PRESETS[Math.floor(Math.random() * OCR_SAMPLE_PRESETS.length)];
    return {
      success: true,
      extractedData: {
        type: preset.model.includes('WB') ? 'Heavy Electronic Weighbridge' : preset.model.includes('DS') ? 'Retail Digital Counter Scale' : 'Fuel Dispensing Meter (Multi-Product)',
        manufacturer: preset.manufacturer,
        model: preset.model,
        serialNumber: preset.serialNumber,
        capacity: preset.capacity,
        accuracyClass: preset.accuracyClass,
        extractedAt: new Date().toISOString()
      },
      confidence: preset.confidence,
      ocrNote: 'OCR scan completed with 96% overall confidence. Please review extracted values before submission.'
    };
  },

  // --- Instrument Services ---
  async getInstruments(store) {
    await sleep();
    return [...store.instruments];
  },

  async registerInstrument(store, instrumentData) {
    await sleep(600);
    const newId = `INST-2026-00${store.instruments.length + 1}`;
    const newInstrument = {
      id: newId,
      ...instrumentData,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      lastVerifiedDate: null,
      nextDuePeriod: null,
      certificateId: null
    };
    return newInstrument;
  },

  // --- Application Services ---
  async getApplications(store) {
    await sleep();
    return [...store.applications];
  },

  async getApplicationById(store, id) {
    await sleep();
    return store.applications.find((app) => app.id === id) || null;
  },

  async submitApplication(store, applicationData) {
    await sleep(600);
    const newAppId = `APP-2026-${1000 + store.applications.length + 1}`;
    const targetInst = store.instruments.find((i) => i.id === applicationData.instrumentId);

    const newApp = {
      id: newAppId,
      instrumentId: applicationData.instrumentId,
      instrumentName: targetInst ? `${targetInst.type} (${targetInst.serialNumber})` : 'Selected Instrument',
      applicantName: 'Apex Logistics & Freight Corp',
      applicationType: applicationData.applicationType || 'Periodic Re-verification',
      submissionDate: new Date().toISOString().split('T')[0],
      preferredDate: applicationData.preferredDate || new Date().toISOString().split('T')[0],
      status: 'submitted',
      assignedOfficerId: null,
      assignedOfficerName: null,
      assignedDate: null,
      scheduledInspectionDate: null,
      inspectionLocation: applicationData.inspectionLocation || (targetInst ? targetInst.location : 'On-Site Facility'),
      documents: applicationData.documents || [
        { name: 'Instrument_Calibration_Report.pdf', size: '1.1 MB', url: '#' }
      ],
      notes: applicationData.notes || 'Routine verification requested.',
      timeline: [
        {
          step: 'Application Submitted',
          date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
          actor: 'Business Owner'
        }
      ]
    };
    return newApp;
  },

  async assignOfficerToApplication(store, appId, officerId, scheduledDate, notes) {
    await sleep(500);
    const officer = store.officers.find((o) => o.id === officerId);
    if (!officer) throw new Error('Officer not found');

    const updatedTimelineItem = {
      step: `Assigned to ${officer.name}`,
      date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      actor: 'LMD Admin'
    };

    return {
      appId,
      status: 'assigned',
      assignedOfficerId: officer.id,
      assignedOfficerName: `${officer.name} (${officer.role})`,
      assignedDate: new Date().toISOString().split('T')[0],
      scheduledInspectionDate: scheduledDate,
      notes: notes ? `Admin Note: ${notes}` : undefined,
      timelineItem: updatedTimelineItem
    };
  },

  async updateApplicationStatus(store, appId, status, notes) {
    await sleep(400);
    return { appId, status, notes };
  },

  // --- Officer Verification & Certificate Generation Services ---
  async getOfficerAssignedQueue(store, officerId) {
    await sleep();
    if (!officerId) return store.applications;
    return store.applications.filter((app) => app.assignedOfficerId === officerId || app.status === 'assigned' || app.status === 'in_progress');
  },

  /**
   * Submits inspection test results (PASS / FAIL) from LMO / GATC Officer
   */
  async submitVerificationResult(store, { applicationId, result, observations, evidencePhotos, officerName }) {
    await sleep(800);
    const app = store.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const inst = store.instruments.find((i) => i.id === app.instrumentId);

    const isPass = result === 'PASS';
    let newCert = null;

    if (isPass) {
      const certId = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(issueDate.getFullYear() + 1); // 1-year validity under Legal Metrology Rules

      newCert = {
        id: certId,
        applicationId: app.id,
        instrumentId: inst ? inst.id : app.instrumentId,
        instrumentType: inst ? inst.type : 'Weighing Instrument',
        manufacturer: inst ? inst.manufacturer : 'Verified Manufacturer',
        model: inst ? inst.model : 'Standard Model',
        serialNumber: inst ? inst.serialNumber : 'SN-2026-X',
        capacity: inst ? inst.capacity : 'Standard Load',
        accuracyClass: inst ? inst.accuracyClass : 'Class III',
        ownerName: app.applicantName || 'Apex Logistics & Freight Corp',
        ownerAddress: inst ? inst.location : 'Registered Address',
        verificationAuthority: 'Legal Metrology Department, Govt of India',
        verificationOfficer: officerName || 'Inspector Rajesh V. Sharma (Badge #LMO-NGP-442)',
        verificationDate: issueDate.toISOString().split('T')[0],
        expiryDate: expiryDate.toISOString().split('T')[0],
        status: 'VERIFIED',
        sealNumber: `LMD-SEAL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        qrCodeData: `${window.location.origin}/verify/${certId}`,
        remarks: observations.generalNotes || 'Instrument tested & certified in compliance with Legal Metrology (General) Rules, 2011.',
        issuedAt: issueDate.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      };
    }

    return {
      applicationId,
      result: isPass ? 'passed' : 'failed',
      certificate: newCert,
      timelineItem: {
        step: isPass ? 'Verification PASSED - Certificate Issued' : 'Verification FAILED - Rework Required',
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        actor: officerName || 'Verification Officer'
      }
    };
  },

  // --- Public QR Certificate Verification Services ---
  async getCertificateById(store, certificateId) {
    await sleep(300);
    const cert = store.certificates.find((c) => c.id.toUpperCase() === certificateId.toUpperCase());
    if (!cert) {
      return { found: false, message: `No Legal Metrology Certificate found for ID: ${certificateId}` };
    }

    const isExpired = new Date(cert.expiryDate) < new Date();
    return {
      found: true,
      status: isExpired ? 'EXPIRED' : cert.status,
      certificate: cert
    };
  }
};
