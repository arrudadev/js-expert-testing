import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { constants } from '../constants'

const END_OF_LINE_REGEXP = /\r?\n/

export class File {
  private filePath: string
  private headerFields = ['id', 'name', 'profession', 'age']
  private maxContentLines = 3

  constructor(filePath: string) {
    this.filePath = path.resolve(__dirname, filePath)
  }

  async csvToJson() {
    const fileContent = await readFile(this.filePath, 'utf8')
    const csvValidation = this.isValidCSV(fileContent)

    if (!csvValidation.valid) {
      throw new Error(csvValidation.errorMessage)
    }

    return this.parseCSVTOJson(fileContent)
  }

  private isValidCSV(fileContent: string) {
    if (this.isFileEmpty(fileContent)) {
      return {
        valid: false,
        errorMessage: constants.errors.FILE_EMPTY_ERROR_MESSAGE,
      }
    }

    if (!this.isHeaderValid(fileContent)) {
      return {
        valid: false,
        errorMessage: constants.errors.FILE_FIELDS_ERROR_MESSAGE,
      }
    }

    if (!this.isValidContentLength(fileContent)) {
      return {
        valid: false,
        errorMessage: constants.errors.FILE_LENGTH_ERROR_MESSAGE,
      }
    }

    return {
      valid: true,
      errorMessage: null,
    }
  }

  private parseCSVTOJson(fileContent: string) {
    const fileContentWithoutHeader = this.fileContentWithoutHeader(fileContent)
    const contentLines = fileContentWithoutHeader.split(END_OF_LINE_REGEXP)

    const json = contentLines.map((line) => {
      const lineFields = line.split(',')
      return this.headerFields.reduce((acc, field, index) => {
        acc[field] = lineFields[index].trim()
        return acc
      }, {})
    })

    return json
  }

  private isFileEmpty(fileContent: string) {
    const fileContentWithoutHeader = this.fileContentWithoutHeader(fileContent)
    return fileContentWithoutHeader.length === 0
  }

  private isHeaderValid(fileContent: string) {
    const header = this.fileContentHeader(fileContent)
    return header === this.headerFields.join(',')
  }

  private isValidContentLength(fileContent: string) {
    const fileContentWithoutHeader = this.fileContentWithoutHeader(fileContent)
    const contentLines = fileContentWithoutHeader.split(END_OF_LINE_REGEXP)
    return contentLines.length <= this.maxContentLines
  }

  private fileContentHeader(fileContent: string) {
    return fileContent.split(END_OF_LINE_REGEXP)[0]
  }

  private fileContentWithoutHeader(fileContent: string) {
    return fileContent.split(END_OF_LINE_REGEXP).slice(1).join('\n')
  }
}
