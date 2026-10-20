/**
 * 角色条目的「看不到的那一层」：成衣上为排出改过的地方、各档争宠手法、便意档位名。
 * 这些内容写在 身体状态 / 性格调色盘 条目里，变量里查不到，所以在前端按角色名带一份。
 */
export const ATTIRE_SLOTS = ['上装', '下装', '内衣', '袜子', '鞋子'] as const;
export type AttireSlot = (typeof ATTIRE_SLOTS)[number];

/** 成衣上为「便于排出」改过的地方 */
export const ATTIRE_NOTES: Record<string, Partial<Record<AttireSlot, string>>> = {
  沈栖迟: {
    上装: '奶白针织开衫，袖口收得窄，撩起来不挂东西',
    下装: '白裙摆收到膝上两指，后摆留一条暗缝，坐下时自己往两侧让开',
    内衣: '棉质，臀后是空的',
    袜子: '裤袜，臀后挖出一个洞',
    鞋子: '在家赤足；出门换成三厘米粗跟，踮脚更省力',
  },
  陆清晏: {
    上装: '红西装的腰按她的尺寸收过，抬手不勒',
    下装: '短裙后片开一道活褶，走一步自动分开半寸',
    内衣: '蕾丝，后片本来就薄',
    袜子: '黑长袜臀后开洞，坐下时洞正好对着椅面',
    鞋子: '乐福鞋换成五厘米细跟，站久了腿绷得更直',
  },
  傅翎: {
    上装: '连体衣背面正对菊穴开了一个圆孔，薄纱裙在外层遮着',
    下装: '薄纱裙开叉到腰，转身时掀起来',
    内衣: '无',
    袜子: '连裤袜臀后开洞',
    鞋子: '芭蕾软鞋换成硬底小跟，站起来腿线更长',
  },
  温晓棠: {
    上装: '女仆长裙后片从腰窝到裙摆一排暗扣',
    下装: '同一片后片，一拉就开；围裙系带放松半寸',
    内衣: '棉质，后腰松紧放了一指',
    袜子: '过膝袜臀后开洞',
    鞋子: '低跟，站一天也不酸',
  },
  姜叙: {
    上装: '摄影马甲下摆加长两寸，专门盖住臀部后半',
    下装: '工装短裤后腰开口，开口正对菊穴',
    内衣: '运动内衣，后带可解',
    袜子: '短袜开裆',
    鞋子: '厚底跟，蹲得住也踮得住',
  },
};

/** 改造度分档：与性格调色盘「私下里她怎么对人」同一套阈值 */
export function devoTier(reform: number): '低' | '中' | '高' {
  if (reform >= 500) return '高';
  if (reform >= 200) return '中';
  return '低';
}

/** 对同伴的嫌恶：改造度抽走百合之后剩下来的那点旧情；{user} 渲染时替换 */
export const AVERSION_NOTES: Record<'低' | '中' | '高', string> = {
  低: '维持体面，同桌递茶；递完在心里给人减一分',
  中: '明着躲同伴，饭桌上只跟{user}说话',
  高: '当空气，拿对方的短处换自己的机会',
};

/** 争宠：同一档里各人手法不同；{user} 在渲染时换成玩家名字 */
export const COURTING_NOTES: Record<string, Record<'低' | '中' | '高', string>> = {
  沈栖迟: {
    低: '端着，等他先开口',
    中: '把当天要用的东西提前摆在床边',
    高: '给哥哥排次序，别人插不进这个次序',
  },
  陆清晏: {
    低: '用会长的身份安排见面：这个周末有活动、那间屋更安静',
    中: '抢着替{user}做事，从端茶到整理衣领',
    高: '门口排队，记着谁先进谁后进；拿别人的短处换机会',
  },
  傅翎: {
    低: '把该做的做到，被多看一眼就记很久',
    中: '进门先站定，把要求一句说完',
    高: '提前摆好姿势与器具，人一进来就能直接用',
  },
  温晓棠: {
    低: '多做一份、多留一盏灯',
    中: '抢着接手起居，衬衫到袜子都要经她的手',
    高: '用合身与口味当筹码，谁想吃先看她给不给',
  },
  姜叙: {
    低: '{user}一出现就把镜头转过去',
    中: '抢着做记录，只有她拍得下那些场面',
    高: '替{user}拍，也把自己拍好递上去',
  },
};

/**
 * 玩家名字：条目里统一写 <user>，界面要显真名。
 * 先问酒馆上下文（name1 就是玩家角色名），拿不到再用宏替换兜底。
 */
export function getUserName(): string {
  try {
    const global = window as unknown as {
      SillyTavern?: { getContext?: () => { name1?: string; name?: string } };
      getContext?: () => { name1?: string; name?: string };
    };
    const ctx = global.SillyTavern?.getContext?.() ?? global.getContext?.();
    const name = ctx?.name1 ?? ctx?.name;
    if (typeof name === 'string' && name.trim()) return name.trim();
  } catch {
    // 上下文不可用时走宏替换
  }
  try {
    const macro = substitudeMacros('{{user}}');
    if (macro && macro !== '{{user}}') return macro;
  } catch {
    // 宏也不可用时用中性称呼
  }
  return '他';
}

/** 便意档位名：0-5 与 积蓄与失守 的便意等级一致 */
export const DESIRE_LABELS = ['无感', '微沉', '坠胀', '需夹紧', '随时会崩', '崩决边缘'] as const;

export const DESIRE_NOTES = [
  '只剩一点沉，不细看觉察不出来',
  '小腹沉，会在没人注意时换个重心',
  '走路收着臀，坐下先按一下椅面',
  '夹紧、话变短，找由头独处',
  '额上见汗，公开场合靠名目找场子',
  '已经夹不住，随时会当着人崩决',
] as const;

/** 扩张度：四档，取身体状态条目的分界 */
export function dilateTier(dilate: number): 0 | 1 | 2 | 3 {
  if (dilate >= 400) return 3;
  if (dilate >= 250) return 2;
  if (dilate >= 100) return 1;
  return 0;
}

/** 扩张度对应「排出对她是什么」——一句话，随档位变 */
export const DILATE_TAGS = [
  '还只是件要躲起来做的事',
  '开始值得期待',
  '写进一天的计划里',
  '日常必需的一桩享受',
] as const;

/** 便意对衣着的影响：哪一件现在最碍事 */
export const DESIRE_CLOTHING_HINTS: Record<string, string> = {
  沈栖迟: '裙后那道暗缝现在最要紧，一坐下就自己分开',
  陆清晏: '短裙后片的活褶被顶开，她得用外套下摆挡',
  傅翎: '连体衣背面的圆孔正对着出口，薄纱裙压不住鼓包',
  温晓棠: '后片暗扣全开着一半，围裙系带松了半寸',
  姜叙: '短裤后腰的开口开着，马甲下摆加长的那两寸顶上了',
};
