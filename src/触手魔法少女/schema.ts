// 布尔容错：接受真正的布尔，以及常见字符串写法。
// 真值表必须按字段传入——`是否变身` 与 `是否伪装人类` 的 true 语义相反，
// 共用一张表会把「人类形态」这类语义串判成 false，即静默反转含义。
// 未命中真值表的字符串一律落 false（不抛错）。
const boolSchema = (trueWords: string[]) =>
  z
    .union([
      z.boolean(),
      z.string().transform((v) => _.includes(trueWords, v.trim().toLowerCase())),
    ])
    .prefault(false);

const girlSchema = z
  .object({
    好感度: z.coerce.number().prefault(0).transform((v) => _.clamp(v, 0, 100)),
    改造度: z.coerce.number().prefault(0).transform((v) => _.clamp(v, 0, 100)),
    内心想法: z.string().prefault(''),
    当日消耗魔力: z.coerce.number().prefault(0).transform((v) => _.clamp(v, 0, 100)),
    魔力补给方式: z.string().prefault(''),
    是否变身: boolSchema(['true', '是', '1', 'yes', 'y', 'on', '变身中', '已变身']),
    吞屌口穴: z.string().prefault(''),
    过肺鼻穴: z.string().prefault(''),
    灌脑耳穴: z.string().prefault(''),
    溢奶乳穴: z.string().prefault(''),
    储精淫宫: z.string().prefault(''),
    吸精小穴: z.string().prefault(''),
    漏电尿穴: z.string().prefault(''),
    渴精菊穴: z.string().prefault(''),
    骚淫足穴: z.string().prefault(''),
    上装拟态: z.string().prefault(''),
    下装拟态: z.string().prefault(''),
    鞋袜拟态: z.string().prefault(''),
    作祟触手: z.string().prefault(''),
    异常状态: z.string().prefault(''),
  })
  .prefault({});

const enemySchema = z
  .object({
    内心想法: z.string().prefault(''),
    是否伪装人类: boolSchema(['true', '是', '1', 'yes', 'y', 'on', '人类形态', '伪装中', '伪装人类']),
    吞屌口穴: z.string().prefault(''),
    过肺鼻穴: z.string().prefault(''),
    灌脑耳穴: z.string().prefault(''),
    溢奶乳穴: z.string().prefault(''),
    储精淫宫: z.string().prefault(''),
    吸精小穴: z.string().prefault(''),
    漏电尿穴: z.string().prefault(''),
    渴精菊穴: z.string().prefault(''),
    骚淫足穴: z.string().prefault(''),
    上身穿搭: z.string().prefault(''),
    下身穿搭: z.string().prefault(''),
    鞋袜穿搭: z.string().prefault(''),
    异常状态: z.string().prefault(''),
  })
  .prefault({});

export const Schema = z.object({
  系统: z
    .object({
      当前日期: z.string().prefault(''),
      当前时间段: z.string().prefault(''),
      当前场景: z.string().prefault(''),
      当前场景敌人: z.string().prefault(''), // 逗号分隔的敌人姓名列表（如"奥克塔薇娅,无月诺克斯"），无敌人时写"无"
      当前场景魔法少女: z.string().prefault(''),
    })
    .prefault({}),
  米娅: girlSchema,
  星野绫: girlSchema,
  白鸟薇奥拉: girlSchema,
  夜蝶: girlSchema,
  塞西莉亚: girlSchema,
  奥克塔薇娅: enemySchema,
  无月诺克斯: enemySchema,
  其他魔法少女: z
    .record(
      z.object({
        好感度: z.coerce.number().prefault(0).transform((v) => _.clamp(v, 0, 100)),
        改造度: z.coerce.number().prefault(0).transform((v) => _.clamp(v, 0, 100)),
        当日消耗魔力: z.coerce.number().prefault(0).transform((v) => _.clamp(v, 0, 100)),
        魔力补给方式: z.string().prefault(''),
        异常状态: z.string().prefault(''),
      })
    )
    .prefault({}),
});
export type Schema = z.output<typeof Schema>;
