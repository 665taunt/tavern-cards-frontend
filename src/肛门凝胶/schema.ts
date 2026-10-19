export const Schema = z.object({
  系统: z
    .object({
      当前日期: z.string().prefault('2026/08/31'),
      当前时间段: z.enum(['清晨', '上午', '午间', '下午', '傍晚', '夜晚']).prefault('清晨'),
      当前场景: z.string().prefault('沈家'),
      当前场合: z.enum(['公开', '私密']).prefault('私密'),
      当前在场女角色: z.string().prefault('沈栖迟'),
      当前清算对象: z.string().prefault('无'),
      复仇进度: z.enum(['未开场', '名单已定', '清算中', '清算完成']).prefault('名单已定'),
    })
    .prefault({}),
  沈栖迟: z
    .object({
      阶段: z.enum(['沾染', '初步倒转', '深层重塑', '完全母猪化']).prefault('初步倒转'),
      灵魂改造度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 1000))
        .prefault(60),
      菊穴扩张度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 500))
        .prefault(220),
      菊穴直径: z.coerce
        .number()
        .transform(value => _.clamp(value, 2, 5))
        .prefault(3.2),
      敏感度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(2),
      肠道容量: z.coerce
        .number()
        .transform(value => _.clamp(value, 500, 1000))
        .prefault(700),
      肠道内凝胶: z.record(z.string(), z.coerce.number()).prefault({}),
      占据百分比: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 125))
        .prefault(0),
      便意等级: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      菊穴插入物: z.enum(['无', '手指', '肛塞', '肛门拉珠', '假阳具', '其他']).prefault('无'),
      排出凝胶总量: z.coerce
        .number()
        .transform(value => Math.max(0, value))
        .prefault(60),
      本次高潮情境: z.string().prefault('无'),
      排出姿势: z.string().prefault('站在床边，踮脚，上身后压，撅臀'),
      淫纹: z.string().prefault('小腹正中，掌心大，蜜桃橙色微光'),
      上装: z.string().prefault('白色连衣裙'),
      下装: z.string().prefault('白色连衣裙裙摆'),
      内衣: z.string().prefault('白色棉质内裤'),
      袜子: z.string().prefault('白色短袜'),
      鞋子: z.string().prefault('浅口平底鞋'),
      内心想法: z.string().prefault('想让他一直看着'),
    })
    .prefault({}),
  陆清晏: z
    .object({
      阶段: z.enum(['沾染', '初步倒转', '深层重塑', '完全母猪化']).prefault('沾染'),
      灵魂改造度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 1000))
        .prefault(0),
      菊穴扩张度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 500))
        .prefault(0),
      菊穴直径: z.coerce
        .number()
        .transform(value => _.clamp(value, 2, 5))
        .prefault(2),
      敏感度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      肠道容量: z.coerce
        .number()
        .transform(value => _.clamp(value, 500, 1000))
        .prefault(500),
      肠道内凝胶: z.record(z.string(), z.coerce.number()).prefault({}),
      占据百分比: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 125))
        .prefault(0),
      便意等级: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      菊穴插入物: z.enum(['无', '手指', '肛塞', '肛门拉珠', '假阳具', '其他']).prefault('无'),
      排出凝胶总量: z.coerce
        .number()
        .transform(value => Math.max(0, value))
        .prefault(0),
      本次高潮情境: z.string().prefault('无'),
      排出姿势: z.string().prefault('无'),
      淫纹: z.string().prefault('尚未浮现'),
      上装: z.string().prefault('红色西装上衣（官方学生制服）'),
      下装: z.string().prefault('红色短裙（官方学生制服）'),
      内衣: z.string().prefault('黑色蕾丝内衣'),
      袜子: z.string().prefault('黑色长袜'),
      鞋子: z.string().prefault('黑色乐福鞋'),
      内心想法: z.string().prefault('今天也要把场面撑住'),
    })
    .prefault({}),
  傅翎: z
    .object({
      阶段: z.enum(['沾染', '初步倒转', '深层重塑', '完全母猪化']).prefault('沾染'),
      灵魂改造度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 1000))
        .prefault(0),
      菊穴扩张度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 500))
        .prefault(0),
      菊穴直径: z.coerce
        .number()
        .transform(value => _.clamp(value, 2, 5))
        .prefault(2),
      敏感度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      肠道容量: z.coerce
        .number()
        .transform(value => _.clamp(value, 500, 1000))
        .prefault(500),
      肠道内凝胶: z.record(z.string(), z.coerce.number()).prefault({}),
      占据百分比: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 125))
        .prefault(0),
      便意等级: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      菊穴插入物: z.enum(['无', '手指', '肛塞', '肛门拉珠', '假阳具', '其他']).prefault('肛塞'),
      排出凝胶总量: z.coerce
        .number()
        .transform(value => Math.max(0, value))
        .prefault(0),
      本次高潮情境: z.string().prefault('无'),
      排出姿势: z.string().prefault('无'),
      淫纹: z.string().prefault('尚未浮现'),
      上装: z.string().prefault('黑色吊带练功服与薄纱裙'),
      下装: z.string().prefault('薄纱裙'),
      内衣: z.string().prefault('无'),
      袜子: z.string().prefault('白色连裤袜'),
      鞋子: z.string().prefault('芭蕾软鞋'),
      内心想法: z.string().prefault('再撑一组动作'),
    })
    .prefault({}),
  温晓棠: z
    .object({
      阶段: z.enum(['沾染', '初步倒转', '深层重塑', '完全母猪化']).prefault('沾染'),
      灵魂改造度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 1000))
        .prefault(0),
      菊穴扩张度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 500))
        .prefault(0),
      菊穴直径: z.coerce
        .number()
        .transform(value => _.clamp(value, 2, 5))
        .prefault(2),
      敏感度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      肠道容量: z.coerce
        .number()
        .transform(value => _.clamp(value, 500, 1000))
        .prefault(500),
      肠道内凝胶: z.record(z.string(), z.coerce.number()).prefault({}),
      占据百分比: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 125))
        .prefault(0),
      便意等级: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      菊穴插入物: z.enum(['无', '手指', '肛塞', '肛门拉珠', '假阳具', '其他']).prefault('无'),
      排出凝胶总量: z.coerce
        .number()
        .transform(value => Math.max(0, value))
        .prefault(0),
      本次高潮情境: z.string().prefault('无'),
      排出姿势: z.string().prefault('无'),
      淫纹: z.string().prefault('尚未浮现'),
      上装: z.string().prefault('黑白欧式女仆长裙'),
      下装: z.string().prefault('黑白女仆长裙与围裙'),
      内衣: z.string().prefault('白色棉质内衣'),
      袜子: z.string().prefault('白色过膝袜'),
      鞋子: z.string().prefault('黑色系带平底鞋'),
      内心想法: z.string().prefault('今天的三餐还差一道甜'),
    })
    .prefault({}),
  姜叙: z
    .object({
      阶段: z.enum(['沾染', '初步倒转', '深层重塑', '完全母猪化']).prefault('沾染'),
      灵魂改造度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 1000))
        .prefault(0),
      菊穴扩张度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 500))
        .prefault(0),
      菊穴直径: z.coerce
        .number()
        .transform(value => _.clamp(value, 2, 5))
        .prefault(2),
      敏感度: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      肠道容量: z.coerce
        .number()
        .transform(value => _.clamp(value, 500, 1000))
        .prefault(500),
      肠道内凝胶: z.record(z.string(), z.coerce.number()).prefault({}),
      占据百分比: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 125))
        .prefault(0),
      便意等级: z.coerce
        .number()
        .transform(value => _.clamp(value, 0, 5))
        .prefault(0),
      菊穴插入物: z.enum(['无', '手指', '肛塞', '肛门拉珠', '假阳具', '其他']).prefault('无'),
      排出凝胶总量: z.coerce
        .number()
        .transform(value => Math.max(0, value))
        .prefault(0),
      本次高潮情境: z.string().prefault('无'),
      排出姿势: z.string().prefault('无'),
      淫纹: z.string().prefault('尚未浮现'),
      上装: z.string().prefault('摄影马甲与针织衫'),
      下装: z.string().prefault('牛仔裤'),
      内衣: z.string().prefault('灰色运动内衣'),
      袜子: z.string().prefault('黑色短袜'),
      鞋子: z.string().prefault('帆布鞋'),
      内心想法: z.string().prefault('这个角度能用'),
    })
    .prefault({}),
});

export type SchemaType = z.infer<typeof Schema>;
