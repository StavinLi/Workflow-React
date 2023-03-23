/*
 * @Date: 2023-03-15 15:34:08
 * @LastEditors: StavinLi 495727881@qq.com
 * @LastEditTime: 2023-03-15 19:59:21
 * @FilePath: /workflow-react/src/store/index.js
 */
// store.js
import { init } from '@rematch/core'
import * as models from './models'
const store = init({models})

export default store
