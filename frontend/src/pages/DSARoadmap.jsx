import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { progressAPI } from '../services/api';
import './DSARoadmap.css';

const DSA_TOPICS = [
  { id: 'arrays', name: 'Arrays', description: 'Learn about arrays and their operations' },
  { id: 'linked-lists', name: 'Linked Lists', description: 'Understand linked list data structures' },
  { id: 'stacks', name: 'Stacks', description: 'Master stack operations and applications' },
  { id: 'queues', name: 'Queues', description: 'Learn queue data structures' },
  { id: 'trees', name: 'Trees', description: 'Binary trees, BST, and tree traversals' },
  { id: 'graphs', name: 'Graphs', description: 'Graph representations and algorithms' },
  { id: 'sorting', name: 'Sorting Algorithms', description: 'Various sorting techniques' },
  { id: 'searching', name: 'Searching Algorithms', description: 'Binary search and more' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', description: 'DP concepts and problems' },
  { id: 'greedy', name: 'Greedy Algorithms', description: 'Greedy approach to problem solving' },
];

function DSARoadmap() {
  const [topics, setTopics] = useState(DSA_TOPICS);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressAPI.getDSA();
      const progressMap = {};
      response.data.forEach((p) => {
        progressMap[p.topic] = p;
      });
      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = async (topicId, status) => {
    try {
      const topicProgress = progress[topicId] || { progress: 0 };
      const newProgress = status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0;
      
      await progressAPI.updateDSA({
        topic: topicId,
        status,
        progress: newProgress,
      });

      setProgress({
        ...progress,
        [topicId]: {
          topic: topicId,
          status,
          progress: newProgress,
        },
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'in_progress':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Not Started';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="DSA Roadmap">
      <div className="dsa-roadmap">
        <h1>Data Structures & Algorithms Roadmap</h1>
        <p className="roadmap-description">
          Track your progress through the DSA learning path. Mark topics as you complete them.
        </p>

        <div className="topics-grid">
          {topics.map((topic) => {
            const topicProgress = progress[topic.id];
            const status = topicProgress?.status || 'not_started';
            const progressValue = topicProgress?.progress || 0;

            return (
              <div key={topic.id} className="topic-card">
                <div className="topic-header">
                  <h3>{topic.name}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    {getStatusLabel(status)}
                  </span>
                </div>
                <p className="topic-description">{topic.description}</p>
                
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progressValue}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                    />
                  </div>
                  <span className="progress-text">{progressValue}%</span>
                </div>

                <div className="topic-actions">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateTopicStatus(topic.id, 'in_progress')}
                    disabled={status === 'completed'}
                  >
                    Mark In Progress
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => updateTopicStatus(topic.id, 'completed')}
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DSARoadmap;

