import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }

export function getList() {
  return request({
    url: 'https://www.easy-mock.com/mock/5ee4a08ab4699376606a54fd/list',
    method: 'get'
  })
}

export function getUserList() {
  return request({
    url: 'http://127.0.0.1:9000/123',
    method: 'get'
  })
}
