import { Button } from '@shalecss/react';
import type { CommandBarAction } from '../../contexts/CommandBarContext';

export const ActionButton: React.FC<CommandBarAction> = (action) => (
  <Button variant="secondary" {...action}>
    {action.name}
  </Button>
);
