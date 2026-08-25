import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_INSTRUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_CERTIFICATES,
  MOCK_OFFICERS,
  MOCK_ACTIVITY_LOGS
} from '../data/initialData';
import { mockApiService } from '../services/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [instruments, setInstruments] = useState(INITIAL_INSTRUMENTS);
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [officers, setOfficers] = useState(MOCK_OFFICERS);
  const [activityLogs, setActivityLogs] = useState(MOCK_ACTIVITY_LOGS);

  const currentStore = { instruments, applications, certificates, officers };

  // Helper to add activity log entry
  const addLog = (text, user = 'System') => {
    const newLog = {
      id: Date.now(),
      timestamp: 'Just now',
      text,
      user
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Actions
  const registerInstrument = async (formData) => {
    const newInst = await mockApiService.registerInstrument(currentStore, formData);
    setInstruments((prev) => [newInst, ...prev]);
    addLog(`Registered new instrument: ${newInst.type} (${newInst.serialNumber})`, 'Business Owner');
    return newInst;
  };

  const submitApplication = async (appFormData) => {
    const newApp = await mockApiService.submitApplication(currentStore, appFormData);
    setApplications((prev) => [newApp, ...prev]);
    addLog(`Submitted verification application ${newApp.id} for ${newApp.instrumentName}`, 'Business Owner');
    return newApp;
  };

  const assignOfficer = async (appId, officerId, scheduledDate, notes) => {
    const result = await mockApiService.assignOfficerToApplication(
      currentStore,
      appId,
      officerId,
      scheduledDate,
      notes
    );

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'assigned',
            assignedOfficerId: result.assignedOfficerId,
            assignedOfficerName: result.assignedOfficerName,
            assignedDate: result.assignedDate,
            scheduledInspectionDate: result.scheduledInspectionDate,
            notes: result.notes || app.notes,
            timeline: [...app.timeline, result.timelineItem]
          };
        }
        return app;
      })
    );

    const officer = officers.find((o) => o.id === officerId);
    addLog(`Assigned ${officer ? officer.name : 'Officer'} to application ${appId}`, 'LMD Admin');
    return true;
  };

  const submitVerificationResult = async ({ applicationId, result, observations, evidencePhotos, officerName }) => {
    const response = await mockApiService.submitVerificationResult(currentStore, {
      applicationId,
      result,
      observations,
      evidencePhotos,
      officerName
    });

    const isPass = result === 'PASS';

    // Update Application Status & Timeline
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          return {
            ...app,
            status: response.result, // 'passed' or 'failed'
            timeline: [...app.timeline, response.timelineItem]
          };
        }
        return app;
      })
    );

    // If PASS, create certificate & update instrument status
    if (isPass && response.certificate) {
      setCertificates((prev) => [response.certificate, ...prev]);

      // Update instrument status to Verified and attach new certificate ID
      const app = applications.find((a) => a.id === applicationId);
      if (app) {
        setInstruments((prev) =>
          prev.map((inst) => {
            if (inst.id === app.instrumentId) {
              return {
                ...inst,
                status: 'Verified',
                lastVerifiedDate: response.certificate.verificationDate,
                nextDuePeriod: response.certificate.expiryDate,
                certificateId: response.certificate.id
              };
            }
            return inst;
          })
        );
      }
      addLog(`Verification PASSED for application ${applicationId}. Issued Certificate ${response.certificate.id}`, officerName || 'Officer');
    } else {
      addLog(`Verification FAILED for application ${applicationId}`, officerName || 'Officer');
    }

    return response;
  };

  const runOCR = async (file) => {
    return await mockApiService.extractInstrumentPlateData(file);
  };

  return (
    <DataContext.Provider
      value={{
        instruments,
        applications,
        certificates,
        officers,
        activityLogs,
        registerInstrument,
        submitApplication,
        assignOfficer,
        submitVerificationResult,
        runOCR
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
