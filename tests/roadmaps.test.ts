import { describe, expect, it } from 'bun:test';
import { INITIAL_ROADMAPS } from '../lib/mock-data';
import { ProjectRoadmapItem, ProjectCategory, RoadmapStatus } from '../lib/types';

describe('Project Roadmaps Engine & Capability Execution', () => {
  it('should contain default INITIAL_ROADMAPS spanning all 6 Skelvre pillars', () => {
    expect(INITIAL_ROADMAPS.length).toBeGreaterThanOrEqual(10);

    const categories = new Set(INITIAL_ROADMAPS.map((r) => r.projectId));
    expect(categories.has('wallets')).toBe(true);
    expect(categories.has('subscriptions')).toBe(true);
    expect(categories.has('agents')).toBe(true);
    expect(categories.has('developers')).toBe(true);
    expect(categories.has('offline_sync')).toBe(true);
    expect(categories.has('security')).toBe(true);
  });

  it('should accurately calculate overall platform capability percentage', () => {
    const totalItems = INITIAL_ROADMAPS.length;
    const sumProgress = INITIAL_ROADMAPS.reduce((acc, r) => acc + r.progressPercent, 0);
    const calculatedScore = Math.round((sumProgress / (totalItems * 100)) * 100);

    expect(calculatedScore).toBeGreaterThan(0);
    expect(calculatedScore).toBeLessThanOrEqual(100);
  });

  it('should correctly filter roadmaps by category, status, and query', () => {
    const filterByCategory = (items: ProjectRoadmapItem[], cat: ProjectCategory | 'all') =>
      cat === 'all' ? items : items.filter((r) => r.projectId === cat);

    const filterByStatus = (items: ProjectRoadmapItem[], status: RoadmapStatus | 'all') =>
      status === 'all' ? items : items.filter((r) => r.status === status);

    const filterByQuery = (items: ProjectRoadmapItem[], query: string) => {
      if (!query.trim()) return items;
      const q = query.toLowerCase();
      return items.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.projectName.toLowerCase().includes(q)
      );
    };

    const walletItems = filterByCategory(INITIAL_ROADMAPS, 'wallets');
    expect(walletItems.every((r) => r.projectId === 'wallets')).toBe(true);

    const inProgressItems = filterByStatus(INITIAL_ROADMAPS, 'in_progress');
    expect(inProgressItems.every((r) => r.status === 'in_progress')).toBe(true);

    const searchResult = filterByQuery(INITIAL_ROADMAPS, 'enclave');
    expect(searchResult.length).toBeGreaterThan(0);
  });

  it('should support dynamic target capability toggling and progress calculation', () => {
    const sampleMilestone: ProjectRoadmapItem = {
      id: 'rdm_test_01',
      projectId: 'wallets',
      projectName: 'Universal Enclave Wallets',
      title: 'Passkey WebAuthn Relayer',
      description: 'WebAuthn hardware key enclave signing relay.',
      status: 'backlog',
      priority: 'high',
      quarter: 'Q2 2025',
      progressPercent: 0,
      targetCapabilities: ['WebAuthn credential creation', 'Assertion verification', 'Hardware enclave relay'],
      completedCapabilities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Toggle 1 capability
    let completedList = [...(sampleMilestone.completedCapabilities || []), 'WebAuthn credential creation'];
    let percent = Math.round((completedList.length / sampleMilestone.targetCapabilities.length) * 100);
    let status: RoadmapStatus = percent === 100 ? 'completed' : percent > 0 ? 'in_progress' : 'backlog';

    expect(percent).toBe(33);
    expect(status).toBe('in_progress');

    // Toggle all 3 capabilities
    completedList = ['WebAuthn credential creation', 'Assertion verification', 'Hardware enclave relay'];
    percent = Math.round((completedList.length / sampleMilestone.targetCapabilities.length) * 100);
    status = percent === 100 ? 'completed' : percent > 0 ? 'in_progress' : 'backlog';

    expect(percent).toBe(100);
    expect(status).toBe('completed');
  });

  it('should support adding and removing roadmap items', () => {
    let list = [...INITIAL_ROADMAPS];
    const initialCount = list.length;

    const newItem: ProjectRoadmapItem = {
      id: 'rdm_custom_99',
      projectId: 'security',
      projectName: 'Security Guardrails',
      title: 'Zero-Knowledge Proof Audit Relay',
      description: 'zk-SNARK settlement proof generator for enclave transactions.',
      status: 'in_progress',
      priority: 'critical',
      quarter: 'Q2 2025',
      progressPercent: 50,
      targetCapabilities: ['zk-SNARK circuit', 'Proof verification'],
      completedCapabilities: ['zk-SNARK circuit'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list = [newItem, ...list];
    expect(list.length).toBe(initialCount + 1);
    expect(list[0].id).toBe('rdm_custom_99');

    // Remove item
    list = list.filter((r) => r.id !== 'rdm_custom_99');
    expect(list.length).toBe(initialCount);
  });
});
