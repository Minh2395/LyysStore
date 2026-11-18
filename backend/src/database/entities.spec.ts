import { Product } from './entities';
import { isValidEntityId } from './entity-id';

describe('MysqlEntity IDs', () => {
  it('creates ObjectId-compatible IDs and preserves supplied IDs', () => {
    const generated = new Product();
    generated.assignId();

    expect(isValidEntityId(generated._id)).toBe(true);

    const existing = new Product();
    existing._id = '507f1f77bcf86cd799439011';
    existing.assignId();

    expect(existing._id).toBe('507f1f77bcf86cd799439011');
  });
});
