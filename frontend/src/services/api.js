import { supabase } from './supabase';

export const mockApiService = {
  // --- OCR / AI Extractor Service ---
  async extractInstrumentPlateData(file) {
    // Keeping mock OCR for now as OCR is optional for core workflow
    return {
      success: true,
      extractedData: {
        type: 'Heavy Electronic Weighbridge',
        manufacturer: 'Avery India Ltd',
        model: 'WB-60T-PRO',
        serialNumber: 'AV-984210-IN',
        capacity: '60000',
        accuracyClass: 'Class III',
        extractedAt: new Date().toISOString()
      },
      confidence: 96,
      ocrNote: 'OCR scan completed with 96% overall confidence.'
    };
  },

  // --- Instrument Services ---
  async getInstruments() {
    const { data, error } = await supabase.from('instruments').select('*');
    if (error) throw error;
    // Map snake_case to camelCase
    return data.map(inst => ({
      id: inst.id,
      type: inst.category, // Map category back to type for frontend compatibility
      category: inst.category,
      instrumentName: inst.instrument_name,
      serialNumber: inst.serial_number,
      model: inst.model_number,
      manufacturer: inst.manufacturer,
      maxCapacity: inst.max_capacity,
      minCapacity: inst.min_capacity,
      unitOfMeasurement: inst.unit_of_measurement,
      accuracyClass: inst.accuracy_class,
      scaleInterval: inst.scale_interval,
      quantity: inst.quantity,
      location: inst.installation_location,
      premisesName: inst.premises_name,
      state: inst.state,
      district: inst.district,
      modelApprovalNo: inst.model_approval_no,
      previousCertificateNo: inst.previous_certificate_no,
      status: inst.status === 'active' ? 'Verified' : inst.status === 'under_verification' ? 'Pending Verification' : 'Expired', // Status mapping
      lastVerifiedDate: inst.last_verification_date,
      nextDuePeriod: inst.next_reverification_due,
      ownerId: inst.owner_id
    }));
  },

  async registerInstrument(store, instrumentData) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const dbPayload = {
      owner_id: userData.user.id,
      instrument_name: `${instrumentData.type} - ${instrumentData.model}`,
      category: instrumentData.type.toLowerCase().includes('weigh') ? 'weighbridge' : 'retail_scale', // Fallback mapping
      serial_number: instrumentData.serialNumber,
      model_number: instrumentData.model,
      manufacturer: instrumentData.manufacturer,
      max_capacity: instrumentData.capacity || instrumentData.maxCapacity,
      min_capacity: instrumentData.minCapacity,
      unit_of_measurement: instrumentData.unitOfMeasurement || 'kg',
      accuracy_class: instrumentData.accuracyClass,
      scale_interval: instrumentData.scaleInterval,
      quantity: parseInt(instrumentData.quantity) || 1,
      installation_location: instrumentData.location || instrumentData.installationAddress,
      premises_name: instrumentData.premisesName || 'Facility',
      state: instrumentData.state || 'Maharashtra',
      district: instrumentData.district || 'Nagpur',
      model_approval_no: instrumentData.modelApprovalNo,
      previous_certificate_no: instrumentData.previousCertificateNo,
      status: 'under_verification'
    };

    const { data, error } = await supabase.from('instruments').insert([dbPayload]).select().single();
    if (error) throw error;
    
    // Convert back for frontend
    return {
      id: data.id,
      ...instrumentData,
      status: 'Pending Verification',
      registrationDate: data.created_at,
    };
  },

  // --- Application Services ---
  async getApplications() {
    const { data, error } = await supabase.from('applications').select(`
      *,
      instruments (*),
      profiles (*),
      officers (
        *,
        profiles (*)
      )
    `);
    if (error) throw error;

    return data.map(app => ({
      id: app.id,
      applicationNumber: app.application_number,
      instrumentId: app.instrument_id,
      instrumentName: app.instruments ? app.instruments.instrument_name : 'Unknown Instrument',
      applicantName: app.profiles ? app.profiles.name : (app.instruments ? app.instruments.premises_name : 'Unknown Applicant'),
      applicantId: app.applicant_id,
      applicationType: app.application_type,
      submissionDate: app.submitted_at,
      preferredDate: app.preferred_date,
      status: app.status,
      assignedOfficerId: app.assigned_officer_id,
      assignedOfficerName: app.officers && app.officers.profiles ? app.officers.profiles.name : null,
      assignedDate: app.assigned_date,
      scheduledInspectionDate: app.scheduled_inspection_date,
      inspectionLocation: app.inspection_location,
      documents: app.documents,
      notes: app.notes,
      timeline: [], // Will need app_timeline fetch if required, keeping empty array for now to prevent crashes
      
      // Full Nested Objects for Case Reference
      instrument: app.instruments ? {
        id: app.instruments.id,
        name: app.instruments.instrument_name,
        category: app.instruments.category,
        manufacturer: app.instruments.manufacturer,
        model: app.instruments.model_number,
        serialNumber: app.instruments.serial_number,
        modelApprovalNo: app.instruments.model_approval_no,
        maxCapacity: app.instruments.max_capacity,
        minCapacity: app.instruments.min_capacity,
        unitOfMeasurement: app.instruments.unit_of_measurement,
        scaleInterval: app.instruments.scale_interval,
        accuracyClass: app.instruments.accuracy_class,
        quantity: app.instruments.quantity,
        premisesName: app.instruments.premises_name,
        installationLocation: app.instruments.installation_location,
        state: app.instruments.state,
        district: app.instruments.district
      } : null,
      
      applicant: app.profiles ? {
        id: app.profiles.id,
        name: app.profiles.name,
        email: app.profiles.email,
        phone: app.profiles.phone,
        address: app.profiles.address
      } : null
    }));
  },

  async getApplicationById(store, id) {
    // For now we can rely on Context holding the list or we can fetch single
    const { data, error } = await supabase.from('applications').select('*, instruments(*), profiles(*)').eq('id', id).single();
    if (error) return null;
    return {
      id: data.id,
      instrumentId: data.instrument_id,
      // mapping omitted for brevity, Context uses lists mostly
    };
  },

  async submitApplication(store, applicationData) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('Not authenticated');

    const payload = {
      applicant_id: userData.user.id,
      instrument_id: applicationData.instrumentId,
      application_type: applicationData.applicationType || 'Periodic Re-verification',
      status: 'submitted',
      preferred_date: applicationData.preferredDate,
      inspection_location: applicationData.inspectionLocation || 'Facility',
      notes: applicationData.notes,
      documents: applicationData.documents || [],
    };

    const { data, error } = await supabase.from('applications').insert([payload]).select().single();
    if (error) throw error;

    return {
      id: data.id,
      applicationNumber: data.application_number,
      applicantId: data.applicant_id,
      instrumentId: data.instrument_id,
      applicationType: data.application_type,
      status: data.status,
      preferredDate: data.preferred_date,
      inspectionLocation: data.inspection_location,
      notes: data.notes,
      submissionDate: data.created_at,
      documents: data.documents
    };
  },

  async assignOfficerToApplication(store, appId, officerId, scheduledDate, notes) {
    const { data: res, error } = await supabase.functions.invoke('assign-officer', {
      body: { appId, officerId, scheduledDate, notes }
    });
    if (error) throw error;
    return res; // Edge function returns normalized data
  },

  async updateApplicationStatus(store, appId, status, notes) {
    const { error } = await supabase.from('applications').update({ status, notes }).eq('id', appId);
    if (error) throw error;
    return { appId, status, notes };
  },

  // --- Officer Verification & Certificate Generation Services ---
  async getOfficerAssignedQueue(store, officerId) {
    // Now handled natively via getApplications which uses RLS and Context filtering
    return store.applications; 
  },

  async submitVerificationResult(store, payload) {
    const { error, data } = await supabase.functions.invoke('submit-verification', {
      body: payload
    });
    if (error) throw error;
    return data; 
  },

  async generateCertificate(appId) {
    const { error, data } = await supabase.functions.invoke('generate-certificate', {
      body: { applicationId: appId }
    });
    if (error) throw error;
    return data;
  },

  async getCertificates() {
    const { data, error } = await supabase.from('certificates').select('*');
    if (error) throw error;
    return data.map(cert => ({
      id: cert.id,
      certificateNumber: cert.certificate_number,
      applicationId: cert.application_id,
      instrumentId: cert.instrument_id,
      instrumentType: cert.instrument_type,
      serialNumber: cert.serial_number,
      manufacturer: cert.manufacturer,
      model: cert.model,
      capacity: cert.capacity,
      accuracyClass: cert.accuracy_class,
      ownerName: cert.owner_name,
      ownerAddress: cert.owner_address,
      verificationAuthority: cert.verification_authority,
      verificationOfficer: cert.verification_officer,
      verificationDate: cert.verification_date,
      expiryDate: cert.expiry_date,
      status: cert.status, // VERIFIED, EXPIRED, REVOKED
      sealNumber: cert.seal_number,
      qrCodeData: cert.id, // Or token
      remarks: cert.remarks,
      issuedAt: cert.issued_at
    }));
  },

  async getCertificateById(store, certificateId) {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

    if (error || !data) {
      return { found: false, message: `No certificate found for ID: ${certificateId}` };
    }

    return {
      found: true,
      status: data.status,
      certificate: {
        id: data.id,
        certificateNumber: data.certificate_number,
        applicationId: data.application_id,
        instrumentId: data.instrument_id,
        instrumentType: data.instrument_type,
        serialNumber: data.serial_number,
        manufacturer: data.manufacturer,
        model: data.model,
        capacity: data.capacity,
        accuracyClass: data.accuracy_class,
        ownerName: data.owner_name,
        ownerAddress: data.owner_address,
        verificationAuthority: data.verification_authority,
        verificationOfficer: data.verification_officer,
        verificationDate: data.verification_date,
        expiryDate: data.expiry_date,
        status: data.status,
        sealNumber: data.seal_number,
        qrCodeData: data.id,
        remarks: data.remarks,
        issuedAt: data.issued_at
      }
    };
  },

  async getOfficers() {
    const { data, error } = await supabase.from('officers').select('*, profiles(*)');
    if (error) throw error;
    return data.map(o => ({
      id: o.id,
      userId: o.user_id,
      name: o.profiles ? o.profiles.name : 'Unknown',
      role: o.designation,
      zone: o.zone,
      rating: o.rating,
      activeCount: o.active_assignments_count
    }));
  }
};
