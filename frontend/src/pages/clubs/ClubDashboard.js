import React, { useState, useEffect } from 'react';
import { productAdsAPI, eventAdsAPI, otherAdsAPI } from './services/api';
import EventAds from './EventAds';
import ProductAds from './ProductAds';
import OtherAds from './OtherAds';
import styles from './ClubDashboard.module.css';

const ClubDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalProducts: 0,
    totalOthers: 0,
    activeEvents: 0,
    activeProducts: 0,
    activeOthers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [eventsRes, productsRes, othersRes] = await Promise.all([
        eventAdsAPI.getAll().catch(() => ({ data: [] })),
        productAdsAPI.getAll().catch(() => ({ data: [] })),
        otherAdsAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const events = eventsRes.data || [];
      const products = productsRes.data || [];
      const others = othersRes.data || [];

      setAnalytics({
        totalEvents: events.length,
        totalProducts: products.length,
        totalOthers: others.length,
        activeEvents: events.filter(ad => ad.evntAdStatus === 'active').length,
        activeProducts: products.filter(ad => ad.prodAdStatus === 'active').length,
        activeOthers: others.filter(ad => ad.otherAdStatus === 'active').length
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊' },
    { key: 'events', label: 'Event Ads', icon: '🎉' },
    { key: 'products', label: 'Product Ads', icon: '🛍️' },
    { key: 'others', label: 'Other Ads', icon: '📢' }
  ];

  const renderAnalyticsDashboard = () => (
    <div>
      <div className={styles.analyticsSection}>
        <h3 className={styles.subHeading}>Club Ads Analytics</h3>
        <div className={styles.analyticsGrid}>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsNumber}>{analytics.totalEvents}</div>
            <div className={styles.analyticsLabel}>Total Event Ads</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsNumber}>{analytics.activeEvents}</div>
            <div className={styles.analyticsLabel}>Active Event Ads</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsNumber}>{analytics.totalProducts}</div>
            <div className={styles.analyticsLabel}>Total Product Ads</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsNumber}>{analytics.activeProducts}</div>
            <div className={styles.analyticsLabel}>Active Product Ads</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsNumber}>{analytics.totalOthers}</div>
            <div className={styles.analyticsLabel}>Total Other Ads</div>
          </div>
          <div className={styles.analyticsCard}>
            <div className={styles.analyticsNumber}>{analytics.activeOthers}</div>
            <div className={styles.analyticsLabel}>Active Other Ads</div>
          </div>
        </div>
      </div>

      <div className={styles.analyticsSection}>
        <h3 className={styles.subHeading}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('events')}
            className={styles.addButton}
          >
            🎉 Manage Event Ads
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={styles.addButton}
          >
            🛍️ Manage Product Ads
          </button>
          <button
            onClick={() => setActiveTab('others')}
            className={styles.addButton}
          >
            📢 Manage Other Ads
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading && activeTab === 'dashboard') {
      return <div className={styles.loading}>Loading analytics...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return renderAnalyticsDashboard();
      case 'events':
        return <EventAds />;
      case 'products':
        return <ProductAds />;
      case 'others':
        return <OtherAds />;
      default:
        return renderAnalyticsDashboard();
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.heading}>Club Advertisement Management</h2>
      
      <div className={styles.navigationTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              if (tab.key === 'dashboard') {
                fetchAnalytics();
              }
            }}
            className={`${styles.tabButton} ${
              activeTab === tab.key ? styles.active : ''
            }`}
          >
            <span style={{ marginRight: '8px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default ClubDashboard;
