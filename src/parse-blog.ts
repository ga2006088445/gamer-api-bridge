import { fetchPageContent, buildFullUrl } from "./fetch-lib";
import { getBlogPageUrl, getHomePageUrl } from "./env-manager";

const findPostId = async (MONTH: number, DATE: number): Promise<{ success: boolean, data: string }> => {
    try {
        const url = getBlogPageUrl();
        const doc = await fetchPageContent(url);
        const result = Array.from(doc.querySelectorAll('.TS1'))
            .find(element => new RegExp(`${MONTH.toString().padStart(2, '0')}/${DATE.toString().padStart(2, '0')}`)
                .test(element.textContent ?? ""));

        if (!result) {
            return { success: false, data: "找不到文章" };
        }

        const link = result.getAttribute("href") ?? "";
        return { success: true, data: link };
    } catch (error) {
        throw error;
    }
};

const findAnswerInPost = async (postId: string): Promise<string> => {
    const baseUrl = getHomePageUrl();

    const [path, queryString] = postId.split('?');

    const url = buildFullUrl(baseUrl, path);
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    const doc = await fetchPageContent(fullUrl);
    const result = /A:(\d)/
        .exec(doc.querySelector(".MSG-list8C, #article_content")
            ?.textContent
            ?.replace(/\s/g, "")
            .replace(/：/g, ":") ?? "");

    if (result) {
        return result[1];
    } else {
        throw new Error("No result found in post.");
    }
};

export async function getAnswerToday() {
    // const MONTH = 12; // 月份範例
    // const DATE = 23;  // 日期範例

    const currentDate = new Date();
    const MONTH = currentDate.getMonth() + 1; // JavaScript 的月份是從 0 開始的，所以需要加 1
    const DATE = currentDate.getDate();

    const { success, data } = await findPostId(MONTH, DATE)
    if (success && data) {
        const answer = await findAnswerInPost(data)
        return { success: true, answer }
    } else {
        return { success: false, msg: data }
    }
}