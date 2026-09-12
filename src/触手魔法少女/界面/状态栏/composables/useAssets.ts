/**
 * 图片资源外链。
 *
 * 图片不再随 bundle 内联：9 张图 base64 共 80 KB，占产物 73%，而 bundle 文档是
 * **每层楼一个 iframe 各拿一份**的 —— 内联意味着每层楼都要解析这 80 KB。
 * 改成外链后产物只剩代码与样式，且配合条件渲染，单人场景只下载实际显示的那一张头像。
 *
 * 图片放在仓库根的 `assets/tentacle-magic-girl/`（ASCII 路径），与 bundle 同一个仓库，
 * 由 jsdelivr 直接服务，不需要额外的图床。该目录不在 CI 清理的 `dist/` 内，不会被构建覆盖。
 *
 * ⚠️ 建仓后必须把下面的 GITHUB_USER / GITHUB_REPO 换成真实值，
 *    否则图片全部 404。Stage 10 的打包校验会断言这里不再是占位符。
 */
const GITHUB_USER = '665taunt';
const GITHUB_REPO = 'tavern-cards-frontend';

const BASE = `https://testingcf.jsdelivr.net/gh/${GITHUB_USER}/${GITHUB_REPO}/assets/tentacle-magic-girl`;

/** 头像：键与 schema 的角色字段名解耦，用角色标识，改名不影响文件 */
export function avatarUrl(accent: string): string {
  return `${BASE}/avatars/${accent}.jpg`;
}

export function tabIconUrl(tab: 'girls' | 'enemies'): string {
  return `${BASE}/tab-${tab}.png`;
}

/** 供 Stage 10 的打包校验断言「占位符已替换」 */
export const ASSET_BASE_URL = BASE;
export const ASSET_URL_IS_PLACEHOLDER = BASE.includes('<');
