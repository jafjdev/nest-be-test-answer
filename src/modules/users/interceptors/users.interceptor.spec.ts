import { UsersInterceptor } from './users.interceptor';
import { expect } from '@jest/globals';
describe('UsersInterceptor', () => {
  it('should be defined', () => {
    expect(new UsersInterceptor()).toBeDefined();
  });
});
