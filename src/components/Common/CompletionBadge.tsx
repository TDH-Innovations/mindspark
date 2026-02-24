import React from 'react';
import { Achievement } from '../../types/game.types';
import './CompletionBadge.css';

interface CompletionBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
}

const CompletionBadge: React.FC<CompletionBadgeProps> = ({ achievement, unlocked }) => {
  const percentage = achievement.requirement > 0
    ? (achievement.progress / achievement.requirement) * 100
    : 0;

  return (
    <div className={`completion-badge ${unlocked ? 'unlocked' : 'locked'}`}>
      <div className="badge-icon">
        <span className={unlocked ? '' : 'grayscale'}>{achievement.icon}</span>
      </div>
      
      <div className="badge-content">
        <h4 className="badge-title">{achievement.title}</h4>
        <p className="badge-description">{achievement.description}</p>
        
        {!unlocked && (
          <div className="badge-progress">
            <div className="progress-bar-mini">
              <div
                className="progress-fill-mini"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="progress-text-mini">
              {achievement.progress} / {achievement.requirement}
            </span>
          </div>
        )}

        {unlocked && achievement.unlockedDate && (
          <p className="unlocked-date">
            Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default CompletionBadge;
