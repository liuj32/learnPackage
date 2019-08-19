// enum.test.js
import enumFn from '../src/enum.js'

test('enum', () => {
  // 我们定义了俩个 action type
  const actionTypes = {
    ADD_TODO: 'add_todo',
    UPDATE_TODO: 'update_todo'
  }

  const safeActionTypes = enumFn(actionTypes)

  // 当读取一个不存在的枚举值时会报错
  // 因为 'DELETE_TODO' 并没有定义，所以此时会报错
  expect(() => {
    safeActionTypes['DELETE_TODO']
  }).toThrowErrorMatchingSnapshot()

  // 当删除一个枚举值时会报错
  expect(() => {
    delete safeActionTypes['ADD_TODO']
  }).toThrowErrorMatchingSnapshot()
})