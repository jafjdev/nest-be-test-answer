/**
 * Wrapper for npm csv-parser package
 *
 * https://www.npmjs.com/package/csv-parser
 *
 */
import { BadRequestException, Injectable } from '@nestjs/common';
const csv = require('csv-parser');
const fs = require('fs');

@Injectable()
export class CsvParser {
  private readonly csv: any = csv;

  static async parse(
    filePath: string,
    options?: CsvParserOptions,
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let results = [];
      try {
        fs.createReadStream(filePath)
          .pipe(csv(options))
          .on('data', (data) => {
            results.push(data);
          })
          .on('end', () => {
            resolve(results);
          });
      } catch (e) {
        reject(e);
        throw new BadRequestException('cannot read file');
      }
    });
  }

  async parse(filePath: string, options?: CsvParserOptions): Promise<any[]> {
    return new Promise((resolve, reject) => {
      let results = [];
      try {
        fs.createReadStream(filePath)
          .pipe(this.csv(options))
          .on('data', (data) => {
            results.push(data);
          })
          .on('end', () => {
            resolve(results);
          });
      } catch (e) {
        reject(e);
        throw new BadRequestException('cannot read file');
      }
    });
  }
}

interface CsvParserOptions {
  escape?: string;
  headers?: string[] | boolean;
  mapHeaders?: ({
    header,
    index,
  }: {
    header: string;
    index: number;
  }) => string | null;
  mapValues?: ({
    header,
    index,
    value,
  }: {
    header: string;
    index: number;
    value: string;
  }) => string;
  quote?: string;
  raw?: boolean;
  separator?: string;
  skipComments?: boolean | string;
  skipLines?: number;
  maxRowBytes?: number;
  strict?: boolean;
}
