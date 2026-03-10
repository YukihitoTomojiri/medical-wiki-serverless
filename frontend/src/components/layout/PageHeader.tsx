import { LucideIcon } from 'lucide-react';
import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: React.ReactNode;
    icon?: LucideIcon;
    children?: React.ReactNode;
    variant?: 'hero' | 'compact';
}

const PageHeader = ({ title, subtitle, icon: Icon, children, variant = 'hero' }: PageHeaderProps) => {
    if (variant === 'compact') {
        return (
            <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center gap-2 md:gap-3">
                    {Icon && <Icon className="w-4 h-4 md:w-5 md:h-5 text-stone-500" />}
                    <div>
                        <h2 className="text-base md:text-lg font-bold text-stone-800 tracking-tight leading-none md:leading-normal">{title}</h2>
                        {subtitle && (
                            <p className="hidden md:block text-xs text-stone-500 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>
                {children && <div className="flex-shrink-0">{children}</div>}
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden mb-4 md:mb-8">
            {/* M3スタイルの帯（Hero Section） */}
            <div className="bg-orange-100 dark:bg-m3-orange-secondary-container rounded-[20px] md:rounded-[28px] p-4 md:p-8 flex flex-row items-center justify-between border border-orange-200 shadow-sm relative z-10 gap-3 md:gap-0">
                <div className="flex flex-col gap-1 md:gap-2 z-10 flex-1 min-w-0">
                    <div className="flex items-center gap-2 md:gap-3">
                        {Icon && <Icon className="hidden md:block w-8 h-8 text-orange-700 flex-shrink-0" />}
                        {Icon && <Icon className="md:hidden w-5 h-5 text-orange-700 flex-shrink-0" />}
                        <h1 className="text-xl md:text-3xl font-bold text-orange-900 tracking-tight truncate">
                            {title}
                        </h1>
                    </div>
                    {subtitle && (
                        <div className="hidden md:block text-orange-800/80 font-medium ml-1">
                            {subtitle}
                        </div>
                    )}
                </div>

                {children && (
                    <div className="z-10 flex-shrink-0 ml-auto">
                        {children}
                    </div>
                )}

                {/* 装飾用のポップな円形要素 */}
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute right-12 bottom-0 w-16 h-16 bg-orange-300/30 rounded-full blur-xl pointer-events-none" />
            </div>
        </div>
    );
};

export default PageHeader;
