// Counselor Alert Service - Automatically notifies counselors of high-risk assessments

export class CounselorAlertService {
  static async sendCounselorAlert(assessmentResult) {
    const { type, score, interpretation, answers, studentInfo } = assessmentResult;
    
    // Check if alert is needed based on thresholds
    const alertNeeded = this.checkAlertThresholds(type, score, answers);
    
    if (alertNeeded.shouldAlert) {
      const alertData = {
        timestamp: new Date().toISOString(),
        studentId: studentInfo?.userId || 'anonymous',
        studentName: studentInfo?.name || studentInfo?.email || 'Anonymous Student',
        assessmentType: type,
        score: score,
        severity: interpretation.severity || 'unknown',
        alertLevel: alertNeeded.alertLevel,
        riskFactors: alertNeeded.riskFactors,
        recommendedAction: alertNeeded.recommendedAction
      };

      // Store alert for counselor dashboard (in real app, this would be a backend API call)
      this.storeAlert(alertData);
      
      // Send notification (in real app, this would trigger email/SMS to counselors)
      this.notifyCounselors(alertData);
      
      return alertData;
    }
    
    return null;
  }

  static checkAlertThresholds(testType, score, answers) {
    const testConfig = this.getTestConfig(testType);
    let shouldAlert = false;
    let alertLevel = 'none';
    let riskFactors = [];
    let recommendedAction = '';

    // Check score-based thresholds
    if (score >= testConfig.emergencyAlert) {
      shouldAlert = true;
      alertLevel = 'emergency';
      recommendedAction = 'Immediate intervention required - Contact student within 24 hours';
      riskFactors.push(`High ${testType} score: ${score}`);
    } else if (score >= testConfig.counselorAlert) {
      shouldAlert = true;
      alertLevel = 'moderate';
      recommendedAction = 'Schedule counseling session within 1 week';
      riskFactors.push(`Elevated ${testType} score: ${score}`);
    }

    // Check for suicide risk (PHQ-9 question 9)
    if (testType === 'PHQ9' && answers[9] > 0) {
      shouldAlert = true;
      alertLevel = 'emergency';
      recommendedAction = 'URGENT: Suicide risk assessment required immediately';
      riskFactors.push('Positive suicide ideation response');
    }

    return {
      shouldAlert,
      alertLevel,
      riskFactors,
      recommendedAction
    };
  }

  static getTestConfig(testType) {
    const configs = {
      PHQ9: { counselorAlert: 15, emergencyAlert: 20 },
      GAD7: { counselorAlert: 10, emergencyAlert: 15 },
      GHQ12: { counselorAlert: 16, emergencyAlert: 21 }
    };
    return configs[testType] || { counselorAlert: 999, emergencyAlert: 999 };
  }

  static storeAlert(alertData) {
    try {
      // Get existing alerts
      const existingAlerts = JSON.parse(localStorage.getItem('counselorAlerts') || '[]');
      
      // Add new alert
      existingAlerts.push(alertData);
      
      // Keep only last 100 alerts
      if (existingAlerts.length > 100) {
        existingAlerts.splice(0, existingAlerts.length - 100);
      }
      
      // Store back
      localStorage.setItem('counselorAlerts', JSON.stringify(existingAlerts));
      
      console.log('🚨 COUNSELOR ALERT STORED:', alertData);
    } catch (error) {
      console.error('Error storing counselor alert:', error);
    }
  }

  static notifyCounselors(alertData) {
    // In a real application, this would:
    // 1. Send email notifications to counselors
    // 2. Send SMS alerts for emergency cases
    // 3. Create dashboard notifications
    // 4. Log to monitoring systems
    
    console.log('🔔 COUNSELOR NOTIFICATION SENT:', {
      level: alertData.alertLevel,
      student: alertData.studentName,
      assessment: alertData.assessmentType,
      score: alertData.score,
      action: alertData.recommendedAction
    });

    // Simulate notification in development
    if (alertData.alertLevel === 'emergency') {
      // Show urgent browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚨 URGENT: Mental Health Alert', {
          body: `Student ${alertData.studentName} requires immediate attention (${alertData.assessmentType}: ${alertData.score})`,
          icon: '/mental-health-icon.png',
          tag: 'mental-health-emergency'
        });
      }
    }
  }

  static getAllAlerts() {
    try {
      return JSON.parse(localStorage.getItem('counselorAlerts') || '[]');
    } catch (error) {
      console.error('Error retrieving counselor alerts:', error);
      return [];
    }
  }

  static getAlertsForStudent(studentId) {
    const allAlerts = this.getAllAlerts();
    return allAlerts.filter(alert => alert.studentId === studentId);
  }

  static markAlertAsHandled(alertId, counselorNotes) {
    try {
      const alerts = this.getAllAlerts();
      const alertIndex = alerts.findIndex(alert => alert.timestamp === alertId);
      
      if (alertIndex !== -1) {
        alerts[alertIndex].status = 'handled';
        alerts[alertIndex].handledAt = new Date().toISOString();
        alerts[alertIndex].counselorNotes = counselorNotes;
        
        localStorage.setItem('counselorAlerts', JSON.stringify(alerts));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error marking alert as handled:', error);
      return false;
    }
  }

  static getUnhandledAlerts() {
    const allAlerts = this.getAllAlerts();
    return allAlerts.filter(alert => alert.status !== 'handled');
  }

  static requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }
}

// Auto-request notification permission when service is loaded
if (typeof window !== 'undefined') {
  CounselorAlertService.requestNotificationPermission();
}
