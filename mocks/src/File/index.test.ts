import assert from 'node:assert'
import { constants } from '../constants'
import { File } from '.'

async function FileTests() {
  // variables in blocks are scoped to the block
  {
    const filePath = './mocks/emptyFile-invalid.csv'
    const file = new File(filePath)
    const expected = new Error(constants.errors.FILE_EMPTY_ERROR_MESSAGE)
    const result = file.csvToJson()
    await assert.rejects(result, expected)
  }

  {
    const filePath = './mocks/invalid-header.csv'
    const file = new File(filePath)
    const expected = new Error(constants.errors.FILE_FIELDS_ERROR_MESSAGE)
    const result = file.csvToJson()
    await assert.rejects(result, expected)
  }

  {
    const filePath = './mocks/fiveItems-invalid.csv'
    const file = new File(filePath)
    const expected = new Error(constants.errors.FILE_LENGTH_ERROR_MESSAGE)
    const result = file.csvToJson()
    await assert.rejects(result, expected)
  }

  {
    const filePath = './mocks/threeItems-valid.csv'
    const file = new File(filePath)
    const expected = [
      {
        id: 1,
        name: 'xuxa da silva',
        profession: 'developer',
        age: 120,
      },
      {
        id: 2,
        name: 'jose da silva',
        profession: 'manager',
        age: 30,
      },
      {
        id: 3,
        name: 'zezin',
        profession: 'QA',
        age: 25,
      },
    ]
    const result = await file.csvToJson()
    assert.deepEqual(result, expected)
  }
}

FileTests().then(() => {
  console.log('File tests passed')
})
