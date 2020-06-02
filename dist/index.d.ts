import "miniprogram-api-typings";

export const debounceSetData: <TPageData, TPageOptions>(
    instance: WechatMiniprogram.Page.Instance<TPageData, TPageOptions>,
    options: {
        wait: number;
        showEndTime?: boolean;
    }
) => (
    data: Partial<TPageData> & WechatMiniprogram.IAnyObject,
    callback?: () => void
) => void;
export default debounceSetData;
