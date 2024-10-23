import axios from 'axios'
import { env } from '@/constants/config'

export const baseApi = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true
})

// if (env.VITE_TEST_SLOW_API) {
//   baseApi.interceptors.request.use(req => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(req)
//       }, 1000)
//     })
//   })
// }