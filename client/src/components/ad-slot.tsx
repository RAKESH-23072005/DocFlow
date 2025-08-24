import React from 'react';

interface AdSlotProps {
  type: 'banner' | 'sidebar' | 'inline';
  className?: string;
}

export default function AdSlot({ type, className = '' }: AdSlotProps) {
  // Ad slot dimensions and styles based on type
  const getAdSlotStyles = () => {
    switch (type) {
      case 'banner':
        return {
          container: 'w-full min-h-[250px] lg:min-h-[90px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Banner Ad Space',
          mobileLabel: '728x90 • 970x90'
        };
      case 'sidebar':
        return {
          container: 'w-full min-h-[300px] lg:min-h-[600px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Sidebar Ad Space',
          mobileLabel: '300x600 • 300x250'
        };
      case 'inline':
        return {
          container: 'w-full min-h-[250px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Inline Ad Space',
          mobileLabel: '300x250 • 728x90'
        };
      default:
        return {
          container: 'w-full min-h-[250px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center',
          text: 'text-gray-500 text-sm font-medium',
          label: 'Ad Space',
          mobileLabel: '300x250 • 728x90'
        };
    }
  };

  const styles = getAdSlotStyles();

  return (
    <div className={`ad-slot ${styles.container} ${className}`}>
      {/* Replace with AdSense script later */}
      <div className="text-center p-4">
        <div className={`${styles.text} mb-2`}>
          {styles.label}
        </div>
        <div className="text-gray-400 text-xs">
          {/* Show different sizes for mobile vs desktop */}
          <span className="lg:hidden">{styles.mobileLabel}</span>
          <span className="hidden lg:inline">
            {type === 'banner' && '728x90 • 970x90 • 970x250'}
            {type === 'sidebar' && '300x600 • 300x250'}
            {type === 'inline' && '300x250 • 728x90'}
          </span>
        </div>
      </div>
    </div>
  );
}
