import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// 每层楼一个 store，绑到本层楼自己的 message_id。
// defineMvuDataStore 自带 2s 轮询：会重读 stat_data 并比对，
// 变了才替换 —— 这就是面板保持实时的机制，不需要额外的 postMessage 桥。
export const useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});
