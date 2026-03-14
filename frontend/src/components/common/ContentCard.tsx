import React from 'react';
import { stripHtmlAndTruncate } from '../../utils/textUtils';

interface ContentCardProps {
    title: string;
    rawHtmlContent: string;
    date: string;
    badgeText?: string;
    onClick: () => void;
}

/**
 * マニュアルや研修会の一覧で使用する共通カードコンポーネント
 */
const ContentCard: React.FC<ContentCardProps> = ({
    title,
    rawHtmlContent,
    date,
    badgeText,
    onClick
}) => {
    const summary = stripHtmlAndTruncate(rawHtmlContent);

    return (
        <div
            onClick={onClick}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
        >
            <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-gray-400">
                    {date}
                </span>
                {badgeText && (
                    <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {badgeText}
                    </span>
                )}
            </div>
            
            <h3 className="text-lg font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {title}
            </h3>
            
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                {summary}
            </p>
            
            <div className="mt-auto pt-4 flex justify-end">
                <span className="text-xs font-bold text-blue-500 group-hover:translate-x-1 transition-transform">
                    詳細を見る →
                </span>
            </div>
        </div>
    );
};

export default ContentCard;
