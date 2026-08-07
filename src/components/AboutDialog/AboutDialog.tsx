import { Button, FlexContainer, Link, P } from '@shalecss/react';
import { SimpleDialog } from '../SimpleDialog/SimpleDialog';

const COMMIT = process.env.COMMIT_HASH || 'unknown';

export const AboutDialog: React.FC = () => {
  return (
    <SimpleDialog
      id="about-dialog"
      title="About"
      actions={
        <Button commandfor="about-dialog" command="close">
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
};
