// Assessment Timeline Management System
// Handles weekly assessment limits and tracking

export class AssessmentTimelineManager {
  constructor() {
    this.WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    this.storageKey = 'assessmentTimeline';
  }

  // Get assessment timeline data from localStorage
  getTimelineData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading assessment timeline:', error);
      return {};
    }
  }

  // Save assessment timeline data to localStorage
  saveTimelineData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving assessment timeline:', error);
    }
  }

  // Check if user can take a specific assessment type
  canTakeAssessment(assessmentType) {
    const timeline = this.getTimelineData();
    const lastTaken = timeline[assessmentType]?.lastTaken;

    if (!lastTaken) {
      return { allowed: true, reason: 'First time taking this assessment' };
    }

    const lastTakenDate = new Date(lastTaken);
    const now = new Date();
    const timeSinceLast = now - lastTakenDate;

    if (timeSinceLast >= this.WEEK_IN_MS) {
      return { allowed: true, reason: 'Week has passed since last assessment' };
    }

    const timeRemaining = this.WEEK_IN_MS - timeSinceLast;
    const nextAvailableDate = new Date(lastTakenDate.getTime() + this.WEEK_IN_MS);

    return {
      allowed: false,
      reason: 'Assessment taken within the last week',
      timeRemaining: timeRemaining,
      nextAvailableDate: nextAvailableDate,
      lastTakenDate: lastTakenDate
    };
  }

  // Record that an assessment was taken
  recordAssessmentTaken(assessmentType, score, stressLevel) {
    const timeline = this.getTimelineData();
    const now = new Date();

    if (!timeline[assessmentType]) {
      timeline[assessmentType] = {
        history: []
      };
    }

    // Add current assessment to history
    timeline[assessmentType].lastTaken = now.toISOString();
    timeline[assessmentType].lastScore = score;
    timeline[assessmentType].lastStressLevel = stressLevel;
    timeline[assessmentType].totalTaken = (timeline[assessmentType].totalTaken || 0) + 1;

    // Add to history array
    timeline[assessmentType].history.push({
      date: now.toISOString(),
      score: score,
      stressLevel: stressLevel,
      timestamp: now.getTime()
    });

    // Keep only last 10 assessments in history
    if (timeline[assessmentType].history.length > 10) {
      timeline[assessmentType].history = timeline[assessmentType].history.slice(-10);
    }

    this.saveTimelineData(timeline);

    return {
      success: true,
      nextAvailableDate: new Date(now.getTime() + this.WEEK_IN_MS)
    };
  }

  // Get formatted time remaining until next assessment
  getTimeRemainingFormatted(assessmentType) {
    const canTake = this.canTakeAssessment(assessmentType);
    
    if (canTake.allowed) {
      return { available: true, message: 'Available now' };
    }

    const timeRemaining = canTake.timeRemaining;
    const days = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));

    let message = 'Available in ';
    if (days > 0) {
      message += `${days} day${days !== 1 ? 's' : ''}`;
      if (hours > 0) message += ` and ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      message += `${hours} hour${hours !== 1 ? 's' : ''}`;
      if (minutes > 0) message += ` and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      message += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    return {
      available: false,
      message: message,
      nextAvailableDate: canTake.nextAvailableDate,
      lastTakenDate: canTake.lastTakenDate
    };
  }

  // Get assessment history for a specific type
  getAssessmentHistory(assessmentType) {
    const timeline = this.getTimelineData();
    return timeline[assessmentType]?.history || [];
  }

  // Get all assessment statuses
  getAllAssessmentStatuses() {
    const assessmentTypes = ['phq-9', 'gad-7', 'ghq-12'];
    const statuses = {};

    assessmentTypes.forEach(type => {
      const canTake = this.canTakeAssessment(type);
      const timeRemaining = this.getTimeRemainingFormatted(type);
      const timeline = this.getTimelineData();
      const assessmentData = timeline[type];

      statuses[type] = {
        name: this.getAssessmentName(type),
        canTake: canTake.allowed,
        timeRemaining: timeRemaining,
        lastTaken: assessmentData?.lastTaken ? new Date(assessmentData.lastTaken) : null,
        lastScore: assessmentData?.lastScore,
        lastStressLevel: assessmentData?.lastStressLevel,
        totalTaken: assessmentData?.totalTaken || 0,
        history: assessmentData?.history || []
      };
    });

    return statuses;
  }

  // Get human-readable assessment names
  getAssessmentName(type) {
    const names = {
      'phq-9': 'Depression Assessment (PHQ-9)',
      'gad-7': 'Anxiety Assessment (GAD-7)',
      'ghq-12': 'General Health Assessment (GHQ-12)'
    };
    return names[type] || type;
  }

  // Get progress tracking data
  getProgressData(assessmentType) {
    const history = this.getAssessmentHistory(assessmentType);
    
    if (history.length < 2) {
      return { hasProgress: false, message: 'Take more assessments to see progress' };
    }

    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    
    const scoreDifference = latest.score - previous.score;
    const stressLevelChange = this.compareStressLevels(previous.stressLevel, latest.stressLevel);

    return {
      hasProgress: true,
      latest: latest,
      previous: previous,
      scoreDifference: scoreDifference,
      scoreImproved: scoreDifference < 0, // Lower scores are better
      stressLevelChange: stressLevelChange,
      trend: this.calculateTrend(history),
      recommendation: this.getProgressRecommendation(scoreDifference, stressLevelChange)
    };
  }

  // Compare stress levels
  compareStressLevels(previous, current) {
    const levels = { 'low': 1, 'medium': 2, 'high': 3 };
    const prevLevel = levels[previous] || 2;
    const currLevel = levels[current] || 2;
    
    if (currLevel < prevLevel) return 'improved';
    if (currLevel > prevLevel) return 'worsened';
    return 'same';
  }

  // Calculate overall trend from history
  calculateTrend(history) {
    if (history.length < 3) return 'insufficient_data';
    
    const recent = history.slice(-3);
    const scores = recent.map(h => h.score);
    
    let improving = 0;
    let worsening = 0;
    
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] < scores[i-1]) improving++;
      if (scores[i] > scores[i-1]) worsening++;
    }
    
    if (improving > worsening) return 'improving';
    if (worsening > improving) return 'worsening';
    return 'stable';
  }

  // Get progress-based recommendations
  getProgressRecommendation(scoreDifference, stressLevelChange) {
    if (scoreDifference < 0 && stressLevelChange === 'improved') {
      return {
        type: 'positive',
        message: 'Great progress! Your mental health is improving. Keep up the good work!',
        icon: '🎉'
      };
    } else if (scoreDifference > 0 && stressLevelChange === 'worsened') {
      return {
        type: 'concerning',
        message: 'Your stress levels have increased. Consider implementing more coping strategies.',
        icon: '⚠️'
      };
    } else {
      return {
        type: 'neutral',
        message: 'Your mental health status is relatively stable. Continue monitoring.',
        icon: '📊'
      };
    }
  }

  // Reset timeline data (for testing or fresh start)
  resetTimelineData() {
    localStorage.removeItem(this.storageKey);
    return { success: true, message: 'Assessment timeline reset successfully' };
  }

  // Get weekly summary
  getWeeklySummary() {
    const timeline = this.getTimelineData();
    const oneWeekAgo = new Date(Date.now() - this.WEEK_IN_MS);
    
    let assessmentsTaken = 0;
    let averageStressLevel = 0;
    let stressLevels = [];
    
    Object.keys(timeline).forEach(assessmentType => {
      const lastTaken = timeline[assessmentType]?.lastTaken;
      if (lastTaken && new Date(lastTaken) > oneWeekAgo) {
        assessmentsTaken++;
        const stressLevel = timeline[assessmentType].lastStressLevel;
        stressLevels.push(stressLevel);
      }
    });
    
    return {
      assessmentsTaken,
      stressLevels,
      weeklyActivity: assessmentsTaken > 0 ? 'active' : 'inactive',
      needsAttention: stressLevels.includes('high')
    };
  }
}

// Create singleton instance
export const assessmentTimeline = new AssessmentTimelineManager();

export default assessmentTimeline;