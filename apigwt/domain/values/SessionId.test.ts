import { randomSessionId } from "./SessionId";

describe('SessionId', () => {
  it('should be 16 alphanumeric characters', () => {
    expect(randomSessionId()).toMatch(/[0-9a-zA-Z]{16}/);
  });
});
