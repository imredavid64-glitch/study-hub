import { describe, it, expect, beforeEach } from 'vitest';
import { state } from '../../src/core/state.js';

describe('StateManager', () => {
  beforeEach(() => {
    state.reset();
  });

  it('initializes with default goals and tasks', () => {
    const s = state.getState();
    expect(s.goals.length).toBeGreaterThan(0);
    expect(s.tasks.length).toBeGreaterThan(0);
    expect(s.sessions.length).toBeGreaterThan(0);
  });

  it('adds and deletes goals', () => {
    const goal = state.addGoal({
      title: 'Master Organic Chemistry',
      subject: 'Chemistry',
      deadline: Date.now() + 100000,
      targetHours: 15,
      priority: 'high',
      status: 'active',
      progress: 0,
      milestones: [],
    });

    expect(state.getState().goals.some(g => g.id === goal.id)).toBe(true);

    state.deleteGoal(goal.id);
    expect(state.getState().goals.some(g => g.id === goal.id)).toBe(false);
  });

  it('adds and updates tasks, awarding XP on completion', () => {
    state.setUser({
      id: 'test-user',
      name: 'Tester',
      major: 'CS',
      weeklyTargetHours: 20,
      targetGpa: 4.0,
      subjects: ['Math'],
      interests: '',
      learningStyle: 'mixed',
      difficulties: '',
      goals: '',
      xp: 100,
      currentStreak: 2,
      longestStreak: 5,
      totalStudyMinutes: 60,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const task = state.addTask({
      title: 'Read chapter 5',
      subject: 'Math',
      estimatedMinutes: 20,
      status: 'todo',
      priority: 'medium',
      tags: ['math'],
    });

    expect(state.getState().tasks.some(t => t.id === task.id)).toBe(true);

    state.updateTask(task.id, { status: 'done' });
    expect(state.getState().user?.xp).toBe(115); // +15 XP
  });

  it('records study session and awards XP', () => {
    state.setUser({
      id: 'test-user',
      name: 'Tester',
      major: 'CS',
      weeklyTargetHours: 20,
      targetGpa: 4.0,
      subjects: ['Math'],
      interests: '',
      learningStyle: 'mixed',
      difficulties: '',
      goals: '',
      xp: 0,
      currentStreak: 1,
      longestStreak: 1,
      totalStudyMinutes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    state.addStudySession({
      subject: 'Physics',
      mode: 'cards',
      plannedMinutes: 20,
      actualMinutes: 20,
      quality: 9,
      startedAt: Date.now() - 20 * 60000,
    });

    expect(state.getState().user?.totalStudyMinutes).toBe(20);
    expect(state.getState().user?.xp).toBe(30); // 20 * 1.5 = 30 XP
  });

  it('adds notes', () => {
    const note = state.addNote({
      title: 'Newton Laws',
      subject: 'Physics',
      style: 'freeform',
      content: { freeform: 'F = ma' },
      tags: ['physics'],
      images: [],
      isFavorite: false,
    });

    expect(state.getState().notes.some(n => n.id === note.id)).toBe(true);
  });
});
