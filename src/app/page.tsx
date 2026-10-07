'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { FeedSection } from '@/components/FeedSection';
import { FavoritesSection } from '@/components/FavoritesSection';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { SettingsModal } from '@/components/SettingsModal';
import { ProfileModal } from '@/components/ProfileModal';
import { DetailModal } from '@/components/DetailModal';
import { ContentItem } from '@/types';

export default function DashboardPage() {
  const { activeTab } = useAppSelector((state) => state.content);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<ContentItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Sidebar */}
        <Sidebar
          onOpenSettings={() => setIsSettingsOpen(true)}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-72 py-6 sm:py-8 min-w-0">
          {activeTab === 'feed' && (
            <FeedSection
              onOpenDetail={(item) => setSelectedDetailItem(item)}
              isTrendingView={false}
            />
          )}

          {activeTab === 'trending' && (
            <div className="space-y-6">
              <div className="pb-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>🔥 Trending Across The Web</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Highest engagement news breaking, viral movie releases, and trending community posts
                </p>
              </div>
              <FeedSection
                onOpenDetail={(item) => setSelectedDetailItem(item)}
                isTrendingView={true}
              />
            </div>
          )}

          {activeTab === 'favorites' && (
            <FavoritesSection
              onOpenDetail={(item) => setSelectedDetailItem(item)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsSection />}
        </main>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <DetailModal
        item={selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
      />
    </div>
  );
}
