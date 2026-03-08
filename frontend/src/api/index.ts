// API クライアント — 機能カテゴリ別に分割されたモジュールを統合
// 既存の `import { api } from '../api'` を壊さないよう、全関数を `api` オブジェクトに集約して再エクスポート

import { authApi } from './auth';
import { usersApi } from './users';
import { orgApi } from './org';
import { manualsApi } from './manuals';
import { trainingApi } from './training';
import { adminApi } from './admin';
import { announcementsApi } from './announcements';
import { leavesApi } from './leaves';

// 型の再エクスポート
export type { AdminLeaveMonitoring } from './admin';
export type { Announcement } from './announcements';
export type { TrainingEvent, TrainingResponse, Committee } from './training';

// 統合 API オブジェクト（後方互換のため）
export const api = {
    ...authApi,
    ...usersApi,
    ...orgApi,
    ...manualsApi,
    ...trainingApi,
    ...adminApi,
    ...announcementsApi,
    ...leavesApi,
};
