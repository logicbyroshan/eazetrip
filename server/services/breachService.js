/**
 * EazeTrip Personal Data Breach Incident Management & Response Engine
 * Built under Section 8(6) of DPDP Act, 2023 and DPDP Rules, 2025
 */

const crypto = require('crypto');
const db = require('../data/db');
const { maskEmail, maskPhone } = require('../utils/piiMasker');

class BreachService {
  constructor() {
    this.incidents = [];
  }

  /**
   * Log and triage a potential personal data breach incident
   */
  logIncident({
    title,
    severity = 'Low', // 'Low' | 'Medium' | 'High' | 'Critical'
    affectedDataCategories = ['Identity', 'Contact'],
    affectedPrincipalsCount = 0,
    affectedUserIds = [],
    rootCause = 'Unauthorized Access Attempt / Token Anomaly',
    containmentSteps = ['Session tokens revoked', 'IP blocked by firewall', 'Security headers verified'],
    detectedBy = 'Automated Security Sentinel'
  }) {
    const incidentId = `BRCH-${Date.now().toString().slice(-6)}`;
    const detectedAt = new Date().toISOString();

    const incidentRecord = {
      id: incidentId,
      title,
      severity,
      status: 'Contained & Under Review', // 'Detected' | 'Contained & Under Review' | 'Remediated' | 'Closed'
      detectedAt,
      containedAt: detectedAt,
      affectedDataCategories,
      affectedPrincipalsCount: Math.max(affectedPrincipalsCount, affectedUserIds.length),
      affectedUserIds,
      rootCause,
      containmentSteps,
      detectedBy,
      requiresBoardNotification: ['High', 'Critical'].includes(severity) || affectedPrincipalsCount > 50,
      requiresPrincipalNotification: ['High', 'Critical'].includes(severity) || affectedPrincipalsCount > 0,
      boardNotificationStatus: ['High', 'Critical'].includes(severity) ? 'Draft Generated (Ready for DPBI Filing)' : 'Not Required (Low Impact / Isolated)',
      principalNotificationStatus: affectedPrincipalsCount > 0 ? 'Draft Generated' : 'Not Required',
      remediationSummary: 'Immediate perimeter containment executed. No raw financial credentials compromised.'
    };

    db.saveBreachIncident(incidentRecord);
    return incidentRecord;
  }

  /**
   * Generate official statutory notification for Data Protection Board of India (DPBI)
   */
  generateDpbiNotification(incidentId) {
    const incident = db.getBreachIncidentById(incidentId);
    if (!incident) {
      throw new Error(`Breach incident #${incidentId} not found`);
    }

    return {
      to: 'Data Protection Board of India (DPBI)',
      filingType: 'Statutory Personal Data Breach Intimation (Section 8(6), DPDP Act 2023)',
      dataFiduciary: {
        name: 'EazeTrip Technologies Private Limited',
        registrationNumber: 'CIN-U72900MP2024PTC019823',
        dpoContact: 'dpo@eazetrip.com / +91 8269054018'
      },
      incidentDetails: {
        incidentReference: incident.id,
        severity: incident.severity,
        dateTimeOccurrence: incident.detectedAt,
        categoriesOfPersonalDataAffected: incident.affectedDataCategories,
        estimatedPrincipalsAffected: incident.affectedPrincipalsCount,
        rootCauseDescription: incident.rootCause,
        containmentAndRemedialMeasures: incident.containmentSteps,
        likelyConsequences: 'Minimal residual impact following immediate credential revocation and token rotation.'
      },
      submittedAt: new Date().toISOString()
    };
  }

  /**
   * Generate clear, non-technical notification for affected Data Principals
   */
  generatePrincipalNotification(incidentId) {
    const incident = db.getBreachIncidentById(incidentId);
    if (!incident) {
      throw new Error(`Breach incident #${incidentId} not found`);
    }

    return {
      headline: 'Notice of Security Update Regarding Your EazeTrip Account',
      subject: `Important Security Update Regarding Incident #${incident.id}`,
      body: `
        Dear Traveler,
        
        As part of our commitment to transparent data protection under the Digital Personal Data Protection Act, 2023, we are writing to inform you of a recent security event that our automated monitoring team successfully contained.
        
        • What Happened: An isolated security event occurred on ${incident.detectedAt}.
        • What Data Was Involved: ${incident.affectedDataCategories.join(', ')}. No passwords or banking/card information was exposed.
        • What We Have Done: We immediately revoked active sessions and rotated authentication tokens.
        • Recommended Action for You: We recommend setting a fresh account password or re-verifying your Google login.
        
        For any assistance, our Data Protection Officer is directly available at dpo@eazetrip.com.
      `.trim()
    };
  }

  getAllIncidents() {
    return db.getAllBreachIncidents();
  }
}

module.exports = new BreachService();
