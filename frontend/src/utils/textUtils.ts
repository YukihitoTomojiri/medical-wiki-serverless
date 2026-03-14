/**
 * HTMLタグを除去し、指定した文字数で切り詰めるユーティリティ
 * @param html HTML形式の文字列
 * @param maxLength 最大文字数（デフォルト: 60）
 * @returns プレーンテキストの抜粋
 */
export const stripHtmlAndTruncate = (html: string, maxLength: number = 60): string => {
    if (!html) return '';

    // HTMLタグを除去し、実体参照（&nbsp;等）を簡易的にデコード
    const plainText = html
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

    // 指定文字数で切り詰め
    if (plainText.length <= maxLength) {
        return plainText;
    }

    return plainText.substring(0, maxLength) + '...';
};
