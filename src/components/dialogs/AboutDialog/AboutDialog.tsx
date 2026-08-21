import { Button, FlexContainer, Link, P } from '@shalecss/react';
import {
  type CommonDialogProps,
  SimpleDialog,
} from '../SimpleDialog/SimpleDialog.tsx';

// @ts-expect-error trust me bro it's in rsbuild.config.ts
const COMMIT = import.meta.COMMIT_HASH || 'unknown';

export const AboutDialog: React.FC<CommonDialogProps> = ({ id }) => (
  <SimpleDialog
    id={id}
    title="About"
    actions={
      <Button commandfor={id} command="close">
        OK
      </Button>
    }
  >
    <FlexContainer variant="center" style="align-items: center">
      <img src="favicon.ico" alt="Logo" width={64} height={64} />
      <P>
        utilpanel
        <br />
        <span style="opacity: 0.5">commit {COMMIT.slice(0, 8)}</span>
        <br />
        <Link
          href={`https://github.com/logonoff/utilpanel/tree/${COMMIT}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View source
        </Link>
      </P>
    </FlexContainer>
  </SimpleDialog>
);
