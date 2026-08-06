import { Button, FlexContainer, P } from '@shalecss/react';
import { SimpleDialog } from '../SimpleDialog/SimpleDialog';

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
      <FlexContainer variant="center">
        <P>utilpanel - WIP</P>
      </FlexContainer>
    </SimpleDialog>
  );
};
